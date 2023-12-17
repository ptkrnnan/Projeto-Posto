let map, infoWindow;
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  infoWindow = new google.maps.InfoWindow();

  /*const padrao = {lat: -23.55, lng: -46.64};*/
  const padrao = { lat: -8.760051304024234, lng: -54.27512162035985 };
  map = new Map(document.getElementById("map"), {
    center: padrao,
    zoom: 5,
    panControl: false,
    maxZoom: 16,
    minZoom: 0,
    overviewMapControl: true,
    mapTypeControl: false,
    scaleControl: true,
  });

  //Responsavel por capturar o current_location
  const locationButton = document.createElement("button");
  locationButton.textContent = "Mostrar seu Local";
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


          // Chamar a função createMarker com o ícone padrão para a localização do usuário
          createMarker({
            geometry: { location: pos },
            name: "Localização Atual",
          });

          // Criar um serviço de lugares para pesquisar postos de combustível
          var service = new google.maps.places.PlacesService(map);

          // Definir o tipo de lugar como posto de combustível
          var request = {
            location: map.getCenter(),
            radius: 5000, // Raio de busca em metros
            types: ["gas_station"],
          };

          // Realizar a busca dos postos de gasolina
          service.nearbySearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                // Criar marcador para cada posto de combustível encontrado
                createMarker_gasstation(results[i]);
              }
            }
          });

          marker.addListener("click", function () {
            console.log("pegou click no marcador");
            console.log("lat: " + pos.lat + " long:" + pos.lng);
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
  }

  var input = document.getElementById("searchInput");
  /*map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);*/

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29),
  });

  autocomplete.addListener("place_changed", function () {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    marker.setIcon({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35),
    });
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = "";
    if (place.address_components) {
      address = [
        (place.address_components[0] &&
          place.address_components[0].short_name) ||
          "",
        (place.address_components[1] &&
          place.address_components[1].short_name) ||
          "",
        (place.address_components[2] &&
          place.address_components[2].short_name) ||
          "",
      ].join(" ");
    }

    infowindow.setContent(
      "<div><strong>" + place.name + "</strong><br>" + address
    );
    infowindow.open(map, marker);

    // Location details
    for (var i = 0; i < place.address_components.length; i++) {
      if (place.address_components[i].types[0] == "postal_code") {
        document.getElementById("postal_code").innerHTML =
          place.address_components[i].long_name;
      }
      if (place.address_components[i].types[0] == "country") {
        document.getElementById("country").innerHTML =
          place.address_components[i].long_name;
      }
    }
    document.getElementById("location").innerHTML = place.formatted_address;
    document.getElementById("lat").innerHTML = place.geometry.location.lat();
    document.getElementById("lon").innerHTML = place.geometry.location.lng();
  });
}

// Criar marcador no mapa
function createMarker(place, icon) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#4285F4", // Cor azul do ícone do Google Maps
      fillOpacity: 1,
      strokeColor: "white", // Cor da borda
      strokeWeight: 2,
      scale: 7, // Tamanho do ícone
    },
  });

  // Adicionar informações adicionais (opcional)
  var infowindow = new google.maps.InfoWindow({
    content: place.name,
  });

  marker.addListener("click", function () {
    infowindow.open(map, marker);
  });
}

// Criar marcadores no mapa apenas para posto de combustivel
function createMarker_gasstation(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
  });

  // Adicionar informações adicionais (opcional)
  var infowindow = new google.maps.InfoWindow({
    content: place.name,
  });

  marker.addListener("click", function () {
    infowindow.open(map, marker);
  });
}

/*initMap();*/
