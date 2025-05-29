const map = L.map('map'); // Nepoužíváme setView – použijeme fitBounds

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Výchozí styl všech oblastí (modrá výplň, bílé okraje)
function defaultStyle(feature) {
  return {
    fillColor: 'rgb(0,173,208)', // světle modrá
    color: 'white',              // bílé ohraničení
    weight: 2,
    fillOpacity: 0.6
  };
}

// Styl při najetí myší
const hoverStyle = {
  fillColor: 'rgb(0,60,105)',   // tmavě modrá
  color: 'white',
  weight: 2,
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
      style: defaultStyle, // Nastavíme styl přímo, žádné getColor
      onEachFeature: (feature, layer) => {
        const props = feature.properties;

        // Vyskakovací okno s daty
        const popupContent = `
          <strong>${props.nazev}</strong><br>
          Počet sportovišť: ${props.pocet_sportovist || 'neuvedeno'}<br>
          Velikost oblasti: ${props.velikost || 'neuvedeno'}
        `;
        layer.bindPopup(popupContent);

        // Efekt hoveru
        layer.on({
          mouseover: function (e) {
            e.target.setStyle(hoverStyle);
            e.target.bringToFront();
          },
          mouseout: function (e) {
            geojsonLayer.resetStyle(e.target);
          }
        });
      }
    }).addTo(map);

    // Automatické přiblížení mapy na GeoJSON
    map.fitBounds(geojsonLayer.getBounds());
  })
  .catch(err => {
    console.error('Chyba při načítání GeoJSON:', err);
  });
