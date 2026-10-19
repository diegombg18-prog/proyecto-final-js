// Referencias globales del DOM (Solo se declaran AQUÍ)
const contenedorProductos = document.getElementById("contenedorProductos");
const tablaCarrito = document.getElementById("tablaCarrito");
const montoTotal = document.getElementById("montoTotal");
const contadorCarrito = document.getElementById("contadorCarrito");

// Función para renderizar el catálogo de productos
function renderizarProductos(listaProductos) {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = "";
    
    listaProductos.forEach(({ id, nombre, precio, categoria, imagen }) => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "col-md-4 mb-4";
        tarjeta.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${imagen}" class="card-img-top" alt="${nombre}"; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-secondary mb-2 align-self-start">${categoria}</span>
                    <h5 class="card-title">${nombre}</h5>
                    <p class="card-text fw-bold text-success">$${precio}</p>
                    <button class="btn btn-primary mt-auto" onclick="agregarAlCarrito(${id})">Agregar al Carrito</button>
                </div>
            </div>
        `;
        contenedorProductos.appendChild(tarjeta);
    });
}

// Función para renderizar el carrito
function renderizarCarritoUI(carrito) {
    if (!tablaCarrito) return;
    tablaCarrito.innerHTML = "";

    carrito.forEach(({ id, nombre, precio, cantidad }) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${nombre}</td>
            <td>$${precio}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${id}, -1)">-</button>
                <span class="mx-2">${cantidad}</span>
                <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${id}, 1)">+</button>
            </td>
            <td>$${precio * cantidad}</td>
            <td><button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${id})">Eliminar</button></td>
        `;
        tablaCarrito.appendChild(fila);
    });

    const totalGeneral = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    if (montoTotal) montoTotal.innerText = totalGeneral;
    if (contadorCarrito) contadorCarrito.innerText = cantidadTotal;
}