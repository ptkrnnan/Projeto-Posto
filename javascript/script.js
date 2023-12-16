let map, infoWindow;
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  infoWindow = new google.maps.InfoWindow();

  /*const padrao = {lat: -23.55, lng: -46.64};*/
  const padrao = {lat: -8.760051304024234, lng: -54.27512162035985};
  map = new Map(document.getElementById("map"), {
    center: padrao,
    zoom: 5,
    panControl: false,
    maxZoom: 16,
    minZoom: 1,
    overviewMapControl: true,
    mapTypeControl: true,
    scaleControl: true
  });


  //Responsavel por capturar o current_location
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          /*infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");*/

          infoWindow.open(map);
          map.setCenter(pos);
          map.setZoom(15);
          
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(pos.lat, pos.lng),
            map: map
        });
        
        marker.addListener('click', function() {
             console.log("pegou click no marcador");
             console.log("lat: "+ pos.lat + " long:" + pos.lng);
        });

        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  };

}
initMap();