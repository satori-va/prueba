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

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = []; // Vaciar el arreglo
    guardarCarrito(); // Actualizar en localStorage
    actualizarCarrito(); // Actualizar el DOM
}

function confirmarVaciarCarrito() {
    const totalProductos = carrito.reduce((sum, producto) => sum + producto.cantidad, 0); 
    const mensaje = `¿Estás seguro? Se van a borrar ${totalProductos} producto${totalProductos !== 1 ? 's' : ''}`;


    // Mostrar el modal con el mensaje
    document.getElementById('mensajeConfirmacion').textContent = mensaje;
    document.getElementById('modalConfirmacion').style.display = 'flex';
}

function cerrarModal() {
    // Cerrar el modal
    document.getElementById('modalConfirmacion').style.display = 'none';
}

// Modificar la función vaciarCarrito para que cierre el modal después de vaciar
function vaciarCarrito() {
    carrito = []; // Vaciar el arreglo
    guardarCarrito(); // Actualizar en localStorage
    actualizarCarrito(); // Actualizar el DOM
    cerrarModal(); // Cerrar el modal
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
    mostrarMensajeAgregado(); // Mostrar el mensaje de "Producto agregado"
}

// Función para mostrar el mensaje de "Producto agregado"
function mostrarMensajeAgregado() {
    const mensaje = document.createElement('div');
    mensaje.classList.add('mensaje-agregado');
    mensaje.textContent = 'PRODUCTO AGREGADO';
    
    document.body.appendChild(mensaje);

    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
        mensaje.remove();
    }, 3000);
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

// Función para mostrar el modal de carrito vacío
function mostrarAvisoCarritoVacio() {
    const modalAviso = document.getElementById('modal-aviso');
    modalAviso.style.display = 'flex';
}

// Función para cerrar el modal de carrito vacío
function cerrarAvisoCarritoVacio() {
    const modalAviso = document.getElementById('modal-aviso');
    modalAviso.style.display = 'none';
}

// Función para enviar el mensaje por WhatsApp
function enviarPorWhatsApp(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto

    if (carrito.length === 0) {
        mostrarAvisoCarritoVacio(); // Mostrar aviso si el carrito está vacío
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

// Función para aceptar el aviso de carrito vacío
function aceptarAviso() {
    cerrarAvisoCarritoVacio();
}

// Función para cancelar el aviso de carrito vacío
function cancelarAviso() {
    cerrarAvisoCarritoVacio();
}






