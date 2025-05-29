const map = L.map('map');

// Podkladová mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Výchozí styl oblastí
function baseStyle() {
  return {
    fillColor: 'rgb(0,173,208)',
    color: 'white',
    weight: 2,
    fillOpacity: 0.6
  };
}

// Styl při hoveru
const hoverStyle = {
  fillColor: 'rgb(0,60,105)',
  color: 'white',
  weight: 4,
  fillOpacity: 0.8
};

// Načti GeoJSON
fetch('https://raw.githubusercontent.com/martinnitram41/web_strategie_mapa/main/mapa_ostrava_barvy_29_05_2025.geojson')
  .then(response => response.json())
  .then(data => {
    const geojson = L.geoJSON(data, {
      style: baseStyle,
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        const popupContent = `
          <strong>${props.nazev || 'Neznámá oblast'}</strong><br>
          Počet sportovišť: ${props.pocet_sportovist || 'Nezadáno'}<br>
          Velikost: ${props.velikost || 'Nezadáno'}
        `;
        layer.bindPopup(popupContent);

        // Hover efekty
        layer.on({
          mouseover: (e) => {
            e.target.setStyle(hoverStyle);
            e.target.openPopup();
            map.getContainer().style.cursor = 'pointer';
          },
          mouseout: (e) => {
            geojson.resetStyle(e.target);
            e.target.closePopup();
            map.getContainer().style.cursor = '';
          }
        });
      }
    }).addTo(map);

    // Přibliž mapu na data
    map.fitBounds(geojson.getBounds());
  })
  .catch(err => console.error('Chyba při načítání GeoJSON:', err));
