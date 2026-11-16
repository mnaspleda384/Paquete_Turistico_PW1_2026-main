const temaOscuro = document.getElementById("tema-oscuro");
const temaClaro = document.getElementById("tema-claro");
const footer = document.getElementById("footer");

const resultados = document.getElementById("resultados");
const vistaTarjetas = document.getElementById("vista-tarjetas");
const vistaLista = document.getElementById("vista-lista");

vistaLista.addEventListener("click", () => {
    resultados.classList.remove("tarjetas");
    resultados.classList.add("lista");
});

vistaTarjetas.addEventListener("click", () => {
    resultados.classList.remove("lista");
    resultados.classList.add("tarjetas");
});


temaOscuro.addEventListener("click", () => {
    footer.classList.add("oscuro");
});

temaClaro.addEventListener("click", () => {
    footer.classList.remove("oscuro");
});


