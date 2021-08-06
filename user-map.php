<?php
include_once 'header.php';
include 'locations_model.php';
?>
    <div id="map" class='map'></div>
    <script src='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.14.0/maps/maps-web.min.js'></script>
    <script type='text/javascript' src='mobile-or-tablet.js'></script>
    <script type='text/javascript' src='formatters.js'></script>
    <script type='text/javascript' src='marker.js'></script>
    <script type='text/javascript' src='markerBuilder.js'></script>
    <script>
      //map config
      var markers = {};
      let current_marker= null;
      var roundLatLng = Formatters.roundLatLng;
      var map = tt.map({
          key: 'your_key_here',
          container: 'map',
          dragPan: !isMobileOrTablet(),
          zoom: 3
         // center: [-99.98580752275456, 33.43211082128627]
      });
      map.addControl(new tt.FullscreenControl());
      map.addControl(new tt.NavigationControl());
      map.doubleClickZoom.disable();
        
      // map double click listener
      map.on('dblclick', function(event) {
        var lngLat = new tt.LngLat(roundLatLng(event.lngLat.lng), roundLatLng(event.lngLat.lat));
        createMarker('accident.colors-white.svg',lngLat,'#FF0000');
      });
        
      // fetch data
      function downloadUrl(url, callback) {
          var request = window.ActiveXObject ?
              new ActiveXObject('Microsoft.XMLHTTP') :
              new XMLHttpRequest;

          request.onreadystatechange = function() {
              if (request.readyState == 4) {
                  callback(request.responseText, request.status);
              }
            };

            request.open('GET', url, true);
            request.send(null);
        }
      // save marker location to database
      function saveData(lat,lng) {
        var url ="";
        var description = document.getElementById('description').value
        var names =uploadFile();
        if(names){
          url = 'locations_model.php?add_location&description=' + description + '&lat=' + lat + '&lng=' + lng+ '&img='+names;
        }
        else {
          url = 'locations_model.php?add_location&description=' + description + '&lat=' + lat + '&lng=' + lng;
        }
      
        downloadUrl(url, function(data, responseCode) {
          if (responseCode === 200  && data.length > 1) {
            var popup = new tt.Popup({offset: popupOffsets,className: 'popup_style'}).setHTML(waiting_popup);
              current_marker.setPopup(popup);
              current_marker.togglePopup();
          }else{
            var popup = new tt.Popup({offset: popupOffsets,className: 'popup_style'}).setHTML(error_popup);
                current_marker.setPopup(popup);
                current_marker.togglePopup();
            }
          });
        }

        //upload file
        function uploadFile() {
          var names="";
          var totalfiles = document.getElementById('files').files.length;
          if(totalfiles > 0 ){
            var formData = new FormData();
            // Read selected files
            for (var index = 0; index < totalfiles; index++) {
              formData.append("files[]", document.getElementById('files').files[index]);
                names= names + document.getElementById('files').files[index].name +",";
            }
            var xhttp = new XMLHttpRequest();

            // Set POST method and ajax file path
            xhttp.open("POST", "upload-file.php", true);

            // call on request changes state
            xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              var response = this.responseText;
              alert(response + " File uploaded.");
            }
            };

            // Send request with data
            xhttp.send(formData);
            return names;
          }
        }


        //fetch locations from db
        var locations = <?php get_confirmed_locations() ?>;
        // create confirmed location marker inside mam
        var i ; var confirmed = 0;
        for (i = 0; i < locations.length; i++) {
            var position = new tt.LngLat(roundLatLng(locations[i][2]), roundLatLng(locations[i][1]));
            var images = locations[i][5];
            createConfirmedMarker(position,locations[i],'#5327c3','accident.colors-white.svg',images);
	      }
	
</script>
<?php
include_once 'footer.php';
?>
