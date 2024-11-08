// Inicializar el mapa
const map = L.map('map').setView([4.609700899321606, -74.0709], 12); // Bogotá como centro inicial

// Cargar el mapa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variables para almacenar las coordenadas de origen y destino
let originMarker = null;
let destinationMarker = null;

// Función para actualizar los inputs con las coordenadas seleccionadas
function updateCoordinates() {
    if (originMarker) {
        document.getElementById('origin-lat').value = originMarker.getLatLng().lat;
        document.getElementById('origin-lon').value = originMarker.getLatLng().lng;
    }
    if (destinationMarker) {
        document.getElementById('destination-lat').value = destinationMarker.getLatLng().lat;
        document.getElementById('destination-lon').value = destinationMarker.getLatLng().lng;
    }
}

// Función para manejar el clic en el mapa
function onMapClick(e) {
    // Si aún no se ha seleccionado el origen, lo hacemos ahora
    if (!originMarker) {
        originMarker = L.marker(e.latlng).addTo(map).bindPopup("Origen").openPopup();
    } 
    // Si ya se ha seleccionado el origen y no hay destino, lo colocamos ahora
    else if (!destinationMarker) {
        destinationMarker = L.marker(e.latlng).addTo(map).bindPopup("Destino").openPopup();
        // Cuando ambos marcadores estén establecidos, actualizamos las coordenadas
        updateCoordinates();
    } 
    // Si ya están seleccionados origen y destino, reiniciamos para seleccionar nuevos puntos
    else {
        // Eliminar el marcador de origen si se hace clic en una nueva ubicación para el origen
        if (originMarker) {
            map.removeLayer(originMarker);
        }
        // Establecer nuevo origen
        originMarker = L.marker(e.latlng).addTo(map).bindPopup("Origen").openPopup();
        
        // Si se hace clic después de haber elegido origen, eliminamos el marcador de destino
        if (destinationMarker) {
            map.removeLayer(destinationMarker);
        }
        // Establecer nuevo destino
        destinationMarker = null;
        updateCoordinates();
    }
}
// Función para obtener las nuevas coordenadas de la API y actualizar el mapa
// Variables globales para evitar la modificación del origen y destino
let originLat, originLon, destinationLat, destinationLon;
let updatedLat, updatedLon;
let updatedMarker;

// Función para inicializar las coordenadas de origen y destino (solo una vez)
function initializeCoordinates() {
    originLat = document.getElementById('origin-lat').value;
    originLon = document.getElementById('origin-lon').value;
    destinationLat = document.getElementById('destination-lat').value;
    destinationLon = document.getElementById('destination-lon').value;

    // Inicializar las coordenadas actualizadas con las coordenadas de origen
    updatedLat = originLat;
    updatedLon = originLon;
}

// Función para obtener las nuevas coordenadas de la API y actualizar el mapa
function fetchUpdatedCoordinates() {
    // Asegurarse de que las coordenadas de origen y destino solo se inicialicen una vez
    if (originLat === undefined || originLon === undefined || destinationLat === undefined || destinationLon === undefined) {
        initializeCoordinates();  // Inicializar las coordenadas si no han sido inicializadas
    }

    // Formar el string de coordenadas para el GET, usando la última coordenada actualizada y la de destino
    const coords = `${updatedLat}:${updatedLon}:${destinationLat}:${destinationLon}`;

    // Asegurarse de que las coordenadas estén entre comillas dobles
    const coordsWithQuotes = `"${coords}"`;

    // Realizar la solicitud GET a la API con el parámetro coords formateado correctamente
    const apiUrl = `https://m7lw5n6v8l.execute-api.us-east-1.amazonaws.com/beta/coordinates/position?coords=${coordsWithQuotes}`;

    // Usar fetch para obtener los datos
    fetch(apiUrl)
        .then(response => response.text())  // Usar .text() para manejar la respuesta como un string
        .then(data => {
            data = data.replace(/"/g, '');
            console.log('Respuesta de la API:', data);
            const [newLat, newLon] = data.split(", ");

            // Si las coordenadas actualizadas coinciden con las de destino, detener el proceso
            if (Math.abs(newLat - destinationLat) < 0.0001 && Math.abs(newLon - destinationLon) < 0.0001) {
                console.log("Las coordenadas actualizadas son muy cercanas a las de destino. Deteniendo actualización.");
                return; // No realizar más actualizaciones
            }

            // Actualizar las coordenadas actualizadas
            updatedLat = newLat;
            updatedLon = newLon;

            // Si ya existe un marcador de coordenada actualizada, eliminarlo
            if (updatedMarker) {
                map.removeLayer(updatedMarker);
            }

            // Crear un nuevo marcador en la posición actualizada
            updatedMarker = L.marker([parseFloat(newLat), parseFloat(newLon)]).addTo(map).bindPopup("Destino Actualizado").openPopup();

            // Mostrar las nuevas coordenadas actualizadas en los inputs correspondientes
            document.getElementById('updated-latitude').value = newLat;
            document.getElementById('updated-longitude').value = newLon;

            // Llamar a la API nuevamente si las coordenadas no son iguales a las de destino
            setTimeout(fetchUpdatedCoordinates, 3000);
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
        });
}


// Añadir un evento de clic en el mapa
map.on('click', onMapClick);

// Añadir evento al botón "Actualizar"
document.getElementById('update-button').addEventListener('click', fetchUpdatedCoordinates);
