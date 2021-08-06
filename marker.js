// marker style
var markerHeight = 50,
  markerRadius = 10,
  linearOffset = 25;
var popupOffsets = {
  top: [0, 0],
  "top-left": [0, 0],
  "top-right": [0, 0],
  bottom: [0, -markerHeight],
  "bottom-left": [
    linearOffset,
    (markerHeight - markerRadius + linearOffset) * -1,
  ],
  "bottom-right": [
    -linearOffset,
    (markerHeight - markerRadius + linearOffset) * -1,
  ],
  left: [markerRadius, (markerHeight - markerRadius) * -1],
  right: [-markerRadius, (markerHeight - markerRadius) * -1],
};

// create unique id from postion
var getMarkerUniqueId = function (position) {
  let latlong_multiplication = (position.lat + position.lng) * Math.random();
  let pos_string = latlong_multiplication.toString();
  let pos_string_without_dot = pos_string.replace(/\./g, "");
  let pos_num = parseInt(pos_string_without_dot);
  return Math.abs(pos_num);
};

// popup html after marker creation waiting for admin confirmation.
var waiting_popup =
  "<div style=' color: purple; font-size: 25px;'> Waiting for admin confirmation!!</div>";
var error_popup = "<div style='color: red; font-size: 25px;'>Error!</div>";
var popup_html_add_location = function (lat, lng) {
  return (
    '<form><b>Ajouter une localisation</b><div style="margin-top:10px;"><label for="description">Description:</label><textarea  id="description" name="description" required minlength="4" size="20"></textarea></div><div style="margin-top:10px;"><input type="file" id="files" name="files" accept="image/png, image/jpeg" multiple required></div><div style="margin-top:10px;"><input type="button" onclick=\'saveData(' +
    lat +
    "," +
    lng +
    ")' value='Save'/></div></form>"
  );
};

//popup html for confirmed locations
var confirmed_location_popup = function (locations, images) {
  return (
    "<div><table class=\"map1\"><tr><td><a>Description:</a></td><td><textarea disabled id='manual_description' placeholder='Description'>" +
    locations[3] +
    '</textarea></td></tr></table><div class="row">' +
    images_html(images) +
    "</div></div>"
  );
};

// show images html
var images_html = function (images) {
  let html = "";
  if (images) {
    let img_arr = images.split(",");
    img_arr.pop();
    img_arr.map((image) => {
      html =
        html +
        `<div class="column"><img class="zoom" src="img/${image}" alt="${image}" style="width:100%;height:200px;"></div>`;
    });
  }
  return html;
};

// admin location confirmation html
var admin_location_popup = function (id, checked, description, images) {
  return (
    '<table class="map1"><tr><input name=' +
    id +
    " type='hidden' id=\"id\"><td><a>Description:</a></td><td><textarea disabled id='description' placeholder='Description'>" +
    description +
    "</textarea></td></tr><tr><td><b>Confirm Location ?:</b></td><td><input id='confirmed' type='checkbox' name='confirmed'" +
    checked +
    "></td></tr><tr><td></td><td><input type='button' value='Save' onclick='saveData()'/></td></tr></table><div class=\"row\">" +
    images_html(images) +
    "</div>"
  );
};

// create a confirmed marker inside map
function createConfirmedMarker(position, locations, color, icon, images) {
  let location_html = confirmed_location_popup(locations, images);
  let marker = new markerBuilder()
    .setPosition(position)
    .setLocations(locations)
    .setColor(color)
    .setIcon(icon)
    .setImages(images)
    .setMarkerElement()
    .setMarker()
    .setPopup(location_html);
  // add marker to map
  marker.marker.setPopup(marker.popup).addTo(map);
  markers[marker.markerId] = marker.marker;
}

// create a marker inside map
function createMarker(icon, position, color) {
  let html = popup_html_add_location(position.lat, position.lng);
  let marker = new markerBuilder()
    .setPosition(position)
    .setColor(color)
    .setIcon(icon)
    .setMarkerElement()
    .setMarker()
    .setPopup(html);

  // add marker to map
  marker.marker.setPopup(marker.popup).addTo(map);
  markers[marker.markerId] = marker.marker;
  bindMarkerEvents(marker.markerId);
}

//create all markers inside map
function createAllMarkers(position, locations, icon) {
  let confirmed = locations[4] === "1" ? "checked" : 0;
  let id = locations[0];
  let description = locations[3];
  let images = locations[5];

  let html = admin_location_popup(id, confirmed, description, images);

  let marker = new markerBuilder()
    .setPosition(position)
    .setColor("color")
    .setIcon(icon)
    .setMarkerElement(confirmed)
    .setMarker()
    .setPopup(html);

  // add marker to map
  marker.marker.setPopup(marker.popup).addTo(map);
  markers[marker.markerId] = marker.marker;
}

//remove marker from map
var removeMarker = function (marker, markerId) {
  marker.remove();
  delete markers[markerId];
};

// add events to marker
var bindMarkerEvents = function (markerId) {
  $(document).ready(function () {
    var id = "#" + markerId;
    var element = $(id);

    element.mousedown(function (point) {
      var marker = markers[markerId];
      switch (point.which) {
        case 1: //left click
          current_marker = marker;
          break;
        case 3: //right click
          removeMarker(marker, markerId);
          break;
        default:
          break;
      }
    });
  });
};
