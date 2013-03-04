// fmonth is function that, creating a dinamics dates, in the view
function fmonth(f) {

    //array aMonth for take moths from JSON
    var aMonth = [];
    // array de que se genera de la fecha
    var aDate = [];
    var parent = document.getElementById('months');

    //take only month from date in googlespretsheet dd/MM/yyyy
    _.each(f, function (value, key) {
        aDate = f[key].properties.date.split("/");
        aMonth.push(aDate[1]); //push month in array aMoth
    });

    aMonth = _.chain(aMonth)
                .uniq()
                .compact()
                .value();

    aMonth = aMonth.sort();

    //create a tag "li" and  "a" with "id=aMonth[i]" for menu month in the view
    for (var i = 0; i < aMonth.length; i++) {
        var new_li = document.createElement('li');
        new_li.innerHTML = '<a href= \'#\'  id=\'' + aMonth[i] + '\' > ' + monthNames[aMonth[i] - 1] + '</a>';
        parent.appendChild(new_li);
    }
}

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
        
        $('#count').html(x.feed.entry.length + ' reports received');
        
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
            
            dater = entry['gsx$date'].$t;            
            //console.log(dater.sort());
            
            if(entry['gsx$link'].$t) {
            	websitelink = '<p><a href="' + entry['gsx$link'].$t + '">Visit link</a></p>';
            } else {
            	websitelink = '';
            }
            
            var description = entry['gsx$description'].$t            

			// Output this as a browsable list
			content = '<div class="bribe"><div class="inside"><h4>' + entry['gsx$title'].$t + '</h4>'+ '<p>' + '<p><small>' + entry['gsx$date'].$t + '</small></p><p class="desc">'+ description + '</p>' + websitelink + '</div></div>';

            //console.log(content);

			$(content).appendTo('.bribes-list').hide().fadeIn(500);

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