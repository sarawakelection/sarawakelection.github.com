

	function formatTooltipReports(reports){
	
		var html = '';
		
		if(reports.length > 1){
			html += '<h3>' + reports.length + ' Reports</h3>'
				+ '<div class="tooltip-reports multiple">';
			$(reports).each(function(n, report){
				html += '<div class="bribe gdoc clearfix report-tooltip report-'+report.index+'">'
					+ '<div class="inside"><h4>' + report.title + '</h4>' + '<p class="date"><small>' + report.date + '</small></p>'
					+ '<p class="read"><a href="javascript:Reports.read(' + report.index + ')">Read more</a></p></div></div>';
			});
		}else{
			html += '<div class="tooltip-reports">';
			var report = reports[0];
			html += '<div class="bribe gdoc clearfix report-tooltip report-'+report.index+'" id="report-'+report.index+'">'
				+ '<div class="inside"><h4>' + report.title + '</h4>' + '<p class="description">' + report.description + '</p>';
			if(report.link)
				html += '<p class="link">Link: <a href="' + report.link + '">' + truncateUrl(report.link) + '</a></p>';
			html += '<p class="date"><small>' + report.date + '</small></p>'
				+ '<p class="read"><a href="javascript:Reports.read(' + report.index + ')">Comment &amp; Share</a></p></div></div>';			
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
		
		disqus_url = PRODUCTION_ADDRESS + '?p=' + report.marker.shareUrl();
		disqus_identifier = report.marker.shareUrl() + ' ' + PRODUCTION_ADDRESS + '?p=' + report.marker.shareUrl();
 		
 		var encoded_url    = encodeURIComponent(disqus_url);
 		var encoded_title  = encodeURIComponent(report.title);
 		var encoded_body   = encodeURIComponent(report.description);
 		var encoded_image  = encodeURIComponent(PRODUCTION_ADDRESS + '/a/og-image.jpg');
 			
		html += '<div class="browse-reports">';
		html += '<div class="bribe gdoc clearfix report-browse report-'+report.index+'">'
			 + '<div class="inside"><h3>' + report.title + '</h3>' + '<p class="description">' + report.description + '</p>';
		if(report.link)
			html += '<p class="link">Link: <a href="' + report.link + '">' + truncateUrl(report.link) + '</a></p>';
		html += '<p class="date"><small>' + report.date + '</small></p>'
						
			 + '<a title="Share on Facebook" id="share-facebook-' + report.index + '" class="facebook-share-button" href="http://www.facebook.com/sharer.php?s=100&p[title]=' + encoded_title + '&p[summary]=' + encoded_body + '&p[url]=' + encoded_url + '&p[images][0]=' + encoded_image + '" '
			 + 'target="_blank" onclick="return !window.open(this.href, \'Facebook\', \'width=640,height=300\')">-</a>'
			
			+ '<iframe allowtransparency="true" frameborder="0" scrolling="no" src="http://platform.twitter.com/widgets/tweet_button.html?url=' + encoded_url + '&amp;via=sarawak_report&amp;count=horizontal&amp;text='+report.title+'"  style="width:120px; height:25px;"></iframe>'
						
			 + '<p>Link: <input type="text" disabled value="' + disqus_url + '" /></p>'
			 
			 + '<div id="disqus_thread"></div>'
		
			 + '</div></div>';	
			
		html += '</div>';
			
		return html;
	
	}
