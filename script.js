
const map = L.map('map');

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
        // Popup s daty
        const props = feature.properties;
        if (props) {
          const obsah = `
            <strong>${props.nazev || 'Neznámá oblast'}</strong><br>
            Počet sportovišť: ${props.pocet_sportovist || 'Nezadáno'}<br>
            Velikost: ${props.velikost || 'Nezadáno'}
          `;
          layer.bindPopup(obsah);
        }

        // Hover efekty
        layer.on({
          mouseover: (e) => {
            e.target.setStyle({
              fillColor: 'rgb(0,60,105)'
            });
            e.target.openPopup();
          },
          mouseout: (e) => {
            geojson.resetStyle(e.target);
            e.target.closePopup();
          }
        });
      }
    }).addTo(map);

    // Přizpůsobení výřezu mapy podle dat
    map.fitBounds(geojson.getBounds());
  })
  .catch(err => {
    console.error('Chyba při načítání GeoJSON:', err);
  });
