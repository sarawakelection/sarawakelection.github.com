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
    
	function addListeners(o, el){
        for(n in o){
        	el.addEventListener(n, o[n], false);
        }		
	}

	function removeListeners(o, el){
        for(n in o){
        	el.removeEventListener(n, o[n], false);
        }		
	}

    // Set up events
    addListeners(markerEvents, map.parent);
    addListeners(touchEnds, map.parent);
    
    //$(map.parent).on(markerEvents);
    //$(map.parent).on('touchstart', onDown);

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
    
    	console.log('onDown');
    	
    	//touchstart, touchmove and touchend need to first call e.preventDefault(); or the following events will not be triggered
    	e.preventDefault();
    	
    	if(!window.addingBribe){
    		console.log('not adding bribe')
    		return;
    	}
    
        // Ignore double-clicks by ignoring clicks within 300ms of each other.
        if (killTimeout()) {
        	console.log('killed')
            return;
        }

        // Prevent interaction offset calculations happening while the user is dragging the map.
        // Store this event so that we can compare it to the up event
        _downLock = true;
        _d = new MM.Point(e.clientX, e.clientY);

        /*if (e.type === 'mousedown') {
            $(document.body).on('click', onUp);

            // Only track single-touches. Double-touches will not affect this control
        } else if (e.type === 'touchstart' && e.touches.length === 1) {
            // Touch moves invalidate touches
            // $(map.parent).on(touchEnds);
            addListeners(touchEnds, map.parent);

        }*/
    }

    function touchCancel() {
        //$(map.parent).off(touchEnds);
        //removeListeners(touchEnds, map.parent);
        console.log('touchCancel');
        _downLock = false;
    }

    function onUp(e) {
    
    	console.log('onUp');
    
        var evt = {},
            pos = new MM.Point(e.clientX, e.clientY);

        _downLock = false;
        for (var key in e) {
            evt[key] = e[key];
        }

      //  $(document.body).off('click', onUp);
      // removeListeners(touchEnds, map.parent);

        /*if (e.type === 'touchend') {
            // If this was a touch and it survived, there's no need to avoid a double-tap
            markerInteraction(e);
        } else */ if (Math.round(pos.y / tol) === Math.round(_d.y / tol) && Math.round(pos.x / tol) === Math.round(_d.x / tol)) {
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

    //center markers layer
    markerLayer.factory(function (m) {
        // Create a marker using the simplestyle factory
        var elem = mapbox.markers.simplestyle_factory(m); //= $('<div class="marker-holder">' +  + '</div>');

        // Add function that centers marker on click
               
//        MM.addEvent(elem, 'click', function (e) {
//            map.ease.location({
//                lat: m.geometry.coordinates[1],
//                lon: m.geometry.coordinates[0]
//            }).zoom(map.zoom()).optimal();
//        });
        return elem;
    });
