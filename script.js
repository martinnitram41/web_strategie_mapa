const map = L.map('map').setView([49.75, 15.5], 7); // ČR střed

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

// Načtení GeoJSON dat
fetch('mapa_ostrava_barvy_29_05_2025.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: feature => ({
        color: getColor(feature.properties.typ),
        weight: 2,
        fillOpacity: 0.6
      }),
      onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.nazev) {
          layer.bindPopup(feature.properties.nazev);
        }
      }
    }).addTo(map);
  });

function getColor(typ) {
  switch(typ) {
    case 'les': return '#228B22';
    case 'voda': return '#1E90FF';
    case 'louka': return '#ADFF2F';
    default: return '#FF8C00';
  }
}
