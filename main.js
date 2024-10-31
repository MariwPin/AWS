// Evento para el botón Buscar dentro del modal
modalSearchButton.addEventListener('click', () => {
    const countryName = searchInput.value.trim();  
    if (!countryName) {
        alert("Debes ingresar un nombre de país.");
        return;
    }
    clearRecords();

    // Solicitud GET en axios con el nombre del país
    axios.get(`//3.81.102.180/php-intro-connection/getRecords.php?search=${encodeURIComponent(countryName)}&country_code3=${countryCode3}`)
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

