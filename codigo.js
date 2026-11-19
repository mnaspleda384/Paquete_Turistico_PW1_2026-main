/* ==========================================================
   codigo.js — Funciones del sitio Luma
   ========================================================== */
 
const temaOscuro = document.getElementById("tema-oscuro");
const temaClaro = document.getElementById("tema-claro");
 
const resultados = document.getElementById("resultados");
const vistaTarjetas = document.getElementById("vista-tarjetas");
const vistaLista = document.getElementById("vista-lista");
 
const botonCarrito = document.getElementById("boton-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const carritoCantidad = document.getElementById("carrito-cantidad");
const carritoTotal = document.getElementById("carrito-total");
const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");
const btnFinalizarCompra = document.getElementById("btn-finalizar-compra");
 
const listaFavoritos = document.getElementById("lista-favoritos");
 
const formNuevoPaquete = document.getElementById("form-nuevo-paquete");
const btnAdjuntarImagen = document.getElementById("btn-adjuntar-imagen");
const inputImagenPaquete = document.getElementById("input-imagen-paquete");
const nombreImagenSeleccionada = document.getElementById("nombre-imagen-seleccionada");
const adminPaquetes = document.getElementById("admin-paquetes");
 
const formLogin = document.getElementById("form-login");
const formCrearUsuario = document.getElementById("form-crear-usuario");
 
const carruselPista = document.getElementById("carrusel-pista");
const carruselAnterior = document.getElementById("carrusel-anterior");
const carruselSiguiente = document.getElementById("carrusel-siguiente");
const carruselPuntos = document.getElementById("carrusel-puntos");
 
 
/* ---------- Utilidades ---------- */
function formatearPrecio(numero) {
    return "$ " + Number(numero).toLocaleString("es-AR");
}
 
 
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
 
 
/* ==========================================================
   Gestión de Usuarios, Perfiles (Administrador / Usuario) y Sesión
   ========================================================== */
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuariosLuma")) || [];
}
 
function guardarUsuarios(usuarios) {
    localStorage.setItem("usuariosLuma", JSON.stringify(usuarios));
}
 
function existeAlMenosUnAdmin() {
    return obtenerUsuarios().some((u) => u.perfil === "administrador");
}
 
function obtenerSesionActual() {
    return JSON.parse(localStorage.getItem("sesionLuma")) || null;
}
 
function guardarSesionActual(usuario) {
    localStorage.setItem("sesionLuma", JSON.stringify(usuario));
}
 
function cerrarSesion() {
    localStorage.removeItem("sesionLuma");
}
 
/* --- Página inicio.html: verificar primer Administrador e inicio de sesión --- */
const tituloPrimerUsuario = document.getElementById("titulo-primer-usuario");
const textoPrimerUsuario = document.getElementById("texto-primer-usuario");
const btnCrearUsuario = document.getElementById("btn-crear-usuario");
 
if (tituloPrimerUsuario && textoPrimerUsuario && btnCrearUsuario) {
    if (!existeAlMenosUnAdmin()) {
        tituloPrimerUsuario.textContent = "No hay ningún Administrador registrado";
        textoPrimerUsuario.textContent =
            "Para comenzar a operar en Luma, primero debés crear un usuario con perfil Administrador.";
        btnCrearUsuario.textContent = "Crear primer Administrador";
    } else {
        tituloPrimerUsuario.textContent = "¿Todavía no tenés cuenta?";
        textoPrimerUsuario.textContent = "Registrate como Usuario o Administrador para ingresar.";
        btnCrearUsuario.textContent = "Crear usuario";
    }
}
 
if (formLogin) {
    formLogin.addEventListener("submit", (evento) => {
        evento.preventDefault();
 
        // Verifica que exista al menos un usuario con perfil Administrador
        if (!existeAlMenosUnAdmin()) {
            alert(
                "No existe ningún usuario con perfil Administrador. Por favor, creá el primer usuario con perfil Administrador."
            );
            window.location.href = "crearUsuario.html";
            return;
        }
 
        const usuarioIngresado = document.getElementById("usuario").value.trim();
        const contrasenaIngresada = document.getElementById("contrasena").value;
 
        const usuarios = obtenerUsuarios();
        const encontrado = usuarios.find(
            (u) => u.usuario.toLowerCase() === usuarioIngresado.toLowerCase() && u.contrasena === contrasenaIngresada
        );
 
        if (!encontrado) {
            alert("Usuario o contraseña incorrectos.");
            return;
        }
 
        guardarSesionActual(encontrado);
 
        if (encontrado.perfil === "administrador") {
            window.location.href = "miAdmin.html";
        } else {
            window.location.href = "usuario.html";
        }
    });
}
 
/* --- Página crearUsuario.html: registro con perfil Administrador o Usuario --- */
if (formCrearUsuario) {
    const selectPerfil = document.getElementById("perfil");
    const subtituloRegistro = document.getElementById("subtitulo-registro");
 
    if (!existeAlMenosUnAdmin() && selectPerfil) {
        selectPerfil.value = "administrador";
        if (subtituloRegistro) {
            subtituloRegistro.textContent =
                "Atención: Todavía no hay ningún Administrador. El primer usuario debe tener perfil Administrador.";
        }
    }
 
    formCrearUsuario.addEventListener("submit", (evento) => {
        evento.preventDefault();
 
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const mail = document.getElementById("mail").value.trim();
        const usuario = document.getElementById("usuario").value.trim();
        const perfil = selectPerfil ? selectPerfil.value : "usuario";
        const contrasena = document.getElementById("contrasena").value;
        const contrasena2 = document.getElementById("contrasena2").value;
 
        if (!existeAlMenosUnAdmin() && perfil !== "administrador") {
            alert("El primer usuario del sistema debe crearse con perfil Administrador.");
            if (selectPerfil) selectPerfil.value = "administrador";
            return;
        }
 
        if (contrasena !== contrasena2) {
            alert("Las contraseñas no coinciden.");
            return;
        }
 
        const usuarios = obtenerUsuarios();
        if (usuarios.some((u) => u.usuario.toLowerCase() === usuario.toLowerCase())) {
            alert("Ese nombre de usuario ya existe. Elegí otro.");
            return;
        }
 
        usuarios.push({ nombre, apellido, mail, usuario, perfil, contrasena });
        guardarUsuarios(usuarios);
 
        alert("¡Usuario @" + usuario + " (" + perfil + ") creado con éxito! Ahora podés iniciar sesión.");
        window.location.href = "inicio.html";
    });
}
 
/* --- Control de sesión y alternancia entre perfiles sin cerrar sesión --- */
const sesionActual = obtenerSesionActual();
const paginaActual = window.location.pathname.split("/").pop().toLowerCase();
 
if (sesionActual) {
    // Muestra el @usuario real en el header
    const nombreHeader = document.querySelector(".usuario-header p");
    if (nombreHeader) {
        nombreHeader.textContent = "@" + sesionActual.usuario;
    }
 
    // Controla el acceso y el botón de alternar perfil según si es Administrador o Usuario
    const enlacesAdmin = document.querySelectorAll('.navegacion a[href="miAdmin.html"]');
    if (sesionActual.perfil !== "administrador") {
        // Si es Usuario común, oculta "Cambiar a Administrador" y bloquea el acceso directo a miAdmin.html
        enlacesAdmin.forEach((enlace) => {
            enlace.style.display = "none";
        });
        if (paginaActual === "miadmin.html") {
            alert("Acceso restringido: esta sección es solo para perfil Administrador.");
            window.location.href = "usuario.html";
        }
    }
 
    // Completa los datos en miCuenta.html si están los elementos
    const cuentaNombre = document.getElementById("cuenta-nombre");
    const cuentaApellido = document.getElementById("cuenta-apellido");
    const cuentaEmail = document.getElementById("cuenta-email");
    const cuentaPerfil = document.getElementById("cuenta-perfil");
 
    if (cuentaNombre) cuentaNombre.textContent = sesionActual.nombre;
    if (cuentaApellido) cuentaApellido.textContent = sesionActual.apellido;
    if (cuentaEmail) cuentaEmail.textContent = sesionActual.mail;
    if (cuentaPerfil) {
        cuentaPerfil.textContent =
            sesionActual.perfil === "administrador" ? "Administrador" : "Usuario";
    }
}
 
// Al hacer clic en "Cerrar sesión", limpia la sesión antes de volver a inicio.html
document.querySelectorAll('.navegacion a[href="inicio.html"]').forEach((enlaceCerrar) => {
    enlaceCerrar.addEventListener("click", () => {
        cerrarSesion();
    });
});
 
 
/* ---------- Paquetes creados por el Administrador (miAdmin.html y usuario.html) ---------- */
function obtenerPaquetesAdmin() {
    return JSON.parse(localStorage.getItem("paquetesAdmin")) || [];
}
 
function guardarPaquetesAdmin(paquetes) {
    localStorage.setItem("paquetesAdmin", JSON.stringify(paquetes));
}
 
function renderizarPaquetesAdminEnAdmin() {
    if (!adminPaquetes) return;
 
    adminPaquetes.querySelectorAll(".paquete-creado").forEach((el) => el.remove());
 
    const paquetes = obtenerPaquetesAdmin();
    paquetes.forEach((paq) => {
        const articulo = document.createElement("article");
        articulo.className = "tarjeta-paquete paquete-creado";
        articulo.innerHTML = `
<img src="${paq.imagen}" alt="${paq.destino}" class="img-paquete">
<div class="contenido-paquete">
<h3>${paq.destino}</h3>
<p class="etiqueta-origen">Saliendo desde ${paq.origen} (${paq.fechaInicio} al ${paq.fechaFin})</p>
<p>${paq.descripcion}</p>
<ul>
<li>Duración: ${paq.dias} días</li>
<li>Precio: ${formatearPrecio(paq.precio)}</li>
</ul>
</div>
<button type="button" class="btn-eliminar-paquete" data-id="${paq.id}">Eliminar paquete</button>
        `;
        adminPaquetes.appendChild(articulo);
    });
}
 
function renderizarPaquetesAdminEnUsuario() {
    if (!resultados) return;
 
    resultados.querySelectorAll(".paquete-creado").forEach((el) => el.remove());
 
    const paquetes = obtenerPaquetesAdmin();
    paquetes.forEach((paq) => {
        const idCheck = "fav-admin-" + paq.id;
        const articulo = document.createElement("article");
        articulo.className = "paquete-creado";
        articulo.innerHTML = `
<a href="usuario.html">
<img src="${paq.imagen}" alt="${paq.destino}" width="300">
</a>
<h2>${paq.destino}</h2>
<p>${paq.descripcion}</p>
<ul>
<li>Duración: ${paq.dias} días</li>
<li>Precio: ${formatearPrecio(paq.precio)}</li>
</ul>
<div class="opcion-favorito">
<input type="checkbox" id="${idCheck}">
<label for="${idCheck}">Favorito</label>
</div>
<button type="button">Agregar al carrito</button>
        `;
        resultados.appendChild(articulo);
    });
}
 
if (formNuevoPaquete) {
    let imagenBase64 = "./Imagenes/fondoInicioPrincipal.jpg";
 
    if (btnAdjuntarImagen && inputImagenPaquete) {
        btnAdjuntarImagen.addEventListener("click", () => {
            inputImagenPaquete.click();
        });
 
        inputImagenPaquete.addEventListener("change", () => {
            const archivo = inputImagenPaquete.files[0];
            if (!archivo) return;
 
            if (nombreImagenSeleccionada) {
                nombreImagenSeleccionada.textContent = "Imagen seleccionada: " + archivo.name;
            }
 
            const lector = new FileReader();
            lector.onload = (e) => {
                imagenBase64 = e.target.result;
            };
            lector.readAsDataURL(archivo);
        });
    }
 
    formNuevoPaquete.addEventListener("submit", (evento) => {
        evento.preventDefault();
 
        const origen = document.getElementById("origen").value.trim();
        const destino = document.getElementById("destino").value.trim();
        const fechaInicio = document.getElementById("Fecha_Inicio").value;
        const fechaFin = document.getElementById("Fecha_Fin").value;
        const dias = parseInt(document.getElementById("Cantidad").value, 10) || 1;
        const precio = parseInt(document.getElementById("precio").value, 10) || 0;
        const descripcion = document.getElementById("descripcion").value.trim();
 
        const paquetes = obtenerPaquetesAdmin();
        paquetes.push({
            id: Date.now(),
            origen,
            destino,
            fechaInicio,
            fechaFin,
            dias,
            precio,
            descripcion,
            imagen: imagenBase64
        });
 
        guardarPaquetesAdmin(paquetes);
        renderizarPaquetesAdminEnAdmin();
 
        formNuevoPaquete.reset();
        imagenBase64 = "./Imagenes/fondoInicioPrincipal.jpg";
        if (nombreImagenSeleccionada) nombreImagenSeleccionada.textContent = "";
 
        alert("¡Paquete a " + destino + " cargado correctamente!");
    });
}
 
if (adminPaquetes) {
    adminPaquetes.addEventListener("click", (evento) => {
        if (evento.target.classList.contains("btn-eliminar-paquete")) {
            const id = Number(evento.target.getAttribute("data-id"));
            const paquetes = obtenerPaquetesAdmin().filter((paq) => paq.id !== id);
            guardarPaquetesAdmin(paquetes);
            renderizarPaquetesAdminEnAdmin();
        }
    });
 
    renderizarPaquetesAdminEnAdmin();
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
 
 
/* ---------- Favoritos (usuario.html y miCuenta.html) ---------- */
function obtenerFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}
 
function guardarFavoritos(favoritos) {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}
 
function renderizarFavoritos() {
    if (!listaFavoritos) return;
 
    const favoritos = obtenerFavoritos();
    listaFavoritos.innerHTML = "";
 
    if (favoritos.length === 0) {
        listaFavoritos.innerHTML = `
<div class="fav-vacio">
<p>Todavía no agregaste paquetes a favoritos.</p>
<a href="usuario.html" class="boton_secundario">Explorar paquetes</a>
</div>
        `;
        return;
    }
 
    favoritos.forEach((fav) => {
        const articulo = document.createElement("article");
        articulo.className = "item-fav";
        articulo.innerHTML = `
<a href="${fav.enlace}">
<img src="${fav.imagen}" alt="${fav.destino}" width="300">
<h3>${fav.destino}</h3>
</a>
<button type="button" class="btn-quitar-fav" data-destino="${fav.destino}">Quitar</button>
        `;
        listaFavoritos.appendChild(articulo);
    });
}
 
if (resultados) {
    renderizarPaquetesAdminEnUsuario();
 
    const favoritosGuardados = obtenerFavoritos();
    resultados.querySelectorAll("article").forEach((tarjeta) => {
        const destino = tarjeta.querySelector("h2").textContent.trim();
        const checkbox = tarjeta.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.checked = favoritosGuardados.some((fav) => fav.destino === destino);
        }
    });
 
    resultados.addEventListener("change", (evento) => {
        if (evento.target.type === "checkbox") {
            const tarjeta = evento.target.closest("article");
            const destino = tarjeta.querySelector("h2").textContent.trim();
            const imagen = tarjeta.querySelector("img").getAttribute("src");
            const enlaceEl = tarjeta.querySelector("a");
            const enlace = enlaceEl ? enlaceEl.getAttribute("href") : "usuario.html";
 
            let favoritos = obtenerFavoritos();
 
            if (evento.target.checked) {
                if (!favoritos.some((fav) => fav.destino === destino)) {
                    favoritos.push({ destino, imagen, enlace });
                }
            } else {
                favoritos = favoritos.filter((fav) => fav.destino !== destino);
            }
 
            guardarFavoritos(favoritos);
        }
    });
}
 
if (listaFavoritos) {
    listaFavoritos.addEventListener("click", (evento) => {
        if (evento.target.classList.contains("btn-quitar-fav")) {
            const destino = evento.target.getAttribute("data-destino");
            const favoritos = obtenerFavoritos().filter((fav) => fav.destino !== destino);
            guardarFavoritos(favoritos);
            renderizarFavoritos();
        }
    });
 
    renderizarFavoritos();
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
 
 
/* ---------- Carrusel de paquetes (inicio.html) ---------- */
if (carruselPista && carruselAnterior && carruselSiguiente && carruselPuntos) {
    const paquetesCarrusel = [
        {
            categoria: "Patagonia",
            destino: "Bariloche",
            detalle: "7 días · Vuelo + Hotel",
            precio: "$ 650.000",
            imagen: "./Imagenes/fotoCentroBariloche.jpg",
            enlace: "PaqueteBariloche.html"
        },
        {
            categoria: "Litoral",
            destino: "Cataratas del Iguazú",
            detalle: "5 días · Excursiones incluidas",
            precio: "$ 480.000",
            imagen: "./Imagenes/Cataratas_del_Iguazú_en_Argentina.jpg",
            enlace: "PaqueteIguazu.html"
        },
        {
            categoria: "Caribe",
            destino: "Cancún",
            detalle: "10 días · All Inclusive",
            precio: "$ 1.900.000",
            imagen: "./Imagenes/Cancun.jpg",
            enlace: "PaqueteCancun.html"
        },
        {
            categoria: "Cuyo",
            destino: "Mendoza",
            detalle: "4 días · Bodegas y montaña",
            precio: "$ 390.000",
            imagen: "./Imagenes/Mendoza.jpg",
            enlace: "PaqueteMendoza.html"
        },
        {
            categoria: "Sur Argentino",
            destino: "Santa Cruz",
            detalle: "14 días · Glaciares",
            precio: "$ 2.000.000",
            imagen: "./Imagenes/SantaCruz.jpg",
            enlace: "PaqueteSantaCruz.html"
        }
    ];
 
    paquetesCarrusel.forEach((paquete, indice) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "carrusel-tarjeta";
        tarjeta.innerHTML = `
<a href="${paquete.enlace}">
<img src="${paquete.imagen}" alt="${paquete.destino}">
<div class="carrusel-texto">
<span class="carrusel-categoria">${paquete.categoria}</span>
<h3>${paquete.destino}</h3>
<p class="carrusel-detalle">${paquete.detalle}</p>
<span class="carrusel-etiqueta-precio">Desde</span>
<span class="carrusel-precio">${paquete.precio}</span>
</div>
</a>
        `;
        carruselPista.appendChild(tarjeta);
 
        const punto = document.createElement("button");
        punto.type = "button";
        punto.setAttribute("aria-label", "Ir a " + paquete.destino);
        if (indice === 0) punto.classList.add("activo");
        punto.addEventListener("click", () => {
            const anchoTarjeta = tarjeta.offsetWidth + 18;
            carruselPista.scrollLeft = anchoTarjeta * indice;
        });
        carruselPuntos.appendChild(punto);
    });
 
    function actualizarControlesCarrusel() {
        const tarjetas = carruselPista.querySelectorAll(".carrusel-tarjeta");
        const puntos = carruselPuntos.querySelectorAll("button");
        if (tarjetas.length === 0) return;
 
        const maxScroll = carruselPista.scrollWidth - carruselPista.clientWidth;
 
        carruselAnterior.classList.toggle("oculta", carruselPista.scrollLeft <= 5);
        carruselSiguiente.classList.toggle("oculta", carruselPista.scrollLeft >= maxScroll - 5);
 
        const anchoTarjeta = tarjetas[0].offsetWidth + 18;
        const indiceActivo = Math.min(
            puntos.length - 1,
            Math.round(carruselPista.scrollLeft / anchoTarjeta)
        );
        puntos.forEach((p, i) => p.classList.toggle("activo", i === indiceActivo));
    }
 
    carruselSiguiente.addEventListener("click", () => {
        const tarjeta = carruselPista.querySelector(".carrusel-tarjeta");
        const paso = tarjeta ? tarjeta.offsetWidth + 18 : 260;
        carruselPista.scrollLeft += paso;
    });
 
    carruselAnterior.addEventListener("click", () => {
        const tarjeta = carruselPista.querySelector(".carrusel-tarjeta");
        const paso = tarjeta ? tarjeta.offsetWidth + 18 : 260;
        carruselPista.scrollLeft -= paso;
    });
 
    carruselPista.addEventListener("scroll", actualizarControlesCarrusel);
    window.addEventListener("resize", actualizarControlesCarrusel);
    actualizarControlesCarrusel();
}