var data_id = '0AsL-qFOSUlaOdDktQ0JlZU9RaHNZbmJOOFk4T2kwSkE',
    map_id = 'goodcaesar.map-vwfp7lw5',
    markerLayer,
    features,
    features_summary,
    interaction,
        
    layer = mapbox.layer().id(map_id),    
	    point,
	    _d, // Down Event
	    tol = 4, // Touch Tolerance
	    _downLock = false,
	    _clickTimeout = false,
	    init = true,
    
	map = mapbox.map('map', layer, null, [
	    easey_handlers.DoubleClickHandler(),
	    easey_handlers.DragHandler(),
	    easey_handlers.TouchHandler()
	]);
	
mmg_google_docs_spreadsheet_1(data_id, mapData);
map.centerzoom({
    lat: 2.371,
    lon: 113.347
}, 8);

map.setZoomRange(7, 15);
map.ui.attribution.add().content('<a href="http://mapbox.com/about/maps">Terms &amp; Feedback</a>');
map.ui.hash.add();

// Build map
function mapData(f) {
    features = f;
    markerLayer = mapbox.markers.layer().features(features);
	
    //center markers layer
    markerLayer.factory(function (m) {
        // Create a marker using the simplestyle factory
        var elem = mapbox.markers.simplestyle_factory(m);
        // Add function that centers marker on click
               
//        MM.addEvent(elem, 'click', function (e) {
//            map.ease.location({
//                lat: m.geometry.coordinates[1],
//                lon: m.geometry.coordinates[0]
//            }).zoom(map.zoom()).optimal();
//        });
        return elem;
    });

    interaction = mapbox.markers.interaction(markerLayer);

    map.addLayer(markerLayer);
    map.ui.zoomer.add();
    map.ui.zoombox.add();

	// Formatting the popups
    interaction.formatter(function (feature) {
        
        if(feature.properties.link) {
        	websitelink = '<p><a href="' + feature.properties.link + '">Visit link</a></p>';
        } else {
        	websitelink = '';
        }
        
        //alert(feature.properties.link);
        
        var o = '<h3>' + feature.properties.title + '</h3>' +
            '<p>' + feature.properties.description +                        
            '<p><strong>Date:</strong> ' + feature.properties.date.replace('Fecha: ', "") + websitelink + '</p>';
        return o;
    });

    //out url for download  data
    download_data();
}

function newMarker() {
    if (window.location.hash == '#new') {
        $('#new').fadeIn('slow');
        window.location.hash = '';
        window.setTimeout(function () {
            $('#new').fadeOut('slow');
        }, 4000);
    }
}

//function for put href  for download data
function download_data() {
    $('#download_csv').attr('href', 'https://docs.google.com/a/developmentseed.org/spreadsheet/pub?key=' + data_id + '&output=csv');
    $('#download_josn').attr('href', 'https://spreadsheets.google.com/feeds/list/' + data_id + '/od6/public/values?alt=json-in-script');
}

$(function () {

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
    $(map.parent).on(markerEvents);
    $(map.parent).on('touchstart', onDown);

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
    	
    	if(!window.addingBribe)
    		return;
    
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
            $(map.parent).on(touchEnds);
        }
    }

    function touchCancel() {
        $(map.parent).off(touchEnds);
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
        $(map.parent).off(touchEnds);

        if (e.type === 'touchend') {
            // If this was a touch and it survived, there's no need to avoid a double-tap
            markerInteraction(e);
        } else if (Math.round(pos.y / tol) === Math.round(_d.y / tol) && Math.round(pos.x / tol) === Math.round(_d.x / tol)) {
            // Contain the event data in a closure.
            _clickTimeout = window.setTimeout(

            function () {
                _clickTimeout = null;
                map.removeLayer(point);
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
     map.addLayer(markerLayer);	
    

});