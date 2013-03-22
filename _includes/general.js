/* general.js */

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
    
    $('#jumper li a').click(function(){
    	var parent = $(this).parent();
        siblings = parent.siblings(),
        isOn = parent.toggleClass('active').hasClass('active');
    	siblings.toggleClass('active', !isOn);	
    });
        
    $('#sabah').click(function(){
    	map.ease.location({
    	    lat: 5.587287818739588,
    	    lon: 117.13179003906242
    	}).zoom(9).optimal();
    });   
    
    $('#west').click(function(){
    	map.ease.location({
    	    lat: 4.006763448257865,
    	    lon: 102.15791732084676
    	}).zoom(8).optimal();
    }); 
    
    $('#sarawak').click(function(){
    	map.ease.location({
    	    lat: 2.371,
    	    lon: 113.347
    	}).zoom(8).optimal();
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
    
    $("#contact").validate({
    	rules: {
    		"subject": {
    			required:true,
    			minlength:5
    		},
    		"email": {
    			required: true,
    			email: true
    		},
    		"message": {
    			required: true,
    			minlength:10
    		}		
    	},
    	messages: {
    		"subject":'What are you contacting us about?',
    		"email":'Enter a valid email address',
    		"message":'Please enter your message'
    	},
    	submitHandler: function() {	    		
    		$('#contact input:submit').attr('value','Sending');
    		$('#contact input:submit').attr("disabled", true);	       		
    		form.submit();	    		
    	}
    });    
	
	$('.addbribe').click(function(){   
		
		listenForNewBribes();

		// fade in an old marker if it's there
		$('.marker').fadeIn(250);
		
		$('.submit-map').slideToggle(50);
	});
	
    $('span.close').click(function(){

    	$('.marker').fadeOut(250);
    	stopListeningForNewBribes();
    	
		$(this).parent().slideToggle(50);
		$('.tab-buttons li a').removeClass('one');
		//$('.introduction').slideToggle(50);
		return false;
    });
	
	$('a.about-btn').click(function(){  
		$(this).toggleClass('one'); 		
		$('section.content.about').slideToggle(50);
	});
	
	$('a.contact-btn').click(function(){  
		$(this).toggleClass('one'); 		
		$('section.content.contact').slideToggle(50);
	});
    
    $('a.browse-btn').click(function(){  
    	$(this).toggleClass('one'); 		
    	$('section.content.bribes-list').slideToggle(50);
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