$(function(){

	$('#kuching').click(function(){
		map.ease.location({
		    lat: 1.54683,
		    lon: 110.34876
		}).zoom(11).optimal();
	});
	
	$('#bintulu').click(function(){
		map.ease.location({
		    lat: 3.256,
		    lon: 113.096
		}).zoom(11).optimal();
	});
	
	$('#miri').click(function(){
		map.ease.location({
		    lat: 4.36976,
		    lon: 113.98284
		}).zoom(11).optimal();
	});	

	$('#sibu').click(function(){
		map.ease.location({
		    lat: 2.342,
		    lon: 111.841
		}).zoom(11).optimal();
	});	

	$('#sematan').click(function(){
		map.ease.location({
		    lat: 1.8056,
		    lon: 109.7763
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
		
});