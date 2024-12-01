// Inicializamos el carrito
let carrito = [];

// Número de WhatsApp al que se enviará el mensaje (en formato internacional)
const numeroWhatsApp = "5493735308294"; // Reemplaza con el número deseado

// Función para cargar el carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();  // Refrescamos el DOM con los productos cargados
    }
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para abrir la imagen en un modal
function abrirImagen(src) {
    const modal = document.getElementById('modal');
    const imagenAmpliada = document.getElementById('imagen-ampliada');
    modal.style.display = 'block';
    imagenAmpliada.src = src;
}

// Función para cerrar el modal
function cerrarImagen() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Función para agregar un producto al carrito
function agregarAlCarrito(nombreProducto, precio) {
    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.find(item => item.nombre === nombreProducto);
    
    if (productoExistente) {
        // Si el producto ya existe, aumentar la cantidad
        productoExistente.cantidad += 1;
        productoExistente.precioTotal += precio; // Actualizar el precio total por producto
    } else {
        // Si el producto no existe, agregarlo al carrito
        carrito.push({ nombre: nombreProducto, precio: precio, cantidad: 1, precioTotal: precio });
    }

    guardarCarrito(); // Guardamos el carrito
    actualizarCarrito(); // Actualizamos el carrito visual
}

// Función para actualizar el carrito en el DOM
function actualizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    listaCarrito.innerHTML = ''; // Limpiamos la lista

    let total = 0; // Inicializamos el total

    carrito.forEach((producto) => {
        const li = document.createElement('li');
        li.textContent = `${producto.nombre} (x${producto.cantidad}) - $${producto.precioTotal.toFixed(2)}`;
        
        // Añadir botones para disminuir y aumentar la cantidad
        const btnMenos = document.createElement('button');
        btnMenos.textContent = '-';
        btnMenos.onclick = () => {
            modificarCantidad(producto.nombre, -1);
        };

        const btnMas = document.createElement('button');
        btnMas.textContent = '+';
        btnMas.onclick = () => {
            modificarCantidad(producto.nombre, 1);
        };

        // Añadir un botón para eliminar el producto
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => {
            eliminarDelCarrito(producto.nombre);
        };
        
        li.appendChild(btnMenos);
        li.appendChild(btnMas);
        li.appendChild(btnEliminar);
        listaCarrito.appendChild(li);
        
        total += producto.precioTotal; // Sumar al total
    });

    totalCarrito.textContent = `Total: $${total.toFixed(2)}`; // Actualizar el total
    document.getElementById('contador-carrito').textContent = `(${carrito.length})`; // Actualizar el contador
}

// Función para modificar la cantidad de un producto en el carrito
function modificarCantidad(nombreProducto, cantidad) {
    const producto = carrito.find(item => item.nombre === nombreProducto);
    
    if (producto) {
        producto.cantidad += cantidad;
        producto.precioTotal = producto.cantidad * producto.precio;

        // Si la cantidad llega a 0, eliminar el producto del carrito
        if (producto.cantidad <= 0) {
            eliminarDelCarrito(nombreProducto);
        } else {
            guardarCarrito(); // Guardar cambios
            actualizarCarrito(); // Actualizar visual
        }
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(nombreProducto) {
    carrito = carrito.filter(producto => producto.nombre !== nombreProducto);
    guardarCarrito(); // Guardar cambios
    actualizarCarrito(); // Actualizar visual
}

// Función para mostrar y ocultar el carrito
function toggleCarrito() {
    const carritoPopup = document.getElementById('carrito-popup');
    carritoPopup.classList.toggle('mostrar');
}

// Función para construir el mensaje y abrir WhatsApp
function enviarPorWhatsApp(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto

    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let mensaje = "¡Hola! quería realizar el siguiente pedido:\n\n";
    let total = 0;

    carrito.forEach(item => {
        mensaje += `${item.nombre} (x${item.cantidad}) - $${item.precioTotal.toFixed(2)}\n`;
        total += item.precioTotal;
    });

    mensaje += `\nTotal: $${total.toFixed(2)}`;

    // Codificamos el mensaje para la URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    const enlaceWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensajeCodificado}`;

    // Abrimos el enlace en una nueva ventana
    window.open(enlaceWhatsApp, "_blank");
}

// Asegúrate de que la función se llame al hacer clic en el botón
document.getElementById('enviarWhatsapp').onclick = enviarPorWhatsApp;

// Cargar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', cargarCarrito);

// Función para verificar la visibilidad del footer
function checkFooterVisibility() {
    const mainContainer = document.querySelector('.main-container'); // Asegúrate de que esta clase esté en el contenedor principal
    const footer = document.querySelector('footer');
    const mainHeight = mainContainer.offsetHeight;
    const windowHeight = window.innerHeight;

    // Si el contenedor principal no ocupa toda la altura de la ventana, muestra el footer
    if (mainHeight < windowHeight) {
        footer.classList.add('footer-visible'); // Muestra el footer
    } else {
        footer.classList.remove('footer-visible'); // Oculta el footer
    }
}

// Ejecutar al cargar la página y al redimensionar
window.addEventListener('load', checkFooterVisibility);
window.addEventListener('resize', checkFooterVisibility);




