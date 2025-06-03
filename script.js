// Inicializace mapy s výchozím pohledem
const map = L.map('map').setView([49.75, 15.5], 7); // ČR

// Přidání podkladové mapy
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Načtení GeoJSON dat z GitHubu
fetch('https://raw.githubusercontent.com/martinnitram41/web_strategie_mapa/main/mapa_ostrava_barvy_29_05_2025.geojson')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const geojson = L.geoJSON(data, {
      style: {
        color: 'white', // hranice
        weight: 2,
        fillColor: 'rgb(0,173,208)', // výplň
        fillOpacity: 0.6
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        if (props) {
          const obsah = `
            <strong>${props.nazev || 'Neznámá oblast'}</strong><br>
            Počet sportovišť: ${props.pocet_sportovist || 'Nezadáno'}<br>
            Velikost: ${props.velikost || 'Nezadáno'}
          `;
          layer.bindPopup(obsah);
        }

        layer.on({
          mouseover: (e) => {
            e.target.setStyle({ fillColor: 'rgb(0,60,105)' });
            e.target.openPopup();
          },
          mouseout: (e) => {
            geojson.resetStyle(e.target);
            e.target.closePopup();
          }
        });
      }
    }).addTo(map);

    map.fitBounds(geojson.getBounds()); // výřez mapy podle dat
  })
  .catch(err => {
    console.error('Chyba při načítání GeoJSON:', err);
  });
