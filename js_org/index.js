$(function(){

    var url         = cryptrisSettings.appUrl,
        hrefPath    = url,
        title       = "Cryptris, un jeu gratuit sur la cryptographie asymétrique",
        text        = "Défiez l’ordinateur pour savoir qui arrivera à décrypter le plus rapidement. De nombreux défis cryptologiques vous attendent, êtes-vous prêts ?",
        preview     = cryptrisSettings.appUrl + "/img/cryptis-social-preview-600x600.png";
        preview_xl  = cryptrisSettings.appUrl + "/img/cryptis-social-preview-1200x630.png";

    /** Setup sharing urls **/

    // twitter
    $('#share-tw').attr("href", "https://twitter.com/intent/tweet?text="+title+"&url=" + url);
    $('#share-tw').attr("target", "_blank");

    // google+
    $('#share-gp').attr('data-contenturl', hrefPath);
    $('#share-gp').attr('data-calltoactionurl', url);
    $('#share-gp').attr('data-prefilltext', 'Venez essayer de batte l’ordinateur en jouant à Cryptris.');
          
    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    // facebook
    var fbBase = "https://www.facebook.com/dialog/feed?&app_id=525890597495827&display=popup";
    var fbUrl = fbBase+"&caption=" + title + "&description=" + text + "&link=" + url + "&picture=" + preview_xl + "&redirect_uri="+cryptrisSettings.appUrl+"/thanks.html";
    $('#share-fb').attr('onclick', "javascript:window.open('"+fbUrl+"', '', 'toolbar=0,status=0,width=626,height=436');");


  /**
   *  Share via email
   */
    var timeouts = [],
        clearTimeouts = function () {
          $.each(timeouts, function(i){
            clearTimeout(timeouts[i])
          });

          timeouts = [];
        };  

    $('#share-url').val(cryptrisSettings.appUrl);

    $('#mailto-share-url').attr('href', 'mailto:?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent(text+'\n\n')+cryptrisSettings.appUrl);

  // close modals (the only modal we use is for sharing via email)

  $(".window .btn-close").click(function(){
    $(this).closest('.window').removeClass('visible');
    clearTimeouts();
    timeouts.push(window.setTimeout(function(){
      $('.modal').removeClass('visible');
    }, 200))
  });

  function showModal(){
    $('.modal').addClass('visible');
      
    clearTimeouts();
    timeouts.push(window.setTimeout(function(){
      $('.window').addClass('visible');
    }, 100))
  }

  // setup handlers

  $('#share-em').click(showModal);
  $('#share-url').click(function(){
    this.select()
  });
})
