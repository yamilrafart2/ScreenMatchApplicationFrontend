import getDatos from "./getDatos.js";

const params = new URLSearchParams(window.location.search);
const serieId = params.get('id');
const listaTemporadas = document.getElementById('temporadas-select');
const fichaSerie = document.getElementById('temporadas-episodios');
const fichaDescripcion = document.getElementById('ficha-descripcion');

// Función para cargar temporadas
function cargarTemporadas() {
    getDatos(`/series/${serieId}/temporadas/todas`)
        .then(data => {
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            // Limpia las opciones existentes
            listaTemporadas.innerHTML = '';

            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Seleccione la temporada'
            listaTemporadas.appendChild(optionDefault); 
           
            temporadasUnicas.forEach(temporada => {
                const option = document.createElement('option');
                option.value = temporada;
                option.textContent = temporada;
                listaTemporadas.appendChild(option);
            });

            const optionTodos = document.createElement('option');
            optionTodos.value = 'todas';
            optionTodos.textContent = 'Todas las temporadas'
            listaTemporadas.appendChild(optionTodos); 

            const optionTop = document.createElement('option');
            optionTop.value = 'top';
            optionTop.textContent = 'Top 5 episodios';
            listaTemporadas.appendChild(optionTop);
        })
        .catch(error => {
            console.error('Error al obtener temporadas:', error);
        });
}

// Función para cargar episodios de una temporada
function cargarEpisodios() {
    // 1. Verificamos si se seleccionó la opción "Top 5"
    if (listaTemporadas.value === 'top') {
        getDatos(`/series/${serieId}/temporadas/top`)
            .then(data => {
                fichaSerie.innerHTML = ''; 
                const ul = document.createElement('ul');
                ul.className = 'episodios-lista'; 

                // Formato específico para el Top 5 según tu imagen:
                // "Episodio X - Temporada Y - Título"
                const listaHTML = data.map(serie => `
                    <li>
                        Episodio ${serie.numeroEpisodio} - Temporada ${serie.temporada} - ${serie.titulo}
                    </li>
                `).join('');
                
                ul.innerHTML = listaHTML;
                fichaSerie.appendChild(ul);
            })
            .catch(error => {
                console.error('Error al obtener top episodios:', error);
            });
        
        return; // Salimos de la función para no ejecutar el resto
    }

    // 2. Si NO es el top 5, ejecutamos la lógica normal (por temporada o todas)
    getDatos(`/series/${serieId}/temporadas/${listaTemporadas.value}`)
        .then(data => {
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            fichaSerie.innerHTML = ''; 
            temporadasUnicas.forEach(temporada => {
                const ul = document.createElement('ul');
                ul.className = 'episodios-lista'; 

                const episodiosTemporadaAtual = data.filter(serie => serie.temporada === temporada);

                const listaHTML = episodiosTemporadaAtual.map(serie => `
                    <li>
                        ${serie.numeroEpisodio} - ${serie.titulo}
                    </li>
                `).join('');
                ul.innerHTML = listaHTML;
                
                const paragrafo = document.createElement('p');
                paragrafo.textContent = `Temporada ${temporada}`;
                fichaSerie.appendChild(paragrafo);
                fichaSerie.appendChild(ul);
            });
        })
        .catch(error => {
            console.error('Error al obtener episodios:', error);
        });
}

// Función para cargar informaciones de la serie
function cargarInfoSerie() {
    getDatos(`/series/${serieId}`)
        .then(data => {
            fichaDescripcion.innerHTML = `
                <img src="${data.poster}" alt="${data.titulo}" />
                <div class="detalle__descripcion__texto">
                    <h2>${data.titulo}</h2>
                    <div>
                        <p><b>Evaluación:</b> ${data.evaluacion}</p>
                        <p>${data.sinopsis}</p>
                        <p><b>Actores:</b> ${data.actores}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error al obtener informaciones de la serie:', error);
        });
}

// Adiciona listener de evento para el elemento select
listaTemporadas.addEventListener('change', cargarEpisodios);

// Carga las informaciones de la série y las temporadas cuando la página carga
cargarInfoSerie();
cargarTemporadas();