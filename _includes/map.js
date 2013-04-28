
	var GOOGLEDOCS_DATA_ID = '0AsL-qFOSUlaOdDktQ0JlZU9RaHNZbmJOOFk4T2kwSkE';
	var MAP_ID = 'goodcaesar.map-vwfp7lw5';
	var PRODUCTION_ADDRESS = 'http://election.sarawakreport.org/'; //'http://election.sarawakreport.org/';
	var LATLNG_COMPARE_PRECISION = 5;
	var disqus_url = PRODUCTION_ADDRESS;
	var main_title = 'Malaysia Election Bribe & Abuse Map';
	
	function roughlyCompareLatLngs(latLngA, latLngB, prec){
		return (
			parseFloat(latLngA.lat).toFixed(prec) == parseFloat(latLngB.lat).toFixed(prec) 
			&& 
			parseFloat(latLngA.lng).toFixed(prec) == parseFloat(latLngB.lng).toFixed(prec)
		);	
	}
	
	var ElectionReports = function(){
	
		var _ER = this;
		this.reports = [];
		this.markers = [];
		this.loadQuery = false;
		
		this.loadReports = function(reports){
			
			_ER.reports = reports;
			
			$(reports).each(function(n, report){
				if(report.latitude && report.longitude)
					new ElectionMarker(report);
			});
			
			map.on('zoomend', function(){
				_ER.drawFeatures();
				Browser.refreshStatus();
			});
			
			map.on('moveend', function(){
				 //_ER.openPopupAt(_ER.getCenter());
				 Browser.refreshStatus();
			});
			
			_ER.drawFeatures();
			
			if(_ER.loadQuery){
				window.location.hash = _ER.loadQuery;
				var LQ = function(){
					_ER.openPopupAt(_ER.getCenter(_ER.loadQuery), LATLNG_COMPARE_PRECISION);
				}
				map.on('ready', LQ);
				setTimeout(function(){ // once more for luck
					LQ();
					_ER.loadQuery = false;
				});
			}
			
			
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
		
			// Clustering time ...
			$(_ER.markers).each(function(n, parent){
				$(_ER.markers).each(function(k, marker){
				
					// if previously compared or marker is already in a cluster, continue
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
		    
		    // open popup, unless waiting for second hash load
		    if(!_ER.loadQuery)
		   		_ER.openPopupAt(_ER.getCenter());
		}
		
		// bizarrely, this is /more accurate/ than map.getCenter()
		this.getCenter = function(hash){
			var a = (hash ? hash : window.location.hash).split('/');
			return {
				lat: a[1],
				lng: a[2]
			};
		}
		
		this.openPopupAt = function(latLng, prec){
		
			if(Bribes.listening)
				return;
				
			if(!prec)
				prec = 2;
				
			$(_ER.markers).each(function(n, marker){
				if(roughlyCompareLatLngs(latLng, marker.latLng, prec)){
					marker.openPopup();
					window.location.hash = marker.fragment();
					// this fires only once on page load
					if(_ER.loadQuery)
						_ER.read( marker.report.index );
					return false;
				}
			});
		}
		
		this.closePopups = function(){
			$(_ER.markers).each(function(n, marker){
				marker.LMarker.closePopup();
			});
		}
		
		this.read = function(r){
			
			var reports = [];
			
			if(r == void 0){ // undefined
				reports = this.reports.slice();
			}else if ($.isArray(r)){
				$(r).each(function(n, i){
					reports.push(this.reports[i]);
				});
			}else{
				reports = [ this.reports[r] ];
			}
					
			Browser.open(reports);
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
			
			this.shareUrl = function(){
				return '8/' + this.latLng.lat + '/' + this.latLng.lng;
			}
			
			this.fetchReports = function(){
				if(!this.cluster) return [this.report];
				var reports = [];
				$(this.cluster).each(function(n,m){
					reports.push(m.report);
				});
				return reports.reverse();
			}
			
			this.openPopup = function(){
				var m = this.parent ? this.parent : this;
				m.LMarker.openPopup();
				$('.report-tooltip').removeClass('active');
				if(this.parent || this.cluster)
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
				//window.location.hash = _EM.fragment();
				map.panTo(_EM.latLng);
				_EM.LMarker.openPopup()
			});
			
			$(this.element).on('dblclick.marker', function(){
			//	window.location.hash = _EM.fragment();
				//_EM.LMarker.closePopup();
				map.setView(_EM.latLng, map.getZoom()+2);
				
			});
			
			_ER.markers.push(this);
		};
		
		
	}
	
	
	var ElectionBrowser = function(){
	
		this.latLng = false;
		this.visible = false;
		this.multiple = false;
		
		this.refreshStatus = function(){
			if(this.multiple)
				return;
			if(this.visible && this.latLng && roughlyCompareLatLngs(this.latLng, Reports.getCenter(), 4))
				return;
			this.close();
		}
	
		this.open = function(reports){
			
			var theReport = reports.slice().pop();
			reports.reverse(); // most recent first
			
			this.multiple = (reports.length > 1);
			this.latLng = this.multiple ? false : theReport.marker.latLng;
			this.visible = true;

			$('#browse-inner').html(
				formatBrowseReports(reports)	
			);
			
			// Dynamically set page title
			document.title = theReport.title + ' | ' + main_title;		
			
			// Set meta description & title from bribe for facebook
			$('meta[property="og:title"]').attr('content', theReport.title ); 
			$('meta[property="og:description"]').attr('content', theReport.description );
			
			if(disqus_url){
				loadDisqus(disqus_identifier, disqus_url);	
				new Facebook().fetchShareCount(theReport);	
			}
			
			if(this.multiple){
				$('.gdoc.report-browse').on('click', function(){
					var index = parseInt($(this).attr('id').split('-').pop());
					var marker = Reports.reports[index].marker;
					if(marker){
						map.panTo(marker.latLng);
						marker.openPopup();
					}
				});
			}
			
			$('#browse').show();
			if(this.multiple)
				Reports.closePopups();
		}
		
		this.close = function(){
		
			document.title =  main_title;		
			
			this.visible = false;
			this.latLng = false;
			this.multiple = false;
			$('#browse').hide();		
		}
	}

	
	// set up map ahead of ajax call
	
	var Reports = new ElectionReports();
	window.Reports = Reports;
	
	var Browser = new ElectionBrowser();
	window.Browser = Browser;
	
	var map = L.mapbox.map('map', MAP_ID)
		.setView([2.371, 113.347], 8);
		
	window.map = map;
		
	var markerLayer = L.mapbox.markerLayer(MAP_ID);

	map.addLayer(markerLayer);
		
	var Hash = new L.Hash(map);
	
	if($.QueryString.p){
		window.location.hash = $.QueryString.p;
		Reports.loadQuery = $.QueryString.p;
		//console.log(Reports.getCenter( $.QueryString.p ) );		
	}

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
			
				for (var i = 0; i < x.feed.entry.length; i++){              
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


