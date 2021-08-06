<?php
include_once 'header.php';
include_once 'locations_model.php';
?>


<div id="map" class='map'></div>
<script src='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.14.0/maps/maps-web.min.js'></script>
    <script type='text/javascript' src='mobile-or-tablet.js'></script>
    <script type='text/javascript' src='formatters.js'></script>
    <script type='text/javascript' src='marker.js'></script>
    <script type='text/javascript' src='markerBuilder.js'></script>
    <script>
    //fetch all location from db
    var locations = <?php get_all_locations() ?>;
    //map config
    var markers = {};
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
        
    // put all markers inside the map
    var i ; var confirmed = 0;
    for (i = 0; i < locations.length; i++) {
        var position = new tt.LngLat(roundLatLng(locations[i][2]), roundLatLng(locations[i][1]));
        createAllMarkers(position,locations[i],'accident.colors-white.svg');
    }
        
    // confirm marker 
    function saveData() {
        var confirmed = document.getElementById('confirmed').checked ? 1 : 0;
        var id = document.getElementById('id').name;
        var url = 'locations_model.php?confirm_location&id=' + id + '&confirmed=' + confirmed ;
        downloadUrl(url, function(data, responseCode) {
            if (responseCode === 200  && data.length > 1) {
                window.location.reload(true);
            }else{
                alert(data);
            }
        });
    }


    // fetch data from url
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

    </script>
