import getdatos from "./getDatos.js";

// 1. Mapear elementos: Apunta directamente a las listas UL dentro de cada sección
const elementos = {
    top5: document.querySelector('[data-name="top5"] .principal__seccion__grilla'),
    lanzamientos: document.querySelector('[data-name="lanzamientos"] .principal__seccion__grilla'),
    series: document.querySelector('[data-name="series"] .principal__seccion__grilla')
};

// 2. Función para crear la lista de películas
function crearListaPeliculas(elemento, datos) {
    // No se crea el UL porque ya existe en el HTML.
    // Limpia su contenido actual.
    elemento.innerHTML = '';

    // Genera el HTML usando las clases definidas en styles.css (.tarjeta, .tarjeta__poster, etc.)
    const listaHTML = datos.map((pelicula) => `
        <li class="tarjeta">
            <a href="/detalles.html?id=${pelicula.id}" class="tarjeta__enlace">
                <img src="${pelicula.poster}" alt="${pelicula.titulo}" class="tarjeta__poster">
            </a>
        </li>
    `).join('');

    // Inyecta el HTML dentro del UL existente
    elemento.innerHTML = listaHTML;
}

// Función genérica para tratamiento de errores
function tratarConErrores(mensajeError) {
    console.error(mensajeError);
}

// 3. Lógica de Filtros
const categoriaSelect = document.querySelector('[data-categorias]');

// Selecciona las secciones usando la clase, excluye la de resultados
const sectionsParaOcultar = document.querySelectorAll('.principal__seccion:not([data-name="categoria"])');

categoriaSelect.addEventListener('change', function () {
    // Busca el contenedor UL de la sección de resultados
    const contenedorCategoria = document.querySelector('[data-name="categoria"] .principal__seccion__grilla');
    // Busca la sección entera para mostrarla/ocultarla
    const seccionCategoria = document.querySelector('[data-name="categoria"]');
    const categoriaSeleccionada = categoriaSelect.value;

    if (categoriaSeleccionada === 'todos') {
        // Mostrar secciones originales
        for (const section of sectionsParaOcultar) {
            // Usa la clase
            section.classList.remove('principal__seccion--oculta')
        }
        // Oculta sección de resultados
        seccionCategoria.classList.add('principal__seccion--oculta');

    } else {
        // Oculta secciones originales
        for (const section of sectionsParaOcultar) {
            section.classList.add('principal__seccion--oculta');
        }

        // Mostrar sección de resultados
        seccionCategoria.classList.remove('principal__seccion--oculta')
        
        // Petición al backend
        getdatos(`/series/categoria/${categoriaSeleccionada}`)
            .then(data => {
                crearListaPeliculas(contenedorCategoria, data);
            })
            .catch(error => {
                tratarConErrores("Ocurrio un error al cargar los datos de la categoria.");
            });
    }
});

// 4. Inicialización
generaSeries();
function generaSeries() {
    const urls = ['/series/top5', '/series/lanzamientos', '/series'];

    // Hace todas las solicitudes en paralelo
    Promise.all(urls.map(url => getdatos(url)))
        .then(data => {
            crearListaPeliculas(elementos.top5, data[0]);
            crearListaPeliculas(elementos.lanzamientos, data[1]);
            crearListaPeliculas(elementos.series, data[2].slice(0, 5));
        })
        .catch(error => {
            tratarConErrores("Ocurrio un error al cargar los datos.");
        });

}
