// Referencias para los botones en constantes 
const countryBtn = document.getElementById('countryBtn');
const cityBtn = document.getElementById('cityBtn');
const countryLanguageBtn = document.getElementById('countryLanguageBtn');
const searchCountryBtn = document.getElementById('searchCountryBtn');
// Ventana flotante por constantes 
const recordsTable = document.getElementById('records');
// Ingresar el país
const searchInput = document.getElementById('searchInput');  
// Botón para que se busque el país
const modalSearchButton = document.getElementById('modalSearchButton');  
const searchModal = new bootstrap.Modal(document.getElementById('searchModal'));

// Mostrar la ventana flotante
searchCountryBtn.addEventListener('click', () => {
    searchModal.show();
});

// Evento para el botón Buscar dentro del modal
modalSearchButton.addEventListener('click', () => {
    const countryName = searchInput.value.trim();  
    if (!countryName) {
        alert("Debes ingresar un nombre de país.");
        return;
    }
    clearRecords();

    // Solicitud GET en axios con el nombre del país
    axios.get(`//3.80.254.203/php-intro-connection/getRecords.php?search=${encodeURIComponent(countryName)}`)
        .then(response => {
            const data = response.data;
            console.log('Resultado de búsqueda:', data); // Verifica la respuesta

            if (data.country && data.country.length > 0) {
                populateTable(data.country, ['Code', 'Name', 'Continent', 'Region', 'Population'], 'Países');
            } else {
                alert("No se encontraron registros para el país especificado.");
            }

            if (data.city && data.city.length > 0) {
                populateTable(data.city, ['ID', 'Name', 'CountryCode', 'District', 'Population'], 'Ciudades');
            }

            if (data.countrylanguage && data.countrylanguage.length > 0) {
                populateTable(data.countrylanguage, ['CountryCode', 'Language', 'IsOfficial', 'Percentage'], 'Idiomas');
            }

        })
        .catch(error => {
            console.error(error);
            alert("Ocurrió un error al realizar la búsqueda.");
        });

    searchModal.hide();  
});

// Mostrar registros de la tabla country
countryBtn.addEventListener('click', async () => {
    clearRecords();
    try {
        // Paso 1: Llama a index.php para obtener el código de país basado en la IP
        const ipResponse = await axios.get('//3.80.254.203/php-intro-connection/index.php');
        const countryCode3 = ipResponse.data.country_code3;

        console.log('Código de país obtenido:', countryCode3); // Verifica que se obtuvo el código

        //  countryCode3 no sea undefined
        if (countryCode3) {
            // Paso 2: Usa el código de país obtenido en la solicitud a getRecords.php
            const response = await axios.get(`//3.80.254.203/php-intro-connection/getRecords.php?table=country&country_code3=${countryCode3}`);
            console.log('Respuesta de países filtrada:', response.data);  

            // Poblamos la tabla solo con los registros filtrados
            if (response.data.length > 0) {
                populateTable(response.data, ['Code', 'Name', 'Continent', 'Region', 'Population'], 'Países');
            } else {
                alert("No se encontraron registros para el país correspondiente.");
            }
        } else {
            console.error("El country_code3 no está definido.");
        }
    } catch (error) {
        console.error("Error al obtener los datos de países filtrados:", error);
    }
});

// Mostrar registros de la tabla city
cityBtn.addEventListener('click', () => {
    clearRecords();
    axios.get('//3.80.254.203/php-intro-connection/getRecords.php?table=city')
        .then(response => {
            console.log('Respuesta de ciudades:', response.data);  // Verifica la estructura de los datos en la consola
            populateTable(response.data, ['ID', 'Name', 'CountryCode', 'District', 'Population'], 'Ciudades');
        })
        .catch(error => {
            console.error(error);
        });
});

// Mostrar registros de la tabla countrylanguage
countryLanguageBtn.addEventListener('click', () => {
    clearRecords();
    axios.get('//3.80.254.203/php-intro-connection/getRecords.php?table=countrylanguage')
        .then(response => {
            console.log('Respuesta de idiomas:', response.data);  // Verifica la estructura de los datos en la consola
            populateTable(response.data, ['CountryCode', 'Language', 'IsOfficial', 'Percentage'], 'Idiomas');
        })
        .catch(error => {
            console.error(error);
        });
});

// Tabla con los datos 
function populateTable(data, columns, tableTitle = '') {
    // Limpiar el contenido anterior del cuerpo de la tabla
    recordsTable.innerHTML = '';
    if (tableTitle) {
        const titleRow = document.createElement('tr');
        const titleCell = document.createElement('td');
        titleCell.colSpan = columns.length;
        titleCell.innerHTML = `<strong>${tableTitle}</strong>`;
        recordsTable.appendChild(titleRow);
        titleRow.appendChild(titleCell);
    }
    // Crear fila de encabezados
    const headerRow = document.createElement('tr');
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column;
        headerRow.appendChild(th);
    });
    recordsTable.appendChild(headerRow);
    // Insertar los datos en la tabla
    data.forEach(item => {
        const row = document.createElement('tr');
        columns.forEach(col => {
            const td = document.createElement('td');
            td.textContent = item[col] !== undefined ? item[col] : '';  // Verifica si el valor existe
            row.appendChild(td);
        });
        recordsTable.appendChild(row);
    });
}

// Limpiar los registros
function clearRecords() {
    recordsTable.innerHTML = '';
}
