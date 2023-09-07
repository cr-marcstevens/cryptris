/**
 *  Story mode game dialogs,
 *  Most dialogs are set here, please refer to dialog.js for parameters
 */

var youAreIntern = lang.DIALOG_STRING99.replace("TXT_CUSTOM_INSTITUTE",lang.TXT_CUSTOM_INSTITUTE).replace("TXT_CUSTOM_GROUP",lang.TXT_CUSTOM_GROUP);
var firstDay = lang.DIALOG_STRING84;

var labelNext = lang.TXT_NEXT;
var labelPrev = lang.TXT_PREV
var labelOpenMessage = lang.TXT_OPEN_MESSAGE;
var labelDecryptMessage = lang.TXT_DECRYPT_MESSAGE;
var labelCutCable = lang.DIALOG_STRING38;
var labelAie = lang.DIALOG_STRING8;
var labelResume = lang.TXT_RESUME;

var controlNext = {label: labelNext, class: "button blue", onClick: function() { $(document).trigger('nextDialog')}};
var controlOpen = {label: labelOpenMessage, class: "button blue", onClick: function() { $(document).trigger('nextDialog')}};
var controlDecrypt = {label: labelOpenMessage, class: "button blue", onClick: function() { $(document).trigger('nextDialog')}};
var controlPrev = {label: labelPrev, class: "button grey", onClick: function() { $(document).trigger('prevDialog')}};
var controlPass = {label: lang.DIALOG_STRING78, class: "button red", onClick: function() {$(document).trigger('passDialog')}};

function getControl(control, functionCN) {
  var newControl = {label: control['label'], class: control['class']};
  if (functionCN) {
    newControl['onClick'] = functionCN;
  } else {
    newControl['onClick'] = control['onClick'];
  }
  return newControl;
}

var firstPrompt = function(welcome) {
  $.switchWrapper('#prompt', function() {
    // First prompt
    $('.prompt .content').text('');
    setTimeout(function() {
      $('.prompt .content').typeLetterByLetter(youAreIntern, cryptrisSettings.animateTextDelayBetweenLetters, function() {
        // Second prompt
        setTimeout(function() {
          $('.prompt .content').text('');
          setTimeout(function() {
            $('.prompt .content').typeLetterByLetter(firstDay, cryptrisSettings.animateTextDelayBetweenLetters,function() {
              // Switch to institute
              setTimeout(function() { 
                $(document).trigger('nextDialog');
              }, cryptrisSettings.readingDelay);
            });
          }, 2000)
        }, cryptrisSettings.readingDelay);
      });
    }, 2000);
  });
}

function addControlToDialog(dialogName, controls) {
  dialogName['controls'] = controls;
}

function addInteractiveContentToDialog(dialogName, content) {
  dialogName['content'] = content;
}

function updateAccountCreatedDialog() {
  accountCreatedDialog['content'] = lang.TXT_PERFECT + (currentGame.litteralName != "" ? " <em>" + currentGame.litteralName + "</em>" : "" ) + lang.DIALOG_STRING3;
}

function updateCryptoExplanations() {
  cryptoExplanationsDialog['title'] = currentGame.username;
}

function updateKeysExplanations() {
  keysExplanationsDialog['title'] = currentGame.username;
}

function updateWeird() {
    weirdDialog['content'] = (currentGame.litteralName != "" ? " <em>" + currentGame.litteralName + "!</em> " : "") + lang.DIALOG_STRING107;
}

function updateElectricShock() {
  electricShockDialog['title'] = currentGame.username;
}

function updateNameFunction() {
  updateAccountCreatedDialog();
  updateCryptoExplanations();
  updateKeysExplanations();
  updateWeird();
  updateElectricShock();
}

var chercheusePredef = {
  animateText: true,
  type: "withAvatar",
  avatar: "<img src='"+lang.IMG_RESEARCHER+"'>",
  title: lang.TXT_RESEARCHER
};

var pausePredef = {
  type : "player",
  title : lang.TXT_PAUSE
};

var playerPredef = {
  type : "player",
  title : currentGame.username
};

var inriosPredef = {
  animateText: true,
  type: "withAvatar",
  avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",
  title: lang.DIALOG_STRING52
};

var decryptedPredef = {
  animateText: true,
  type: "withAvatar",
  avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",
  title: lang.DIALOG_STRING71
};

var cablesPredef = {
  type: "cables",
  title: lang.DIALOG_STRING89
};

var graphPredef = {
  type: "graph",
  avatar: "<img src='"+lang.IMG_RESEARCHER+"'>",
  title: lang.DIALOG_STRING27
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

/**
 * Game dialogs
 */
 
var gameOverDialog = getDialog(chercheusePredef, lang.DIALOG_STRING51, null, {
        category: lang.TXT_GAME,
        action: "Niveau non précisé",
        label: lang.ARCADE_DIALOG_GAME_OVER,
      });
var tooManyBlocksDialog = getDialog(chercheusePredef, lang.DIALOG_STRING79, null, {
        category: lang.TXT_GAME,
        action: "Niveau non précisé",
        label: lang.ARCADE_DIALOG_TOO_MANY_BLOCKS,
      });

/**
 *  Intro
 */

var welcomeInstituteDialog = getDialog(chercheusePredef, lang.DIALOG_STRING11, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING57,
        label: "Dialogue 'Bienvenue à l'institut' (Chercheuse)",
      });

var accountCreatedDialog = getDialog(chercheusePredef, lang.TXT_PERFECT + (currentGame.litteralName != "" ? " <em>" + currentGame.litteralName + "</em>" : "" ) + lang.DIALOG_STRING3, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING57,
        label: "Dialogue 'Compte utilisateur crée' (Chercheuse)",
      });

var cryptoExplanationsLabel0 = lang.DIALOG_STRING28;
var cryptoExplanationsLabel1 = lang.DIALOG_STRING9;
var cryptoExplanationsLabel2 = lang.DIALOG_STRING88;
var cryptoExplanationsDialog = getDialog(playerPredef, null, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING57,
        label: "Dialogue 'Cryptrographie ? Asymétrique ?' (Joueur)",
      });

var cryptoExplanationsOpt1Dialog = getDialog(chercheusePredef, lang.DIALOG_STRING29, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING57,
        label: "Dialogue 'Définition cryptographie' (Chercheuse)",
      });
var cryptoExplanationsOpt2Dialog = getDialog(chercheusePredef, lang.DIALOG_STRING73, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING57,
        label: "Dialogue 'Explication cryptographie asymétrique' (Chercheuse)",
      });

var goingToCreateKeysDialog = getDialog(chercheusePredef, lang.DIALOG_STRING101, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING54,
        label: "Dialogue 'Tu vas créer ta paire clé privée / publique' (Chercheuse)",
      });

var keysExplanationsLabel0 = lang.DIALOG_STRING25;
var keysExplanationsLabel1 = lang.DIALOG_STRING102;
var keysExplanationsLabel2 = lang.DIALOG_STRING32;
var keysExplanationsDialog = getDialog(playerPredef, null, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING54,
        label: "Dialogue 'Clé privée ? Clé publique ?' (Joueur)",
      });

var keysExplanationsOpt1Dialog = getDialog(chercheusePredef, lang.DIALOG_STRING90, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING54,
        label: "Dialogue 'Explication clé privé' (Chercheuse)",
      });
var keysExplanationsOpt2Dialog = getDialog(chercheusePredef, lang.DIALOG_STRING92, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING54,
        label: "Dialogue 'Explication clé publique' (Chercheuse)",
      });

var hereYourPrivateKeyDialog = getDialog(chercheusePredef, lang.DIALOG_STRING105.replace("KEYUP",lang.KEYUP).replace("KEYDOWN",lang.KEYDOWN).replace("KEYLEFT",lang.KEYLEFT).replace("KEYRIGHT",lang.KEYRIGHT).replace("KEYSPACE",lang.KEYSPACE), null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING54,
        label: "Dialogue 'Voici ta clé privée' (Chercheuse)",
      });

var fallSixTimesDialog = getDialog(chercheusePredef, lang.DIALOG_STRING80, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING54,
        label: "Dialogue 'Faire tomber 6 fois la clé privée' (Chercheuse)",
      });

var helpCreateKeyDialog = getDialog(chercheusePredef, lang.DIALOG_STRING81.replace("KEYUP",lang.KEYUP).replace("KEYDOWN",lang.KEYDOWN).replace("KEYLEFT",lang.KEYLEFT).replace("KEYRIGHT",lang.KEYRIGHT).replace("KEYSPACE",lang.KEYSPACE), null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING54,
        label: "Dialogue 'Aide création de clé publique' (Chercheuse)",
      });

var pauseCreateKeyDialog = getDialog(pausePredef, null, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING54,
        label: lang.TXT_PAUSE,
      });

var keyPreGeneratedErrorText = lang.DIALOG_STRING97;

var keyPreGeneratedSuccessText = lang.DIALOG_STRING49;
var keyPreGeneratedDialog = getDialog(chercheusePredef, keyPreGeneratedSuccessText, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING54,
        label: lang.DIALOG_STRING24,
      });

var wellDoneDialog = getDialog(chercheusePredef, lang.DIALOG_STRING75, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING54,
        label: "Dialogue 'Vérifions que tout fonctionne' (Chercheuse)",
      });

var letsGoToEncryptDialog = getDialog(chercheusePredef, lang.DIALOG_STRING58, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING53,
        label: "Dialogue 'J’utilise ta clé publique pour crypter' (Chercheuse)",
      });

var helpPlayChercheuseDialog = getDialog(chercheusePredef, lang.DIALOG_STRING59, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING53,
        label: "Dialogue 'Aide' (Chercheuse)",
      });

var pausePlayChercheuseDialog = getDialog(pausePredef, null, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING53,
        label: lang.TXT_PAUSE,
      });

/**
 * Tutoriel decryptage
 */

var firstMessageDialog = getDialog(inriosPredef, null, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING56,
        label: "Dialogue 'Message crypté' (InriOS)",
      });

var helpPlaySoloDialog = getDialog(chercheusePredef, lang.DIALOG_STRING91.replace("KEYUP",lang.KEYUP).replace("KEYDOWN",lang.KEYDOWN).replace("KEYLEFT",lang.KEYLEFT).replace("KEYRIGHT",lang.KEYRIGHT).replace("KEYSPACE",lang.KEYSPACE), null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING56,
        label: "Dialogue 'Aide 1/2' (Chercheuse)",
      });

var helpPlaySolo2Dialog = getDialog(chercheusePredef, lang.DIALOG_STRING66, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING56,
        label: "Dialogue 'Aide 2/2' (Chercheuse)",
      });

var pausePlaySoloDialog = getDialog(pausePredef, null, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING56,
        label: lang.TXT_PAUSE,
      });

var messageTestDialog = getDialog(chercheusePredef, lang.DIALOG_STRING104.replace("KEYUP",lang.KEYUP).replace("KEYDOWN",lang.KEYDOWN).replace("KEYLEFT",lang.KEYLEFT).replace("KEYRIGHT",lang.KEYRIGHT).replace("KEYSPACE",lang.KEYSPACE), null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING56,
        label: "Dialogue 'Explication decryptage 1/2' (Chercheuse)",
      });

var tutorialDialog = getDialog(chercheusePredef, lang.DIALOG_STRING67.replace("KEYUP",lang.KEYUP).replace("KEYDOWN",lang.KEYDOWN).replace("KEYLEFT",lang.KEYLEFT).replace("KEYRIGHT",lang.KEYRIGHT).replace("KEYSPACE",lang.KEYSPACE), null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING56,
        label: "Dialogue 'Explication decryptage 2/2' (Chercheuse)",
      });

var decryptedMessage0DialogText = lang.DIALOG_STRING72;

var randLetter,
  o,
  t = decryptedMessage0DialogText;
                
  // we need to do it once more;
  t = $('<div></div>').html(t).text();

  for (var i = 0; i < t.length; i++) {
    randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
    o += "<span class='letter-block crypted'>" + randLetter + "</span>";
  }

var decryptedMessage0TCallback = {
  in: function() {
    // alert("Dialog was added to the dom");
  },
  show: function() {
    // alert("Dialog intro animation is complete");
    $.simulateDecrypt($(".dialog .content .text"), decryptedMessage0DialogText, 2);
  },
  out: function() {
    // alert("Dialog outro animation is complete, html element will be removed now.");
  }
};

var decryptedMessage0Dialog = getDialog(decryptedPredef, o, decryptedMessage0TCallback, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING56,
        label: "Dialogue 'Affichage du message décrypté' (InriOS)",
      });

var congratulationsOnCompletingTutorialDialog = getDialog(chercheusePredef, lang.DIALOG_STRING76, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING56,
        label: "Dialogue 'Félicitations, fin du tutoriel' (Chercheuse)",
      });

/**
 * Déroulage de l'intrigue
 */

var aProblemOccursDialog = getDialog(chercheusePredef, lang.DIALOG_STRING13, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING55,
        label: "Dialogue 'Le serveur signale une panne' (Chercheuse)",
      });

var weirdDialog = getDialog(chercheusePredef, (currentGame.litteralName != "" ? " <em>" + currentGame.litteralName + ",</em> e" : "E") + lang.DIALOG_STRING107, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING55,
        label: "Dialogue 'Essaie de débrancher le câble 42' (Chercheuse)",
      });

var cables0Dialog = getDialog(cablesPredef, null, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING55,
        label: lang.DIALOG_STRING47,
      });

var electricShockDialog = getDialog(playerPredef, null, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING55,
        label: "Dialogue 'Je viens de me prendre une décharge éléctrique' (Joueur)",
      });

var thisAintNormalDialog = getDialog(chercheusePredef, lang.DIALOG_STRING10, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING55,
        label: "Dialogue 'Ce n’est pas normal' (Chercheuse)",
      });

var useCryptoProtocolDialog = getDialog(chercheusePredef, lang.DIALOG_STRING31, null, {
        category: lang.TXT_GAME,
        action: lang.DIALOG_STRING55,
        label: "Dialogue 'Utilisons le protocole de cryptage' (Chercheuse)",
      });


/**
 * Level 1
 */

var sendingFirstCableDialog = getDialog(chercheusePredef, lang.DIALOG_STRING62, null, {
        category: lang.TXT_GAME,
        action: "Niveau 1",
        label: "Dialogue 'Envoi du message crypté' (Chercheuse)",
      });

var firstBattleMessageDialog = getDialog(inriosPredef, null, null, {
        category: lang.TXT_GAME,
        action: "Niveau 1",
        label: "Dialogue 'Message crypté' (InriOS)",
      });

var helpPlayMinDialog = getDialog(chercheusePredef, lang.DIALOG_STRING91.replace("KEYUP",lang.KEYUP).replace("KEYDOWN",lang.KEYDOWN).replace("KEYLEFT",lang.KEYLEFT).replace("KEYRIGHT",lang.KEYRIGHT).replace("KEYSPACE",lang.KEYSPACE), null, {
        category: lang.TXT_GAME,
        action: "Niveau 1",
        label: "Dialogue 'Aide (1/2)' (Chercheuse)",
      });

var helpPlayMin2Dialog = getDialog(chercheusePredef, lang.DIALOG_STRING66, null, {
        category: lang.TXT_GAME,
        action: "Niveau 1",
        label: "Dialogue 'Aide (2/2)' (Chercheuse)",
      });

var pausePlayMinDialog = getDialog(pausePredef, null, null, {
        category: lang.TXT_GAME,
        action: "Niveau 1",
        label: lang.TXT_PAUSE,
      });

var serverAlsoTryingToBreakEncryptionDialog = getDialog(chercheusePredef, lang.DIALOG_STRING106, null, {
        category: lang.TXT_GAME,
        action: "Niveau 1",
        label: "Dialogue 'Le serveur essaie de décrypter le message !' (Chercheuse)",
      });


var decryptedMessage1DialogText = lang.DIALOG_STRING35;
randLetter = null;
o = "";
t = decryptedMessage1DialogText;
                
// we need to do it once more;
t = $('<div></div>').html(t).text();

for (var i = 0; i < t.length; i++) {
  randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
  o += "<span class='letter-block crypted'>" + randLetter + "</span>";
}

var decryptedMessage1TCallback = {
  in: function() {
    // alert("Dialog was added to the dom");
  },
  show: function() {
    // alert("Dialog intro animation is complete");
    $.simulateDecrypt($(".dialog .content .text"), decryptedMessage1DialogText, 2, 19);
  },
  out: function() {
    // alert("Dialog outro animation is complete, html element will be removed now.");
  }
};

var decryptedMessage1Dialog = getDialog(decryptedPredef, o, decryptedMessage1TCallback, {
        category: lang.TXT_GAME,
        action: "Niveau 1",
        label: "Dialogue 'Message décrypté' (InriOS)",
      });

var cables1Dialog = getDialog(cablesPredef, null, null, {
        category: lang.TXT_GAME,
        action: "Niveau 1",
        label: lang.DIALOG_STRING47,
      });

var successCables1Dialog = getDialog(chercheusePredef, lang.DIALOG_STRING12, null, {
        category: lang.TXT_GAME,
        action: "Niveau 1",
        label: "Dialogue 'Câble débranché' (Chercheuse)",
      });

/**
 *  Level 2
 */

var serverIsFasterDialog = getDialog(chercheusePredef, lang.DIALOG_STRING68, null, {
        category: lang.TXT_GAME,
        action: "Niveau 2",
        label: "Dialogue 'Le serveur est plus rapide' (Chercheuse)",
      });

var sendingSecondCableDialog = getDialog(chercheusePredef, lang.DIALOG_STRING61, null, {
        category: lang.TXT_GAME,
        action: "Niveau 2",
        label: "Dialogue 'Envoi du message crypté' (Chercheuse)",
      });

var secondBattleMessageDialog = getDialog(inriosPredef, null, null, {
        category: lang.TXT_GAME,
        action: "Niveau 2",
        label: "Dialogue 'Message crypté' (InriOS)",
      });

var helpPlayMediumDialog = getDialog(chercheusePredef, lang.DIALOG_STRING91.replace("KEYUP",lang.KEYUP).replace("KEYDOWN",lang.KEYDOWN).replace("KEYLEFT",lang.KEYLEFT).replace("KEYRIGHT",lang.KEYRIGHT).replace("KEYSPACE",lang.KEYSPACE), null, {
        category: lang.TXT_GAME,
        action: "Niveau 2",
        label: "Dialogue 'Aide (1/2)' (Chercheuse)",
      });

var helpPlayMedium2Dialog = getDialog(chercheusePredef, lang.DIALOG_STRING66, null, {
        category: lang.TXT_GAME,
        action: "Niveau 2",
        label: "Dialogue 'Aide (2/2)' (Chercheuse)",
      });

var pausePlayMediumDialog = getDialog(pausePredef, null, null, {
        category: lang.TXT_GAME,
        action: "Niveau 2",
        label: lang.TXT_PAUSE,
      });


var decryptedMessage2DialogText = lang.DIALOG_STRING37;
randLetter = null;
o = "";
t = decryptedMessage2DialogText;
                
// we need to do it once more;
t = $('<div></div>').html(t).text();

for (var i = 0; i < t.length; i++) {
  randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
  o += "<span class='letter-block crypted'>" + randLetter + "</span>";
}

var decryptedMessage2TCallback = {
  in: function() {
    // alert("Dialog was added to the dom");
  },
  show: function() {
    // alert("Dialog intro animation is complete");
    $.simulateDecrypt($(".dialog .content .text"), decryptedMessage2DialogText, 2, 19);
  },
  out: function() {
    // alert("Dialog outro animation is complete, html element will be removed now.");
  }
};

var decryptedMessage2Dialog = getDialog(decryptedPredef, o, decryptedMessage2TCallback, {
        category: lang.TXT_GAME,
        action: "Niveau 2",
        label: "Dialogue 'Message décrypté' (InriOS)",
      });

var cables2Dialog = getDialog(cablesPredef, null, null, {
        category: lang.TXT_GAME,
        action: "Niveau 2",
        label: lang.DIALOG_STRING47,
      });

var successCables2Dialog = getDialog(chercheusePredef, lang.DIALOG_STRING98, null, {
        category: lang.TXT_GAME,
        action: "Niveau 2",
        label: "Dialogue 'Câble débranché' (Chercheuse)",
      });

/**
 * Level 3
 */

var serverIsInfectingOtherMachinesDialog = getDialog(chercheusePredef, lang.DIALOG_STRING14, null, {
        category: lang.TXT_GAME,
        action: "Niveau 3",
        label: "Dialogue 'Le serveur infecte d’autres machines' (Chercheuse)",
      });

var sendingThirdCableDialog = getDialog(chercheusePredef, lang.DIALOG_STRING60, null, {
        category: lang.TXT_GAME,
        action: "Niveau 3",
        label: "Dialogue 'Envoi du message crypté' (Chercheuse)",
      });

var thirdBattleMessageDialog = getDialog(inriosPredef, null, null, {
        category: lang.TXT_GAME,
        action: "Niveau 3",
        label: "Dialogue 'Message crypté' (InriOS)",
      });

var helpPlayMaxDialog = getDialog(chercheusePredef, lang.DIALOG_STRING91.replace("KEYUP",lang.KEYUP).replace("KEYDOWN",lang.KEYDOWN).replace("KEYLEFT",lang.KEYLEFT).replace("KEYRIGHT",lang.KEYRIGHT).replace("KEYSPACE",lang.KEYSPACE), null, {
        category: lang.TXT_GAME,
        action: "Niveau 3",
        label: "Dialogue 'Aide (1/2)' (Chercheuse)",
      });

var helpPlayMax2Dialog = getDialog(chercheusePredef, lang.DIALOG_STRING66, null, {
        category: lang.TXT_GAME,
        action: "Niveau 3",
        label: "Dialogue 'Aide (2/2)' (Chercheuse)",
      });

var pausePlayMaxDialog = getDialog(pausePredef, null, null, {
        category: lang.TXT_GAME,
        action: "Niveau 3",
        label: lang.TXT_PAUSE,
      });

var decryptedMessage3DialogText = lang.DIALOG_STRING36;
randLetter = null;
o = "";
t = decryptedMessage3DialogText;
                
// we need to do it once more;
t = $('<div></div>').html(t).text();

for (var i = 0; i < t.length; i++) {
  randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
  o += "<span class='letter-block crypted'>" + randLetter + "</span>";
}

var decryptedMessage3TCallback = {
  in: function() {
    // alert("Dialog was added to the dom");
  },
  show: function() {
    // alert("Dialog intro animation is complete");
    $.simulateDecrypt($(".dialog .content .text"), decryptedMessage3DialogText, 2, 19);
  },
  out: function() {
    // alert("Dialog outro animation is complete, html element will be removed now.");
  }
};

var decryptedMessage3Dialog = getDialog(decryptedPredef, o, decryptedMessage3TCallback, {
        category: lang.TXT_GAME,
        action: "Niveau 3",
        label: "Dialogue 'Message décrypté' (InriOS)",
      });

var cables3Dialog = getDialog(cablesPredef, null, null, {
        category: lang.TXT_GAME,
        action: "Niveau 3",
        label: lang.DIALOG_STRING47,
      });

var successCables3Dialog = getDialog(chercheusePredef, lang.DIALOG_STRING69, null, {
        category: lang.TXT_GAME,
        action: "Niveau 3",
        label: "Dialogue 'Câble débranché' (Chercheuse)",
      });


/**
 *  Outro
 */

var IWasTrappedDialog = getDialog(chercheusePredef, lang.DIALOG_STRING65, null, {
        category: lang.TXT_GAME,
        action: "Outro",
        label: "Dialogue 'J’ai failli rester enfermée' (Chercheuse)",
      });

var thanksToCryptoDialog = getDialog(chercheusePredef, lang.DIALOG_STRING50, null, {
        category: lang.TXT_GAME,
        action: "Outro",
        label: "Dialogue 'Grâce à la cryptographie asymétrique' (Chercheuse)",
      });

var thanksToCrypto2Dialog = getDialog(chercheusePredef, lang.DIALOG_STRING48, null, {
        category: lang.TXT_GAME,
        action: "Outro",
        label: "Dialogue 'Difficulté exponentielle pour l’ordinateur' (Chercheuse)",
      });

var comparePlayTimeChartDialog = getDialog(graphPredef, "Blah Blah", null, {
        category: lang.TXT_GAME,
        action: "Outro",
        label: lang.DIALOG_STRING26,
      });
