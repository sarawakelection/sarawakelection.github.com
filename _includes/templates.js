

	function formatTooltipReports(reports){
	
		var html = '';
		
		if(reports.length > 1){
			html += '<h3>' + reports.length + ' Reports</h3>'
				+ '<div class="tooltip-reports multiple">';
			$(reports).each(function(n, report){
				html += '<div class="bribe gdoc clearfix report-tooltip report-'+report.index+'">'
					+ '<div class="inside"><h4>' + report.title + '</h4>' + '<p class="date"><small>' + report.date + '</small></p>'
					+ '<p class="read"><a href="javascript:Reports.read(' + report.index + ')">Read more &raquo;</a></p></div></div>';
			});
		}else{
			html += '<div class="tooltip-reports">';
			var report = reports[0];
			html += '<div class="bribe gdoc clearfix report-tooltip report-'+report.index+'" id="report-'+report.index+'">'
				+ '<div class="inside"><h4>' + report.title + '</h4>' + '<p class="description">' + report.description + '</p>';
			if(report.link)
				html += '<p class="link">Link: <a href="' + report.link + '">' + truncateUrl(report.link) + '</a></p>';
			html += '<p class="date"><small>' + report.date + '</small></p>'
				+ '<p class="read"><a href="javascript:Reports.read(' + report.index + ')">Comments and sharing &raquo;</a></p></div></div>';			
		}
		
		html += '</div>'
		
		return html;
	
	}
	
	function formatBrowseReports(reports){
	
		var html = '<a class="leaflet-popup-close-button" href="javascript:Browser.close();">×</a>';
		
		if(reports.length > 1){
		
			disqus_url = false;
			disqus_identifier = false;
		
			html += '<h3>' + reports.length + ' Reports</h3>'
				 + '<div class="browse-reports multiple">';
				 
			$(reports).each(function(n, report){
				html += '<div class="bribe gdoc clearfix browse-tooltip report-'+report.index+'">'
					 + '<div class="inside"><h4>' + report.title + '</h4>' + '<p class="description">' + report.description + '</p>';
				if(report.link)
					html += '<p class="link">Link: <a href="' + report.link + '">' + truncateUrl(report.link) + '</a></p>';
				html += '<p class="date"><small>' + report.date + '</small></p>'
					 + '</div></div>';		
			});			
			
			html += '</div>';
			
			return html;
		
		}
		
		var report = reports[0];
		
		disqus_url = PRODUCTION_ADDRESS + '?p=' + report.marker.fragment();
		disqus_identifier = report.marker.fragment() + ' ' + PRODUCTION_ADDRESS + '?p=' + report.marker.fragment();
 			
		html += '<div class="browse-reports">';
		html += '<div class="bribe gdoc clearfix report-browse report-'+report.index+'">'
			 + '<div class="inside"><h4>' + report.title + '</h4>' + '<p class="description">' + report.description + '</p>';
		if(report.link)
			html += '<p class="link">Link: <a href="' + report.link + '">' + truncateUrl(report.link) + '</a></p>';
		html += '<p class="date"><small>' + report.date + '</small></p>'
		
			 + 'Link to this report: <input type="text" disabled value="' + disqus_url + '" />'
			 
			 + 'Disqus <div id="disqus_thread"></div>'
		
			 + '</div></div>';	
			
		html += '</div>';
			
		return html;
	
	}
