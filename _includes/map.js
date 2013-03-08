/* map.js */

var data_id = '0AsL-qFOSUlaOdDktQ0JlZU9RaHNZbmJOOFk4T2kwSkE',
    map_id = 'goodcaesar.map-vwfp7lw5',
    markerLayer,
    addMarkerLayer,
    features,
    features_summary,
    interaction,
    geolocate = document.getElementById('geolocate'),
    addBribeMode = false,
    mouseIsDown = false,
        
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
	
map.centerzoom({
    lat: 2.371,
    lon: 113.347
}, 8);

map.setZoomRange(7, 15);
map.ui.attribution.add().content('<a href="http://mapbox.com/about/maps">Terms &amp; Feedback</a>');
map.ui.hash.add();
	
mmg_google_docs_spreadsheet_1(data_id, mapData);

// Build map. Fired by mmg_google_docs_spreadsheet after data loaded
function mapData(f) {
   
    features = f;
    markerLayer = mapbox.markers.layer().features(features);

    //center markers layer
    markerLayer.factory(function (m) {
        var elem = mapbox.markers.simplestyle_factory(m); //= $('<div class="marker-holder">' +  + '</div>');
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


    
    // set up clusters
    cluster();
    
	// re-cluster markers on zoom
    $('a.zoomer').click(function(){
  		//console.log('zoom');
  		cluster();
    });
    
    // marker for the "new bribe" marker
	addMarkerLayer = mapbox.markers.layer();
	map.addLayer(addMarkerLayer);
}

//function for put href  for download data
function download_data() {
    $('#download_csv').attr('href', 'https://docs.google.com/a/developmentseed.org/spreadsheet/pub?key=' + data_id + '&output=csv');
    $('#download_josn').attr('href', 'https://spreadsheets.google.com/feeds/list/' + data_id + '/od6/public/values?alt=json-in-script');
}

// function for clustering markers on load or zoom

function cluster(){
	
	var ma = markerLayer.markers();
	
	$(ma).each(function(n,m){
		m.point = map.locationPoint(m.location);
		m.iscluster = false;
		m.clusterdata = {};
		$(m.element).show();
		$(m.element).data('map-index', n);
	});
    
    var nearPoints = function(m1, m2){
    	if(isNaN(m1.point.x) || isNaN(m2.point.x))
    		return false;
		return (Math.abs(m1.point.x - m2.point.x) < 10) && (Math.abs(m1.point.y - m2.point.y) < 10);
	}
	
	// take potential cluster $c and compare to marker $m 
	$(ma).each(function(n, c){
		$(ma).each(function(i, m){
			// if same marker or m is itself a cluster, continue
			if((i == n) || m.iscluster) return;		
			
			if(nearPoints(m, c)){
				if(!c.iscluster){
					c.iscluster = true;
					c.clusterdata = {
						count:2,
						latmin: m.location.lat,
						lonmin: m.location.lon,
						latmax: m.location.lat,
						lonmax: m.location.lon
					}
				}else{
					d = c.clusterdata;
					d.count++;
					d.latmin = Math.min(d.latmin, m.location.lat);
					d.lonmin = Math.min(d.lonmin, m.location.lon);
					d.latmax = Math.max(d.latmax, m.location.lat);
					d.lonmax = Math.max(d.lonmax, m.location.lon);			
				}
				
				$(m.element).hide();
			}
		});
	});
	
	// zooming function
	var clusterclick = function(){
		var d = markerLayer.markers()[ $(this).data('map-index') ].clusterdata;
		map.setExtent(new MM.Extent(d.latmax, d.lonmin, d.latmin, d.lonmax));
		cluster();
	}
	
	$(ma).each(function(n, m){
		if(m.iscluster)
			$(m.element).on('click.cluster', clusterclick);
		else
			$(m.element).off('click.cluster');
	});

}


/* --- new bribes ---------------- */

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

    // Here put the coordinates in field Latitude and Longitude
    $('#entry_4').attr('value', l.lat.toFixed(5));
    $('#entry_6').attr('value', l.lon.toFixed(5));
}


/* --- mouse/touch listeners ---------------- */

function listenForNewBribes(){
	
	addBribeMode = true;
	
	// fade out markers
	$(markerLayer.parent).fadeTo('slow', 0.5);

	$(map.parent).append('<div id="listenerDiv"></div>');

	$('#listenerDiv').on({
        mousedown: testIntent,
        mousemove: touchCancel,
        mouseup: mouseup,
        touchstart: fixTouch,
        touchmove: touchCancel,
        touchcancel: touchCancel
    });
}

function stopListeningForNewBribes(){
	addBribeMode = false;
	$(markerLayer.parent).fadeTo('fast', 1);
	$('#listenerDiv').remove();
}


/* on touch or click, set timer to add marker (or cancel on move or second click) */

function testIntent(e) {
	
	mouseIsDown = true;
	
	var pos = new MM.Point(e.clientX, e.clientY);

    // Ignore double-clicks by ignoring clicks within 300ms of each other.
    if (killTimeout()) {
    	console.log('killed by timeout');
        return;
    }
	
	_clickTimeout = window.setTimeout(
        function () {
        	map.removeLayer(point);
            _clickTimeout = null;
            addMarker(e);
        } 
	, 300);
}

function touchCancel(e) {
	e.preventDefault();
   	if((e.type == 'mousemove') && !mouseIsDown)
   		return;
    _downLock = false;
     window.clearTimeout(_clickTimeout);
    _clickTimeout = null;
}

function mouseup(e){
	mouseIsDown = false;
}

/* fix touch event to always include clientX */
function fixTouch(e){
	touches = e.touches ? e.touches : e.originalEvent.touches
	e.clientX = touches[0].clientX;
	e.clientY = touches[0].clientY;
	testIntent(e);
}

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



