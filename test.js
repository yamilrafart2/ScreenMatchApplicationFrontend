import getDatos from "./getDatos.js";

// Mapea los elementos DOM (Apunta a las listas UL existentes)
const elementos = {
    top5: document.querySelector('[data-name="top5"] .principal__seccion__grilla'),
    lancamentos: document.querySelector('[data-name="lanzamientos"] .principal__seccion__grilla'),
    series: document.querySelector('[data-name="series"] .principal__seccion__grilla')
};

// Función para crear la lista de peliculas 
function crearListaPeliculas(elemento, dados) {
    // Limpia el elemento UL que ya existe
    elemento.innerHTML = '';

    // Genera el HTML con las clases(.tarjeta, .tarjeta__poster)
    const listaHTML = dados.slice(0, 5).map((pelicula) => `
        <li class="tarjeta">
            <a href="/detalles.html?id=${pelicula.id}" class="tarjeta__enlace">
                <img src="${pelicula.poster}" alt="${pelicula.titulo}" class="tarjeta__poster">
            </a>
        </li>
    `).join('');

    elemento.innerHTML = listaHTML;
}

// Función genérica para manejo de errores.
function tratarErrores(mensajeError) {
    console.error(mensajeError);
}

// Función para alternar visibilidad (Toggle)
function limpiarErrores() {
    for (const section of sectionsParaOcultar) {
        // Usamos la clase para ocultar/mostrar
        section.classList.toggle('principal__seccion--oculta');
    }
}

const categoriaSelect = document.querySelector('[data-categorias]');
// Selecciona TODAS las secciones (las 3 visibles + la oculta de resultados)
const sectionsParaOcultar = document.querySelectorAll('.principal__seccion');

categoriaSelect.addEventListener('change', async function handleMudancaCategoria() {
    const categoriaSelecionada = categoriaSelect.value;
    // Define el contenedor donde irán los resultados
    const categoria = document.querySelector('[data-name="categoria"] .principal__seccion__grilla');

    if (categoriaSelecionada === 'todos') {
        // Si se elige "todos", vuelve al estado inicial (toggle invierte la visibilidad)
        limpiarErrores();
    } else {
        // Si se elige una categoría, hace toggle para ocultar las principales y mostrar la de resultados
        limpiarErrores();
        
        try {
            const data = await getDatos(`/series/categoria/${categoriaSelecionada}`);
            crearListaPeliculas(categoria, data);
        } catch (error) {
            tratarErrores("Se produjo un error al cargar los datos de la categoría..");
        }
    }
});

// Array de URLs para las solicitudes
gerarSeries();
async function gerarSeries() {
    const urls = ['/series/top5', '/series/lanzamientos', '/series'];

    try {
        // Hace todas las solicitudes en paralelo
        const data = await Promise.all(urls.map(url => getDatos(url)));
        crearListaPeliculas(elementos.top5, data[0]);
        crearListaPeliculas(elementos.lancamentos, data[1]);
        crearListaPeliculas(elementos.series, data[2]);
    } catch (error) {
        tratarErrores("Se produjo un error al cargar los datos..");
    }
}