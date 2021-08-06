let Marker = function (
  markerId,
  position,
  locations,
  color,
  icon,
  images,
  markerElement,
  marker,
  popup
) {
  this.markerId = markerId;
  this.position = position;
  this.locations = locations;
  this.color = color;
  this.icon = icon;
  this.images = images;
  this.markerElement = markerElement;
  this.marker = marker;
  this.popup = popup;
};
let markerBuilder = function () {
  let position;
  let locations;
  let color;
  let icon;
  let images;
  let markerElement;
  let marker;
  let popup;

  return {
    setMarkerId: function(markerId){
        this.markerId=markerId;
        return this;
    },
    setPosition: function (position) {
         var markerId = "marker" + getMarkerUniqueId(position);
         this.setMarkerId(markerId);
        this.position = position;
      return this;
    },
    setLocations: function (locations) {
      this.locations = locations;
      return this;
    },
    setColor: function (color) {
      this.color = color;
      return this;
    },
    setIcon: function (icon) {
      this.icon = icon;
      return this;
    },
    setImages: function (images) {
      this.images = images;
      return this;
    },
    setMarkerElement: function (confirmed) {
      var markerElement = document.createElement("div");
      markerElement.id = this.markerId;
      markerElement.className = "marker";

      var markerContentElement = document.createElement("div");
      markerContentElement.className = "marker-content";
      if(confirmed){
        if (confirmed === "checked") {
            markerContentElement.style.backgroundColor = "#5327c3";
          } else {
            markerContentElement.style.backgroundColor = "#ff0000";
          }
      }

      else {
          markerContentElement.style.backgroundColor = this.color;
      }
      markerElement.appendChild(markerContentElement);

      var iconElement = document.createElement("div");
      iconElement.className = "marker-icon";
      iconElement.style.backgroundImage =
        "url(https://api.tomtom.com/maps-sdk-for-web/cdn/static/" +
        this.icon +
        ")";
      markerContentElement.appendChild(iconElement);
      this.markerElement = markerElement;
      return this;
    },
    setPopup: function (location_html) {
      let popup = new tt.Popup({
        offset: popupOffsets,
        className: "popup_style",
      }).setHTML(location_html);
      this.popup = popup;
      return this;
    },
    setMarker: function () {
      let marker = new tt.Marker({
        element: this.markerElement,
        anchor: "bottom",
      }).setLngLat(this.position);
      this.marker = marker;
      return this;
    },
    build: function () {
      return new Marker(
        position,
        locations,
        color,
        icon,
        images,
        markerElement,
        marker,
        popup
      );
    },
  };
};
