
	var GOOGLEDOCS_DATA_ID = '0AsL-qFOSUlaOdDktQ0JlZU9RaHNZbmJOOFk4T2kwSkE';
	var MAP_ID = 'goodcaesar.map-vwfp7lw5';
	var PRODUCTION_ADDRESS = 'http://election.sarawakreport.org/';
	var LATLNG_COMPARE_PRECISION = 2;
	
	var ElectionReports = function(){
	
		var _ER = this;
		this.reports = [];
		this.markers = [];
		
		this.loadReports = function(reports){
			
			_ER.reports = reports;
			
			$(reports).each(function(n, report){
				if(report.latitude && report.longitude)
					new ElectionMarker(report);
			});
			
			_ER.drawFeatures();
			
			map.on('zoomend', function(){
				_ER.drawFeatures();
			});
			map.on('moveend', function(){
				 _ER.openPopupAt(map.getCenter());
			});
			
		}
		
		this.drawFeatures = function(){
		
			// reset data
			$(this.markers).each(function(n, marker){
				marker.cluster = false;
				marker.parent = false;
				$(marker.element).html('');
				$(marker.element).show();
				$(marker.element).addClass('visible');
				marker.LMarker.closePopup();
			});
		
			// Clustering time
			$(_ER.markers).each(function(n, parent){
				$(_ER.markers).each(function(k, marker){
				
					// if previously compared or c already part of a cluster, continue
					if ( k <= n || marker.parent) return;
					
					if(parent.fetchPoint().distanceTo(marker.fetchPoint()) < 25){ // leaflet rocks
					
						if(!parent.cluster) parent.cluster = [parent];
							
						marker.parent = parent;
						$(marker.element).hide();
						$(marker.element).removeClass('visible');
						
						parent.cluster.push(marker);
						$(parent.element).html(parent.cluster.length);
					}
					
				});			
			}); // and that's it!
			
			// set marker content
			$(_ER.markers).each(function(k, marker){
				marker.LMarker.bindPopup( formatTooltipReports(marker.fetchReports()) ,{
				    closeButton: true,
				    minWidth: 460,
				    offset: new L.Point(1, -12)
		        });
		    });
		    
		    // open popup
		    _ER.openPopupAt(map.getCenter());
		}
		
		this.openPopupAt = function(latLng){
			if(Bribes.listening)
				return;
			$(this.markers).each(function(n, marker){
				if(marker.isRoughlyAt(latLng)){
					marker.openPopup();
					return false;
				}
			});		
		}
		
		this.closePopups = function(){
			$(_ER.markers).each(function(n, marker){
				marker.LMarker.closePopup();
			});
		}
		
		var ElectionMarker = function(report){
			
			this.index = _ER.markers.length;
			this.report = report;
			report.marker = this;
			this.latLng = new L.LatLng(report.latitude, report.longitude);
			this.cluster = false;
			this.parent = false;
			var _EM = this;
			
			this.fetchPoint = function(){
				return map.latLngToLayerPoint(this.latLng);
			}
			
			this.fragment = function(){
				return map.getZoom() + '/' + this.latLng.lat + '/' + this.latLng.lng;
			}

			this.isRoughlyAt = function(latLng){
				return (
					parseFloat(latLng.lat).toFixed(LATLNG_COMPARE_PRECISION) == parseFloat(this.latLng.lat).toFixed(LATLNG_COMPARE_PRECISION) 
					&& 
					parseFloat(latLng.lng).toFixed(LATLNG_COMPARE_PRECISION) == parseFloat(this.latLng.lng).toFixed(LATLNG_COMPARE_PRECISION)
				);
			}
			
			this.fetchReports = function(){
				if(!this.cluster) return [this.report];
				var reports = [];
				$(this.cluster).each(function(n,m){
					reports.push(m.report);
				});
				return reports;
			}
			
			this.openPopup = function(){
				var m = this.parent ? this.parent : this;
				m.LMarker.openPopup();
				if(this.parent)
					$('.report-tooltip.report-'+this.report.index).addClass('active');
			}

			this.LMarker = L.marker(this.latLng, {
				icon:  L.divIcon({
					className: 'markerHolder', 
					iconSize: 25
				}) 
			});
						
			this.LMarker.addTo(markerLayer);
			this.element = this.LMarker._icon;		

			$(this.element).on('click.marker', function(){
				window.location.hash = _EM.fragment();
				_EM.LMarker.openPopup()
			});
			
			$(this.element).on('dblclick.marker', function(){
				map.zoomIn(2);
				_EM.LMarker.closePopup();
			});
			
			_ER.markers.push(this);
		};
		
		
	}
	

	
	// set up map ahead of ajax call
	
	var Reports = new ElectionReports();
	
	var map = L.mapbox.map('map', MAP_ID)
		.setView([2.371, 113.347], 8);
		
	var markerLayer = L.mapbox.markerLayer(MAP_ID);

	map.addLayer(markerLayer);
	
	if($.QueryString.p)
		window.location.hash = $.QueryString.p;
		
	new L.Hash(map);
	

	// fetch data from gdocs

	(function(callback){
		$.ajax({
		    url: 'https://spreadsheets.google.com/feeds/list/' + GOOGLEDOCS_DATA_ID + '/od6/public/values?alt=json-in-script&callback=callback',
		    type: 'GET',
		    dataType: 'jsonp',
		    jsonp: true,
		    jsonpCallback: 'callback',
		    error: function(xhr, status, error) {
		        alert('Failed to reach data source, status: ' + status);
		        return callback([]);
		    },
		    success: function(x) { 
				var reports = [];
				for (var i=0; i<x.feed.entry.length; i++){              
					var entry = x.feed.entry[i],
						report = { index: i }
				    for (var y in entry){
				    	if (y.indexOf('gsx$') === 0)
							report[y.replace('gsx$', '')] = entry[y].$t;
					}
					reports.push(report)
				}				
				return callback(reports);
		    }
		});		
	})(Reports.loadReports);


