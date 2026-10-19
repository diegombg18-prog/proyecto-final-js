// --- ESTADO GLOBAL ---
let productosDisponibles = [];
let carrito = obtenerCarritoStorage(); // Viene de storage.js

// Referencias a elementos que solo usa main.js
const btnVaciarCarrito = document.getElementById("btnVaciarCarrito");
const btnConfirmarCompra = document.getElementById("btnConfirmarCompra");

// --- CARGAR PRODUCTOS ---
async function cargarProductos() {
    try {
        const respuesta = await fetch("./data/producto.json");
        if (!respuesta.ok) throw new Error("No se pudo cargar el JSON.");
        
        productosDisponibles = await respuesta.json();
        renderizarProductos(productosDisponibles); // Función definida en ui.js
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error de carga",
            text: "No se pudieron obtener los datos de la tienda.",
        });
    }
}

// --- LÓGICA DEL CARRITO ---
window.agregarAlCarrito = (idProducto) => {
    const productoEncontrado = productosDisponibles.find(p => p.id === idProducto);
    const itemEnCarrito = carrito.find(item => item.id === idProducto);

    itemEnCarrito 
        ? itemEnCarrito.cantidad++ 
        : carrito.push({ ...productoEncontrado, cantidad: 1 });

    actualizarStorageYVista();

    Toastify({
        text: `Agregaste ${productoEncontrado.nombre} al carrito`,
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: { background: "#198754" }
    }).showToast();
};

window.cambiarCantidad = (idProducto, delta) => {
    const item = carrito.find(p => p.id === idProducto);
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(idProducto);
            return;
        }
    }
    actualizarStorageYVista();
};

window.eliminarDelCarrito = (idProducto) => {
    carrito = carrito.filter(p => p.id !== idProducto);
    actualizarStorageYVista();
};

function actualizarStorageYVista() {
    guardarCarritoStorage(carrito); // Viene de storage.js
    renderizarCarritoUI(carrito);   // Viene de ui.js
}

// Vaciar Carrito
if (btnVaciarCarrito) {
    btnVaciarCarrito.addEventListener("click", () => {
        if (carrito.length === 0) return;

        Swal.fire({
            title: "¿Vaciar el carrito?",
            text: "Se eliminarán todos los productos.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                limpiarStorage();
                actualizarStorageYVista();
                Swal.fire("Vaciado", "El carrito está vacío.", "success");
            }
        });
    });
}

// Confirmar Compra
if (btnConfirmarCompra) {
    btnConfirmarCompra.addEventListener("click", () => {
        if (carrito.length === 0) {
            Swal.fire("Carrito vacío", "Agrega al menos un producto.", "info");
            return;
        }

        const totalCompra = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const numeroOrden = Math.floor(100000 + Math.random() * 900000);

        Swal.fire({
            title: "¡Compra Confirmada!",
            html: `
                <p><b>Orden N°:</b> ${numeroOrden}</p>
                <p>Tu pedido ha sido procesado con éxito.</p>
                <p class="fw-bold text-success fs-5">Total pagado: $${totalCompra}</p>
            `,
            icon: "success",
            confirmButtonText: "Aceptar"
        }).then(() => {
            carrito = [];
            limpiarStorage();
            actualizarStorageYVista();
        });
    });
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    renderizarCarritoUI(carrito);
});