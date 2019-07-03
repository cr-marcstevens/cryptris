var animateTextDelayBetweenLetters = 20;
var readingDelay = 4000;

var labelNext = lang.TXT_NEXT;
var labelPrev = lang.TXT_PREV
var labelOpenMessage = lang.TXT_OPEN_MESSAGE;
var labelDecryptMessage = lang.TXT_DECRYPT_MESSAGE;

function addControlToDialog(dialogName, controls) {
  dialogName['controls'] = controls;
}

function updateNameFunction() {
}

var chercheusePredef = {
  animateText: true,
  animateTextDelayBetweenLetters: animateTextDelayBetweenLetters,
  type: "withAvatar",
  avatar: "<img src='img/avatar-chercheuse.jpg'>",
  title: lang.TXT_RESEARCHER
};

function getDialog(predef, content, transitionCallback, identifier) {
  var newDialog = {};

  for (var key in predef) {
    newDialog[key] = predef[key];
  }
  newDialog['content'] = content;

  if (transitionCallback) {
    newDialog['transitionCallback'] = transitionCallback;
  } else {
    newDialog['transitionCallback'] = {
      in: function() {
        // alert("Dialog was added to the dom");
      },
      show: function() {
        // alert("Dialog intro animation is complete");
      },
      out: function() {
        // alert("Dialog outro animation is complete, html element will be removed now.");
      }
    };
  }

  if(identifier){
    newDialog['identifier'] = identifier;
  }
  
  return newDialog;
}
var gameOverDialog = getDialog(chercheusePredef, lang.ARCADE_DIALOG_GAME_OVER, null, {
  category: "Arcade",
  action: "Niveau non précisé",
  label: lang.ARCADE_DIALOG_GAME_OVER_TITLE,
});

var tooManyBlocksDialog = getDialog(chercheusePredef, lang.ARCADE_DIALOG_TOO_MANY_BLOCKS, null, {
  category: "Arcade",
  action: "Niveau non précisé",
  label: lang.ARCADE_DIALOG_TOO_MANY_BLOCKS_TITLE,
});

var announcePublicKeyDialog = getDialog(chercheusePredef, lang.ARCADE_DIALOG_ANNOUNCE_PUBLICKEY, null, {
  category: "Jeu",
  action: "Création clé publique",
  label: lang.ARCADE_DIALOG_ANNOUNCE_PUBLICKEY_TITLE,
});

var hereYourPrivateKeyDialog = getDialog(chercheusePredef, lang.ARCADE_DIALOG_HERE_PRIVATEKEY, null,  {
  category: "Arcade",
  action: "Création clé publique",
  label: lang.ARCADE_DIALOG_HERE_PRIVATEKEY_TITLE,
});

var fallSixTimesDialog = getDialog(chercheusePredef, lang.ARCADE_DIALOG_CREATE_PUBLICKEY, null, {
  category: "Arcade",
  action: "Création clé publique",
  label: "Dialogue 'Faire tomber 6 fois la clé privée' (Chercheuse)",
});

var keyPregeneratedDialog = getDialog(chercheusePredef, lang.ARCADE_DIALOG_SUCCESS, null, {
  category: "Arcade",
  action: "Intro - Création clé publique",
  label: "Clé créée avec succès",
});
