$(function () {

    var m = mapbox.map('map', mapbox.layer().id('goodcaesar.map-vwfp7lw5')),
        point,
        _d, // Down Event
        tol = 4, // Touch Tolerance
        _downLock = false,
        _clickTimeout = false,
        init = true;

    m.ui.attribution.add().content('<a href="http://mapbox.com/about/maps">Terms &amp; Feedback</a>');
    m.ui.zoomer.add();
    // Default center zoom on Sarawak
    m.centerzoom({
        lat: 2.371,
        lon: 113.347
    }, 8);

    var markerEvents = {
        touchstart: onDown,
        mousedown: onDown
    };

    var touchEnds = {
        touchend: onUp,
        touchmove: onUp,
        touchcancel: touchCancel
    };

    // Set up events
    $(m.parent).on(markerEvents);
    $(m.parent).on('touchstart', onDown);

    // Clear the double-click timeout to prevent double-clicks from triggering popups.
    function killTimeout() {
        if (_clickTimeout) {
            window.clearTimeout(_clickTimeout);
            _clickTimeout = null;
            return true;
        } else {
            return false;
        }
    }

    // A handler for 'down' events - which means `mousedown` and `touchstart`
    function onDown(e) {
        // Ignore double-clicks by ignoring clicks within 300ms of each other.
        if (killTimeout()) {
            return;
        }

        // Prevent interaction offset calculations happening while the user is dragging the map.
        // Store this event so that we can compare it to the up event
        _downLock = true;
        _d = new MM.Point(e.clientX, e.clientY);

        if (e.type === 'mousedown') {
            $(document.body).on('click', onUp);

            // Only track single-touches. Double-touches will not affect this control
        } else if (e.type === 'touchstart' && e.touches.length === 1) {
            // Touch moves invalidate touches
            $(m.parent).on(touchEnds);
        }
    }

    function touchCancel() {
        $(m.parent).off(touchEnds);
        _downLock = false;
    }

    function onUp(e) {
        var evt = {},
            pos = new MM.Point(e.clientX, e.clientY);

        _downLock = false;
        for (var key in e) {
            evt[key] = e[key];
        }

        $(document.body).off('click', onUp);
        $(m.parent).off(touchEnds);

        if (e.type === 'touchend') {
            // If this was a touch and it survived, there's no need to avoid a double-tap
            markerInteraction(e);
        } else if (Math.round(pos.y / tol) === Math.round(_d.y / tol) && Math.round(pos.x / tol) === Math.round(_d.x / tol)) {
            // Contain the event data in a closure.
            _clickTimeout = window.setTimeout(

            function () {
                _clickTimeout = null;
                m.removeLayer(point);
                addMarker(e);
            }, 300);
        }
        return onUp;
    }
	
	function addMarker(e) {
        var pos = MM.getMousePoint(e, map);
        var l = map.pointLocation(pos);
                
        // Create and add marker layer
        point = mapbox.markers.layer().features([{
            'geometry': {
                'type': 'Point',
                'coordinates': [l.lon, l.lat]
            },
                'properties': {
                	'image': './a/bribe-marker.png'
            }
        }]).factory(function (f) {
            var mark = document.createElement('div');
            mark.className = 'marker';
            var img = document.createElement('img');
            img.className = 'marker-point';
            img.setAttribute('src', f.properties.image);
            mark.appendChild(img)

            // center the map on where it was selected.
            map.ease.location({
                lat: l.lat,
                lon: l.lon
            }).zoom(map.zoom()).optimal();

            return mark;
        });

        map.addLayer(point);

        // Here put the coordinates in field Latitud dan Longitud
        $('#entry_4').attr('value', l.lat.toFixed(5));
        $('#entry_6').attr('value', l.lon.toFixed(5));
    }
           
      var geolocate = document.getElementById('geolocate');
    
    // Create an empty markers layer
     var markerLayer = mapbox.markers.layer();
     m.addLayer(markerLayer);	
    

		// Adding find me functionality
      if (!navigator.geolocation) {
          geolocate.innerHTML = 'geolocation is not available';
      } else {
          geolocate.onclick = function(e) {
              e.preventDefault();
              e.stopPropagation();
              navigator.geolocation.getCurrentPosition(
              function(position) {
                  // Once we've got a position, zoom and center the map
                  // on it, add ad a single feature
                  map.zoom(15).center({
                      lat: position.coords.latitude,
                      lon: position.coords.longitude
                  });
                  markerLayer.add_feature({
                      geometry: {
                          coordinates: [
                              position.coords.longitude,
                              position.coords.latitude]
                      },
                      properties: {
                      		'image': './img/feedback-point.png'
//                          'marker-color': '#000',
//                          'marker-symbol': 'star-stroked',
                      }
                  });
                  
                  // Copy location to the lat/lon fields
                  $('#entry_4').attr('value', position.coords.latitude.toFixed(5));
                  $('#entry_6').attr('value', position.coords.longitude	.toFixed(5));
                  
                  // And hide the geolocation button
                  geolocate.parentNode.removeChild(geolocate);
              },
              function(err) {
                  // If the user chooses not to allow their location
                  // to be shared, display an error message.
                  geolocate.innerHTML = 'position could not be found';
              });
          };
      }     
            
});

// Typeahead functionality for location
$(function() {
    var sarawakLocations = [
		"Asajaya",
		"Baram",
		"Bahagian Miri",
		"Balingian",
		"Bau",
		"Belaga",
		"Belawai",
		"Beluru",
		"Betong",
		"Bintulu",
		"Budu",
		"Dalat",
		"Daro",
		"Debak",
		"Engkilili",
		"Julau",
		"Kabong",
		"Kanowit",
		"Kapit",
		"Kuching",
		"Lawas",
		"Limbang",
		"Lingga",
		"Lubok Antu",
		"Lundu",
		"Maludam",
		"Marudi",
		"Matu",
		"Murum",
		"Meradong",
		"Miri",
		"Mukah",
		"Nanga Medamit",
		"Nanga Merit",
		"Niah Suai",
		"Oya",
		"Padawan",
		"Pakan",
		"Pantu",
		"Pendam",
		"Pusa",
		"Roban",
		"Samarahan",
		"Saratok",
		"Sarikei",
		"Sebuyao",
		"Sematan",
		"Serian",
		"Sibu",
		"Siburan",
		"Sibuti",
		"Simunjan",
		"Song",
		"Spaoh",
		"Sri Aman",
		"Sundar",
		"Tatau",
		"Tebedu",
		"Trusan",
		"Besut",
		"Dungun",
		"Hulu Terengganu",
		"Kemaman",
		"Kuala Terengganu",
		"Marang",
		"Setiu"
    ];
    
    $( "#entry_9" ).autocomplete({
      source: sarawakLocations
    });
    
});