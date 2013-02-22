$.fn.textlimit = function() { 
	return this.each(function(){
	    var $elem = $(this);            // Adding this allows u to apply this anywhere
	    var $limit = 22;                // The number of characters to show
	    var $str = $elem.text();        // Getting the text
	    var $strtemp = $str.substr(0,$limit);   // Get the visible part of the string
	    $str = $strtemp + '<span class="hide">' + $str.substr($limit,$str.length) + '</span> ...';  
	    $elem.html($str);
    })
};

function jsonEscape(str)  {
    return str.replace("\\n", "\\\\n").replace("\\r", "\\\\r").replace("\\t", "\\\\t");
}

function mmg_google_docs_spreadsheet_1(id, callback) {
    if (typeof reqwest === 'undefined'){
        throw 'CSV: reqwest required for mmg_csv_url';
    }

    var url = 'https://spreadsheets.google.com/feeds/list/' +
        id + '/od6/public/values?alt=json-in-script&callback=callback';
    reqwest({
        url: url,
        type: 'jsonp',
        jsonpCallback: 'callback',
        success: response,
        error: response
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
        
        //console.log(x.feed.entry.length);
        
        //$('#count').html(x.feed.entry.length +' counts of bribery reported');
        
        for (var i = 0; i < x.feed.entry.length; i++) {                             
            var entry = x.feed.entry[i];
            var feature = {
                geometry: {
                    type: 'Point',
                    coordinates: []
                },
                properties: {
                    "marker-size": "small",
                    'marker-color':'#fff',
                    'description': entry['gsx$description'].$t,  
                    'link': entry['gsx$link'].$t,  
                    'date': 'Date: ' + entry['gsx$date'].$t,
                    'hour': 'Hour: ' + entry['gsx$time'].$t
                }
            };
            
            if(entry['gsx$link'].$t) {
            	websitelink = '<p><a href="' + entry['gsx$link'].$t + '">Visit link</a></p>';
            } else {
            	websitelink = '';
            }
            
            var description = entry['gsx$description'].$t
            
			
		    var shortdesc = jQuery.trim(description).substring(0, 400).split(" ").slice(0, -1).join(" ") + "...";        
		   
		   //shortdesc = entry['gsx$description'].$t;
		   
		   //console.log(jsonEscape(description));
		   
		   
		   	//console.log(shortdesc);
		   
		   //textdescription = entry['gsx$description'].$t;     
		    
		    //$(textdescription).textlimit();
		    		            
			// Output this as a browsable list
			content = '<div class="bribe"><h4>' + entry['gsx$title'].$t + '</h4>'+ '<p>' + '<p><small>' + entry['gsx$date'].$t + '</small></p><p class="desc">'+ shortdesc + '</p>' + websitelink + '</div>';
            
            //console.log(content);

			$(content).appendTo('#bribes-list').hide().fadeIn(500);

			//$(content).appendTo("#bribes-list");

            for (var y in entry) {
                if (y === latfield) feature.geometry.coordinates[1] = parseFloat(entry[y].$t);
                else if (y === lonfield) feature.geometry.coordinates[0] = parseFloat(entry[y].$t);
                else if (y.indexOf('gsx$') === 0) {                            
                    feature.properties[y.replace('gsx$', '')] = entry[y].$t;
                }
            }
        // Leftover                            
        if (feature.geometry.coordinates.length == 2) features.push(feature);

            _.each(feature, function(value, key) {
                if(feature.properties['title']=="Robo"){ feature.properties['marker-color']='#CB3344'} 
                if(feature.properties['title']=="Intento de Robo") {feature.properties['marker-color']='#FFCC33'}
                if(feature.properties['title']=="Agresión") { feature.properties['marker-color']='#653332'}
                if(feature.properties['title']=="Accidente") {feature.properties['marker-color']='#CC6633'}   
                if(feature.properties['title']=="Violencia Familiar") {feature.properties['marker-color']='#666535'}                         
                if(feature.properties['title']=="Otros") {feature.properties['marker-color']='#222222'}  /*#20445C*/      
            });
        }
     
     
        return callback(features);
    }
}