// Funciones para la gestión de LocalStorage
const CLAVE_STORAGE = "carrito";

function guardarCarritoStorage(carrito) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(carrito));
}

function obtenerCarritoStorage() {
    return JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];
}

function limpiarStorage() {
    localStorage.removeItem(CLAVE_STORAGE);
}