$(function(){

	$('#betong').click(function(){
		map.ease.location({
		    lat: 1.440,
		    lon: 111.599
		}).zoom(11).optimal();
	});
	
	$('#bintulu').click(function(){
		map.ease.location({
		    lat: 3.256,
		    lon: 113.096
		}).zoom(11).optimal();
	});
	
	$('#kapit').click(function(){
		map.ease.location({
		    lat: 1.966,
		    lon: 113.634
		}).zoom(11).optimal();
	});

	$('#kuching').click(function(){
		map.ease.location({
		    lat: 1.54683,
		    lon: 110.34876
		}).zoom(11).optimal();
	});
	
	$('#limbang').click(function(){
		map.ease.location({
		    lat: 4.386,
		    lon: 115.183
		}).zoom(11).optimal();
	});

 	$('#miri').click(function(){
		map.ease.location({
		    lat: 4.36976,
		    lon: 113.98284
		}).zoom(11).optimal();
	});	
	
	$('#mukah').click(function(){
		map.ease.location({
		    lat: 2.547,
		    lon: 112.320
		}).zoom(11).optimal();
	});	
	

	$('#sibu').click(function(){
		map.ease.location({
		    lat: 2.342,
		    lon: 111.841
		}).zoom(11).optimal();
	});	

	$('#sriaman').click(function(){
		map.ease.location({
		    lat: 1.269,
		    lon: 111.467
		}).zoom(11).optimal();
	});	
	
	$('#overview').click(function(){
		map.ease.location({
		    lat: 2.55759,
		    lon: 113.44588
		}).zoom(8).optimal();
	});	
			
	$('.message li a').click(function(){
		var parent = $(this).parent();
        siblings = parent.siblings(),
        isOn = parent.toggleClass('active').hasClass('active');
    	siblings.toggleClass('active', !isOn);	
    });
    
    $('span.close').click(function(){
		$(this).parent().slideToggle(50);
		//$('.introduction').slideToggle(50);
		return false;
    });
        
    $("#subForm").validate({
		errorContainer: ".error", 
		errorLabelContainer: ".error", 
		errorElement: "p",
    	rules: {
    		"cm-jtyuiii-jtyuiii": {
				required:true,
				email:true
    		}		
    	},
    	messages: {
    		"cm-jtyuiii-jtyuiii":'We need a proper email address'
    	},
    	submitHandler: function() {
    
    		$('#subForm input:submit').attr('value','Sending');
    		$('#subForm input:submit').attr("disabled", true);
        		
    		form.submit();
    		
    	}
    });
    
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