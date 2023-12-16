let map;
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  
  const padrao = {lat: -23.55, lng: -46.64};
  map = new Map(document.getElementById("map"), {
    center: padrao,
    zoom: 12,
    minZoom: 3,
    disableDefaultUI: true,
  });

  const marker = new google.maps.Marker({
    position: padrao,
    map: map,
  });
}
initMap();