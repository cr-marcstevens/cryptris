function getQuerystring(key, default_) {
  if (default_==null) default_=""; 
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
}

$(document).ready(function() {

    if (getQuerystring('no-preloader', true) === true) {

        /**
         * Image assets
         */
        var imgs = getPreloadedImages();

        /**
         * Preload our necessarly images and load the splash screens.
         */
        var time = $.now();
        var my_counter = 0, my_error_counter = 0;
        var preloadImages = new CAAT.Module.Preloader.ImagePreloader().loadImages(
            imgs,
            function on_load(counter, images) {
                my_counter = counter;
                if (my_counter+my_error_counter === imgs.length) {
                    // -- Swith from preloader screen to menu screen.
                    $('#preloader-view').attr('style', 'display: none;');
                    $('#menu-view').attr('style', '');
                } else {
                    // -- Update the preloader screen.
                    var width = Math.round( (my_counter+my_error_counter + 1) / imgs.length * 100 ) + '%';
                    $('#preloader-display').text(width) ;
                    $('#preloader-view .bar').css('width', width);
                }
            },
            function on_error(e, index) {
                my_error_counter += 1;
                if (my_counter+my_error_counter === imgs.length) {
                    // -- Swith from preloader screen to menu screen.
                    $('#preloader-view').attr('style', 'display: none;');
                    $('#menu-view').attr('style', '');
                } else {
                    // -- Update the preloader screen.
                    var width = Math.round( (my_counter+my_error_counter + 1) / imgs.length * 100 ) + '%';
                    $('#preloader-display').text(width) ;
                    $('#preloader-view .bar').css('width', width);
                }
            },
        );
    }
});
