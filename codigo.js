const temaOscuro = document.getElementById("tema-oscuro");
const temaClaro = document.getElementById("tema-claro");

const resultados = document.getElementById("resultados");
const vistaTarjetas = document.getElementById("vista-tarjetas");
const vistaLista = document.getElementById("vista-lista");

const botonCarrito = document.getElementById("boton-carrito");
const contadorCarrito = document.getElementById("contador-carrito");


/* ---------- Modo oscuro ---------- */
function aplicarTema(tema) {
    if (tema === "oscuro") {
        document.body.classList.add("oscuro");
        temaOscuro.checked = true;
    } else {
        document.body.classList.remove("oscuro");
        temaClaro.checked = true;
    }
    localStorage.setItem("tema", tema); // queda guardado para las otras páginas
}

if (temaOscuro && temaClaro) {
    temaOscuro.addEventListener("change", () => aplicarTema("oscuro"));
    temaClaro.addEventListener("change", () => aplicarTema("claro"));

    // Al abrir la página se aplica el tema que estaba guardado
    aplicarTema(localStorage.getItem("tema") || "claro");
}


/* ---------- Vista tarjetas / lista (usuario.html) ---------- */
if (resultados && vistaTarjetas && vistaLista) {
    vistaLista.addEventListener("change", () => {
        resultados.classList.remove("tarjetas");
        resultados.classList.add("lista");
    });

    vistaTarjetas.addEventListener("change", () => {
        resultados.classList.remove("lista");
        resultados.classList.add("tarjetas");
    });
}


/* ---------- Carrito ---------- */
// El carrito es un array de destinos guardado en el Local Storage como JSON
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function actualizarContador() {
    if (contadorCarrito) {
        contadorCarrito.textContent = obtenerCarrito().length;
    }
}

function agregarAlCarrito(destino) {
    const carrito = obtenerCarrito();

    if (carrito.includes(destino)) {
        alert(destino + " ya está en tu carrito.");
        return;
    }

    carrito.push(destino);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();

    // Animación del contador (se quita y se vuelve a poner la clase)
    contadorCarrito.classList.remove("rebote");
    void contadorCarrito.offsetWidth;
    contadorCarrito.classList.add("rebote");
}

if (resultados) {
    // Un solo listener para todos los botones "Agregar al carrito"
    resultados.addEventListener("click", (evento) => {
        if (evento.target.tagName === "BUTTON") {
            const tarjeta = evento.target.closest("article");
            const destino = tarjeta.querySelector("h2").textContent;
            agregarAlCarrito(destino);
        }
    });
}

if (botonCarrito) {
    botonCarrito.addEventListener("click", () => {
        const carrito = obtenerCarrito();
        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
        } else {
            /*queda vacio para no generar un alert cada vez que queramos entrar al carrito*/
        }
    });
}

actualizarContador();

/*Lo que hicimos para carrito */
const listaCarrito = document.getElementById("lista-carrito");
const carritoCantidad = document.getElementById("carrito-cantidad");
const carritoTotal = document.getElementById("carrito-total");
const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");
const btnFinalizarCompra = document.getElementById("btn-finalizar-compra");


/* ---------- Modo oscuro ---------- */
function aplicarTema(tema) {
    if (tema === "oscuro") {
        document.body.classList.add("oscuro");
        if (temaOscuro) temaOscuro.checked = true;
    } else {
        document.body.classList.remove("oscuro");
        if (temaClaro) temaClaro.checked = true;
    }
    localStorage.setItem("tema", tema);
}

if (temaOscuro && temaClaro) {
    temaOscuro.addEventListener("change", () => aplicarTema("oscuro"));
    temaClaro.addEventListener("change", () => aplicarTema("claro"));
    aplicarTema(localStorage.getItem("tema") || "claro");
}


/* ---------- Vista tarjetas / lista (usuario.html) ---------- */
if (resultados && vistaTarjetas && vistaLista) {
    vistaLista.addEventListener("change", () => {
        resultados.classList.remove("tarjetas");
        resultados.classList.add("lista");
    });

    vistaTarjetas.addEventListener("change", () => {
        resultados.classList.remove("lista");
        resultados.classList.add("tarjetas");
    });
}


/* ---------- Carrito ---------- */
function obtenerCarrito() {
    const guardado = JSON.parse(localStorage.getItem("carrito")) || [];
    const valido = guardado.filter(
        (item) => item && typeof item === "object" && item.destino && typeof item.precio === "number"
    );
    if (valido.length !== guardado.length) {
        localStorage.setItem("carrito", JSON.stringify(valido));
    }
    return valido;
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
}

function actualizarContador() {
    if (contadorCarrito) {
        contadorCarrito.textContent = obtenerCarrito().length;
    }
}

function agregarAlCarrito(paquete) {
    const carrito = obtenerCarrito();

    const yaExiste = carrito.some((item) => item.destino === paquete.destino);
    if (yaExiste) {
        alert(paquete.destino + " ya está en tu carrito.");
        return;
    }

    carrito.push(paquete);
    guardarCarrito(carrito);

    if (contadorCarrito) {
        contadorCarrito.classList.remove("rebote");
        void contadorCarrito.offsetWidth;
        contadorCarrito.classList.add("rebote");
    }
}

function quitarDelCarrito(destino) {
    const carrito = obtenerCarrito().filter((item) => item.destino !== destino);
    guardarCarrito(carrito);
    renderizarCarrito();
}

function formatearPrecio(numero) {
    return "$ " + numero.toLocaleString("es-AR");
}

function renderizarCarrito() {
    if (!listaCarrito) return;

    const carrito = obtenerCarrito();
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = `
            <div class="carrito-vacio">
                <p>Tu carrito está vacío.</p>
                <a href="usuario.html" class="boton_secundario">Explorar paquetes</a>
            </div>
        `;
        if (carritoCantidad) carritoCantidad.textContent = "0";
        if (carritoTotal) carritoTotal.textContent = "$ 0";
        return;
    }

    let total = 0;

    carrito.forEach((item) => {
        total += item.precio;

        const articulo = document.createElement("article");
        articulo.className = "item-carrito";
        articulo.innerHTML = `
            <img src="${item.imagen}" alt="${item.destino}">
            <div class="item-carrito-info">
                <h3>${item.destino}</h3>
                <p>${item.duracion}</p>
                <p class="item-carrito-precio">${formatearPrecio(item.precio)}</p>
            </div>
            <button type="button" class="btn-quitar" data-destino="${item.destino}">Quitar</button>
        `;
        listaCarrito.appendChild(articulo);
    });

    if (carritoCantidad) carritoCantidad.textContent = carrito.length;
    if (carritoTotal) carritoTotal.textContent = formatearPrecio(total);
}

/* Eventos en usuario.html para agregar paquetes */
if (resultados) {
    resultados.addEventListener("click", (evento) => {
        if (evento.target.tagName === "BUTTON") {
            const tarjeta = evento.target.closest("article");
            const destino = tarjeta.querySelector("h2").textContent.trim();
            const imagen = tarjeta.querySelector("img").getAttribute("src");
            const itemsLista = tarjeta.querySelectorAll("ul li");

            const duracion = itemsLista[0] ? itemsLista[0].textContent.trim() : "";
            const textoPrecio = itemsLista[1] ? itemsLista[1].textContent : "0";
            const precio = parseInt(textoPrecio.replace(/\D/g, ""), 10) || 0;

            agregarAlCarrito({ destino, imagen, duracion, precio });
        }
    });
}

/* Al tocar el ícono del carrito en el header */
if (botonCarrito) {
    botonCarrito.addEventListener("click", (evento) => {
        evento.preventDefault();
        const carrito = obtenerCarrito();

        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
        } else {
            window.location.href = "carrito.html";
        }
    });
}

/* Eventos en carrito.html para quitar o vaciar */
if (listaCarrito) {
    listaCarrito.addEventListener("click", (evento) => {
        if (evento.target.classList.contains("btn-quitar")) {
            const destino = evento.target.getAttribute("data-destino");
            quitarDelCarrito(destino);
        }
    });

    renderizarCarrito();
}

if (btnVaciarCarrito) {
    btnVaciarCarrito.addEventListener("click", () => {
        if (obtenerCarrito().length === 0) return;
        guardarCarrito([]);
        renderizarCarrito();
    });
}

if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener("click", () => {
        const carrito = obtenerCarrito();
        if (carrito.length === 0) {
            alert("Agregá al menos un paquete antes de finalizar la compra.");
            return;
        }
        alert("¡Gracias por tu compra en Luma! Reservaste " + carrito.length + " paquete(s).");
        guardarCarrito([]);
        renderizarCarrito();
    });
}

actualizarContador();


