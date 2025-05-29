const map = L.map('map'); // Bez setView, použijeme fitBounds

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Výchozí styl zón
function defaultStyle(feature) {
  return {
    fillColor: 'rgb(0,173,208)', // modrá výplň
    color: 'white',              // bílé ohraničení
    weight: 2,
    fillOpacity: 0.6
  };
}

// Styl při hoveru
const hoverStyle = {
  fillColor: 'rgb(0,60,105)',  // tmavě modrá
  weight: 2,
  color: 'white',
  fillOpacity: 0.8
};

fetch('https://raw.githubusercontent.com/martinnitram41/web_strategie_mapa/main/mapa_ostrava_barvy_29_05_2025.geojson')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const geojsonLayer = L.geoJSON(data, {
      style: defaultStyle,
      onEachFeature: (feature, layer) => {
        const props = feature.properties;

        // Popup s daty
        const popupContent = `
          <strong>${props.nazev}</strong><br>
          Počet sportovišť: ${props.pocet_sportovist || 'neuvedeno'}<br>
          Velikost oblasti: ${props.velikost || 'neuvedeno'}
        `;
        layer.bindPopup(popupContent);

        // Hover efekty
        layer.on({
          mouseover: function (e) {
            e.target.setStyle(hoverStyle);
            e.target.bringToFront(); // zóna jde nahoru
          },
          mouseout: function (e) {
            geojsonLayer.resetStyle(e.target);
          }
        });
      }
    }).addTo(map);

    // Přiblížení podle dat
    map.fitBounds(geojsonLayer.getBounds());
  })
  .catch(err => {
    console.error('Chyba při načítání GeoJSON:', err);
  });
