$(function(){
	
	//https://spreadsheets.google.com/feeds/list/0AsL-qFOSUlaOdDktQ0JlZU9RaHNZbmJOOFk4T2kwSkE/od6/public/values?alt=json-in-script&callback=callback
	
	var data_id = '0AsL-qFOSUlaOdDktQ0JlZU9RaHNZbmJOOFk4T2kwSkE';

	if (typeof reqwest === 'undefined'){
	    throw 'CSV: reqwest required for mmg_csv_url';
	}

	var url = 'https://spreadsheets.google.com/feeds/list/' +
	    data_id + '/od6/public/values?alt=json-in-script&callback=callback';
	reqwest({
	    url: url,
	    type: 'jsonp',
	    jsonpCallback: 'callback',
		success: function(data){
		  //alert("success");
		  console.log('Oh yeah');
		}
	});
	
    function response(x) {
        var features = [],
            latfield = '',
            lonfield = '';
        if (!x || !x.feed) return features;
        for (var f in x.feed.entry[0]) {
            if (f.match(/\$Lat/i)){
                latfield = f;           
            }
            if (f.match(/\$Lon/i)){
                lonfield = f;              
            }
        }
        
	}

	console.log(x.feed.entry.length);	

});