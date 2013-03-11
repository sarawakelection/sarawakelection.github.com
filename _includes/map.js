/* map.js */

var data_id = '0AsL-qFOSUlaOdDktQ0JlZU9RaHNZbmJOOFk4T2kwSkE',
    map_id = 'goodcaesar.map-vwfp7lw5',
    markerLayer,
    addMarkerLayer,
    markers = [],
    lastClusterZoomLevel,
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
        var div = document.createElement('div'),
        	img = mapbox.markers.simplestyle_factory(m);
        div.className = 'markerHolder';
        img.style.marginTop = img.style.marginLeft = 0;
        div.appendChild(img);
        return div;
    });

    interaction = mapbox.markers.interaction(markerLayer);

    map.addLayer(markerLayer);
    map.ui.zoomer.add();
    map.ui.zoombox.add();

	// Formatting the popups
    interaction.formatter(function (feature) {
    
    	if(feature.iscluster) // no popups on clusters
    		return;
        
        if(feature.properties.link) {
        	websitelink = '<p><a href="' + feature.properties.link + '">Visit link</a></p>';
        } else {
        	websitelink = '';
        }
        
        var o = '<h3>' + feature.properties.title + '</h3>' +
            '<p>' + feature.properties.description +                        
            '<p><strong>Date:</strong> ' + feature.properties.date.replace('Fecha: ', "") + websitelink + '</p>';
        return o;
    });

    //out url for download  data
    download_data();
    
    // "zoomed" event sometimes happens before markers are placed at high zoom levels. Use timeout
	map.addCallback('zoomed', function(){
		setTimeout(cluster, 300);
	});
	
	
	// initial clustering
   	cluster();
    
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

	// this loop-heavy function can get called repeatedly by map events. Draw once per zoom level
	if(lastClusterZoomLevel == map.zoom())
		return;
	
	$('.clustercount').remove();
	$('.markerHolder').removeClass('cluster');
	//$('.marker-tooltip').hide();

    var i = 0;
    markers = [];
    $(markerLayer.markers()).each(function(n, m){
    	if(m.element.className !== 'markerHolder') return;
    	m.point = map.locationPoint(m.location);
    	if(isNaN(m.point.x)) return;

    	// clear clusters
    	$(m.element).data('map-index', i);
		m.data.iscluster = false;
		m.clusterdata = {};
		$(m.element).show();

    	markers[i] = m;
    	i++;
    });
    
    var nearPoints = function(m1, m2){
    	if(isNaN(m1.point.x) || isNaN(m2.point.x))
    		return false;
		return (Math.abs(m1.point.x - m2.point.x) < 10) && (Math.abs(m1.point.y - m2.point.y) < 10);
	}
	
	// take potential cluster $c and compare to marker $m 
	$(markers).each(function(n, c){
		
		$(markers).each(function(k, m){
		
			// if same marker or m is itself a cluster, continue
			if((k == n) || m.data.iscluster) return;		
			
			if(nearPoints(m, c)){
				if(!c.data.iscluster){
					c.data.iscluster = true;
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
		d = markers[ $(this).data('map-index') ].clusterdata;
		map.setExtent(new MM.Extent(d.latmax, d.lonmin, d.latmin, d.lonmax));
		map.zoom(map.zoom()-1);
		setTimeout(cluster, 500);	
	}
	
	$(markers).each(function(n, m){
		if(m.data.iscluster){
			m.data.iscluster = true;
			$(m.element).addClass('cluster');
			$(m.element).append(
				'<div class="clustercount">'+m.clusterdata.count+'</div>'
			);
			$(m.element).on('click.cluster', clusterclick);
			$(m.element).on('touchstart.cluster', clusterclick);
		}else{
			$(m.element).off('click.cluster');
			$(m.element).off('touchstart.cluster');			
		}
	});

	lastClusterZoomLevel = map.zoom();
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

// Clear the double-click timeout (we conserve double-clicks for zooming in)
function killTimeout() {
    if (_clickTimeout) {
        window.clearTimeout(_clickTimeout);
        _clickTimeout = null;
        return true;
    } else {
        return false;
    }
}    

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




