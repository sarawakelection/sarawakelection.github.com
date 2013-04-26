/* form.js */


    //Set up date pickers
    var now = new Date();
    now = now.getDate()  + '/' +  now.getMonth() + '/' + now.getFullYear();
    $('#entry_0').datepicker({
        dateFormat: 'dd/mm/yy', // formato de fecha que se usa en España
        dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // días de la semana
        dayNamesMin: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], // días de la semana (versión super-corta)
        dayNamesShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sut'], // días de la semana (versión corta)
        firstDay: 1, // primer día de la semana (Lunes)
        maxDate: new Date(), // fecha máxima
        minDate: '-2y',
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // meses
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // meses
        navigationAsDateFormat: true,
    });

    //Add href and disable some fields
    //$('.header a').attr('href','https://docs.google.com/spreadsheet/pub?key=0AhfXukqwpMbidDdTU3M0dE5raElpb3M2Y09ZaEJVSmc&output=xls');
    $('#ss-form').attr('action','https://docs.google.com/a/goodcaesar.com/spreadsheet/formResponse?formkey=dDktQ0JlZU9RaHNZbmJOOFk4T2kwSkE6MQ&amp;ifq');
    
    $("#entry_0").attr('readonly',  'readonly');
    $("#entry_1").attr('readonly',  'readonly');
    
    $("#entry_4").attr('readonly',  'readonly');
    $("#entry_6").attr('readonly',  'readonly');
    
    $('span.help a').click(function() {
    	$('#map .introduction').slideToggle('fast');
    });
    
    //setTimeout(function(){ $('#map .introduction').fadeOut('fast'); }, 5000);	    

	$("#ss-form").validate({
		rules: {
			"entry.7.single": {
				required:true,
				minlength:2
			},
			"entry.0.single": {
				required: true			
			},
			"entry.4.single": {
				required: true			
			},
			"entry.8.single": {
				url: true
			}		
		},
		messages: {
			"entry.7.single":'Please tell us what you saw',
			"entry.8.single":'Please check the website link',
			"entry.0.single":'We need a date'
		},
		submitHandler: function(form) {

			$('#ss-form input:submit').attr('value','Submitting data');
			$('#ss-form input:submit').attr("disabled", true);

			//$('#map').map.interaction.refresh();
			
			Bribes.stopListening();
			$('.submit-map').fadeOut('slow');
		
			$('#message-thankyou.content').show();
			
			form.submit();
		
			setTimeout(function(){
				location.reload();
			}, 5000);
		
		}
	});



	var ElectionBribes = function(){

		this.listening = false;
		this.mouseisdown = false;
		this._clickTimeout = false;
		this.marker = false;
		
		var _EB = this;

		this.startListening = function(){
			
			this.listening = true;

			$('#map').append('<div id="listenerDiv"></div>');
			
			$('#listenerDiv').on({
				mousedown: this.testIntent,
				mousemove: this.touchCancel,
				mouseup: this.mouseup,
				touchstart: this.fixTouch,
				touchmove: this.touchCancel,
				touchcancel: this.touchCancel
			});
			
			$('.markerHolder').fadeTo('slow', 0.3);
			Reports.drawFeatures();
			
			if(this.marker)
				$(this.marker._icon).show();
		}
		
		this.stopListening = function(){
			this.listening = false;
			if(this.marker)
				$(this.marker._icon).hide();
			$('.markerHolder').css('opacity', 0.95);
			$('.markerHolder').hide();
			$('.markerHolder.visible').fadeTo('fast', 0.95);
			$('#listenerDiv').remove();
			Reports.drawFeatures();
		}

		this.testIntent = function(e){
		
			this.mouseIsDown = true;

			if (_EB.killTimeout()) {
				console.log('killed by timeout');
				return;
			}

			_clickTimeout = window.setTimeout(
				function () {
					_clickTimeout = null;
					_EB.addMarker(e);
				} 
			, 300);
			
		}
		
		this.killTimeout = function() {
			if (_EB._clickTimeout) {
				window.clearTimeout(_EB._clickTimeout);
				_EB._clickTimeout = null;
				return true;
			} 
			return false;
		}
		
		this.touchCancel = function(e) {
			e.preventDefault();
			if((e.type == 'mousemove') && !_EB.mouseIsDown)
				return;
			window.clearTimeout(_EB._clickTimeout);
			_EB._clickTimeout = null;
		}
		
		this.mouseup = function(e){
			_EB.mouseIsDown = false;
		}
		
		/* fix touch event to always include clientX */
		this.fixTouch = function(e){
			touches = e.touches ? e.touches : e.originalEvent.touches
			e.clientX = touches[0].clientX;
			e.clientY = touches[0].clientY;
			_EB.testIntent(e);
		}
		
		this.addMarker = function(e){
			
			var latLng = map.mouseEventToLatLng(e);
				
			if(this.marker)
				this.marker.setLatLng(latLng);
			else{
				this.marker = L.marker(latLng , {
					icon: L.icon({
						iconUrl: '/a/bribe-marker.png',
						iconSize:     [60, 49], // size of the icon
						iconAnchor:   [30, 49], // point of the icon which will correspond to marker's location
					})
				});
				this.marker.addTo(map);
			}
			
			$('#entry_4').attr('value', latLng.lat.toFixed(5));
			$('#entry_6').attr('value', latLng.lng.toFixed(5));
			
			setTimeout(function(){
				map.setView(latLng, map.getZoom());
			}, 500);
				
		}

	}
	
	var Bribes = new ElectionBribes();
 
 
 	var geolocate = document.getElementById('geolocate');

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
	  
