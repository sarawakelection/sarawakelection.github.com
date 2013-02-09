try {
	var SRM = {};
	SRM.ScreenManager = {};
	SRM.ScreenManager.STATES = ["mobile","tablet","desktop"]; // for debug 
	SRM.ScreenManager.state = undefined;
 
	SRM.ScreenManager.updateState = function() {
		
		if ( (document.documentElement.clientWidth < 768) && SRM.ScreenManager.state !== 0) {
			SRM.ScreenManager.state = 0;
			SRM.ScreenManager.refresh();
		}
		
		else if ( (document.documentElement.clientWidth >= 768) && (document.documentElement.clientWidth < 980) && SRM.ScreenManager.state !== 1) { 
			SRM.ScreenManager.state = 1;
			SRM.ScreenManager.refresh();
		}
		
		else if ( (document.documentElement.clientWidth >= 980) && SRM.ScreenManager.state !== 2) { 
			SRM.ScreenManager.state = 2;
			SRM.ScreenManager.refresh();		
		}
	};

	SRM.ScreenManager.refresh = function() {

            console.log("state: " + SRM.ScreenManager.STATES[SRM.ScreenManager.state]); //debugging

            // - - - MOBILE - - - 
            if(SRM.ScreenManager.state < 1) {
				
                jQuery('#nav-toggle-list').show();
                jQuery('.top-menu').hide();
                jQuery('.top-menu').addClass('snl');

                jQuery('#nav-toggle').toggle(function() {
                        jQuery('.top-menu').slideDown('fast');
                        jQuery(this).toggleClass('open');
                        return false;
                }, function() {
                        jQuery('.top-menu').slideUp('fast');
                        jQuery(this).toggleClass('open');
                        return false;
                });

            }
            //
            // - - - TABLET & DESKTOP - - - 
            if(SRM.ScreenManager.state > 0) {
				jQuery('#nav-toggle').hide();
                jQuery('.top-menu').show();
				jQuery('.show-mobile').hide();
				jQuery('.hide-mobile').show();
                jQuery('.top-menu').removeClass('snl');

            }

	};

	jQuery(window).resize(function() {
		SRM.ScreenManager.updateState();
	});

	// first run
	jQuery(document).ready(function() {
    	SRM.ScreenManager.updateState();
    });
    
} catch(error) {
	alert(error);
}