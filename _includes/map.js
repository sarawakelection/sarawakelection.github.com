var data_id = '0AsL-qFOSUlaOdDktQ0JlZU9RaHNZbmJOOFk4T2kwSkE',
    map_id = 'goodcaesar.map-vwfp7lw5',
    markerLayer,
    features,
    features_summary,
    interaction,
    layer = mapbox.layer().id(map_id),
    map = mapbox.map('map', layer, null, [easey_handlers.DragHandler()]);

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
               
        MM.addEvent(elem, 'click', function (e) {
            map.ease.location({
                lat: m.geometry.coordinates[1],
                lon: m.geometry.coordinates[0]
            }).zoom(map.zoom()).optimal();
        });
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

//call the  fuction from  google chart API,  for create main statistic box
google.load('visualization', '1', {
    packages: ['corechart']
});

//function for put href  for download data
function download_data() {
    $('#download_csv').attr('href', 'https://docs.google.com/a/developmentseed.org/spreadsheet/pub?key=' + data_id + '&output=csv');
    $('#download_josn').attr('href', 'https://spreadsheets.google.com/feeds/list/' + data_id + '/od6/public/values?alt=json-in-script');
}
