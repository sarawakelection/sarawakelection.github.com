/* general.js */



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
    	window.location.hash = [8, '5.58728', '117.13179'].join('/')
    	return false;
    });   
    
    $('#west').click(function(){
    	window.location.hash = [8, '4.00676', '102.15791'].join('/')
    	return false;
    }); 
    
    $('#sarawak').click(function(){
    	window.location.hash = [8, '2.371', '113.347'].join('/');
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
		Bribes.startListening();
		$('.submit-map').slideToggle(50);
	});
	
    $('span.close').click(function(){

    	$('.marker').fadeOut(250);
    	Bribes.stopListening();
    	
		$(this).parent().slideToggle(50);
		$('.tab-buttons li a').removeClass('one');
		//$('.introduction').slideToggle(50);
		return false;
    });
    
    function truncateUrl(url){
    
    	if(url.length < 50)
    		return url;
    		
    	return url.substr(0, 22) + '...' + url.substr(url.length-22);
    
    }
	
//	$('a.about-btn').click(function(){  
//		$(this).toggleClass('one'); 
//		$('section#about').slideToggle(50);
//	});
//	
//    $('a.browse-btn').click(function(){  
//
//		$(this).next('div:hidden').slideDown('fast')
//		    .siblings('div:visible').slideUp('fast');
//
//
//
//		$('section.content').hide();
//    	$(this).toggleClass('one'); 		
//    	$('section#bribes-list').slideToggle(50);
//    });
//	
//	$('a.contact-btn').click(function(){  
//		$(this).toggleClass('one'); 		
//		$('section.content.contact').slideToggle(50);
//	});
//    
    
    $('.buttons a').click(function () {
		$('.content').hide();
		browseMode = false;
		var target = $(this).attr("href");
		
		// breaking the elegance with a hack
		if(target == '#browse'){
			Reports.read();
  		}
  		
  		$(target).show();
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
    
    var Facebook = function(){
    
    	var _FB = this;
    	
    	this.fetchShareCount = function(report){
    	
    		if(report.facebookShares == void 0){
				
				$.ajax({
					url : 'http://graph.facebook.com/?id=' + encodeURIComponent( PRODUCTION_ADDRESS + '?p=' + report.marker.shareUrl() ),
					type: 'GET',
					 success: function(x){
					 	report.facebookShares = x.shares | 0;
					 	_FB.callback(report);
					 }
				});
    			return;
    		}
    		
    		this.callback(report);
    	}
    	
    	this.callback = function(report){
    		$('a#share-facebook-'+report.index).html(report.facebookShares);
    	}
    }

