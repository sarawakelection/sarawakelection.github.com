$(function(){
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
    
    setTimeout(function(){ $('#map .introduction').fadeOut('fast'); }, 5000);	    
        
});

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
		"entry.4.single":'Mark the location on the Map',
		"entry.8.single":'Please check the website link',
		"entry.0.single":'We need a date'
	},
	submitHandler: function() {

		$('#ss-form input:submit').attr('value','Submitting data');
		$('#ss-form input:submit').attr("disabled", true);

		$('.section.submit-map').fadeOut('slow');
		
		$('.message.thankyou').addClass('on');
		
		form.submit();
		
	}
});