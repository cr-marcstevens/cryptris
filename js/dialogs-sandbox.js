$(function(){

  var dialog1 = function(){
    $(".wrapper.active").closeAllDialogs(function(){
      $(".wrapper.active .vertical-centering").dialog({
        
        animateText: true,

        title: "Test de titre de dialogue",
        content: "Test de contenu <strong>html</strong> avec animation du texte.<br><br><strong>Type :</strong> withoutAvatar<br/>Avec deux boutons</p>",
        
        controls: [{
          label: "annuler", 
          class: "button red",
          onClick: function(){
            alert("Bouton Annuler cliqué");
            $(".wrapper.active").closeAllDialogs(function(){alert("closeAllDialogs() terminé ! Recharger la page pour redémarrer les test.")})
          }
        }, 

        {
          label: "suivant", 
          class: "button blue",
          onClick: dialog2
        }]

      });
    });
  }

  var dialog2 = function(){
    $(".wrapper.active").closeAllDialogs(function(){
      $(".wrapper.active .vertical-centering").dialog({
        
        type: "withAvatar",
        avatar: "<img src='img/avatar-chercheuse.jpg'>",
        title: "Un dialogue avec avatar",
        content: "Test de contenu <strong>html</strong> sans animation du texte.<p><strong>Type :</strong> withAvatar<br/>Avec trois boutons</p>",
        
        controls: [{
          label: "Précédent", 
          class: "button",
          onClick: function(){
            $(".wrapper.active").closeAllDialogs(function(){ dialog1() });
          }
        }, 

        {
          label: "annuler", 
          class: "button red",
          onClick: function(){
            alert("Bouton Annuler cliqué");
            $(".wrapper.active").closeAllDialogs(function(){alert("closeAllDialogs() terminé ! Recharger la page pour redémarrer les test.")})            
          }
        }, 

        {
          label: "suivant", 
          class: "button blue",
          onClick: dialog3
        }]

      });
    });
  }  

  var dialog3 = function(){
    $("body").closeAllDialogs(function(){
      $(".wrapper.active .vertical-centering").dialog({
        type: "player",
        content: [
          {
            label: "Première réponse", 
            onClick: function(){
              alert("Première réponse cliquée");
              dialog4();
            }
          }, 
          {
            label: "Deuxième réponse", 
            onClick: function(){
              alert("Deuxième réponse cliquée");
              dialog4();              
            }
          }
        ]
      });
    });
  }

  var dialog4 = function(){
    $("body").closeAllDialogs(function(){
      $(".wrapper.active .vertical-centering").dialog({
        controls: [{
          label: "Recommencer", 
          class: "button blue",
          onClick: dialog1
        }]
      });
    });
  }

  dialog1();
})
