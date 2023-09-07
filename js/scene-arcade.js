
$(function(){

  function specialOutInterpolator() {
    this.getPosition = function(time) {
      return {'x' : time, 'y' : 0};
    }
  }

  function specialInInterpolator() {
    this.getPosition = function(time) {
      return {'x' : time, 'y' : 1};
    }
  }

  var game = cryptrisSettings;
  var transitionTime = 1000;

  // hide .hidden elements and remove class
  $('.hidden').hide().removeClass('hidden');

  function getName(level, isCK) {

    // Fix: Don't ask for a custom name in Arcade mode, just go with a general player name
    currentGame.username = lang.TXT_PLAYER;
    updateNameFunction();

    // Fix: We show the helpdialogs (only once) at the start of any level, which replaces the one-time firstDialog before the level.
    // isCK ? level() : firstDialog(level);
    level();

    // Fix: return here instead of creating a get username dialog
    return false;

    //console.log('Arcade - Renseignement du nom - Invite de commande');

    $("body").closeAllDialogs( function(){
      $.switchWrapper('#new-login', function(){
        $('#login-name').focus();
        $('.new-login').submit(function(e){
          
          currentGame.litteralName = $('#login-name').val().escape();
          currentGame.username = currentGame.litteralName !== "" ? currentGame.litteralName : lang.TXT_PLAYER;
          updateNameFunction();

          //console.log('Arcade - Renseignement du nom - Nom choisi : ' + currentGame.username);

          isCK ? level() : firstDialog(level);
          $('#login-name').blur();
          $('.new-login').unbind('submit').submit(function(e){
            return false;
          });
          return false;
        });
      });
    });
  }


  var key_symbol_save = null;
  var keychain_save = null;
  function announcePublicKey(){

    // Save the key and keychain img.
    key_symbol_save = playerBoardColorInfo['key-symbol'];
    keychain_save = playerBoardColorInfo['keychain'];

    playerBoardColorInfo['key-symbol'] = 'icn-mini-player-key-symbol';
    playerBoardColorInfo['keychain'] = 'keychain-player';

    // -- Change the behavior when we have a 'resolved message' on create key screen.
    currentGame.stopCreateKeyAfterResolve = false;

    // -- switch to waiting scene.
    currentGame.director.easeInOut(
                                    currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                    CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    0,
                                    true,
                                    new specialInInterpolator(),
                                    new specialOutInterpolator()
    );
    prepareCreateKeyScene(currentGame.director);

    $("body").closeAllDialogs(function(){
      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog(announcePublicKeyDialog);   
            
      });

    });

  }

  function hereYourPrivateKey() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        // Set the createKeyScene as the current scene.
        currentGame.director.easeInOut(
                                        currentGame.director.getSceneIndex(currentGame.scenes.create_key_scene.scene),
                                        CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                        currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                        CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                        CAAT.Foundation.Actor.ANCHOR_CENTER,
                                        transitionTime, true,
                                        new specialInInterpolator(),
                                        new specialOutInterpolator()
        );
        currentGame.scenes['create_key_scene'].add_key_symbol(currentGame.director, currentGame.scenes['create_key_scene']);

        $(".wrapper.active .vertical-centering").dialog(hereYourPrivateKeyDialog);
      });
    });
  }

  function fallSixTimes() {
    $("body").closeAllDialogs(function(){
      $.switchWrapper('#bg-circuits', function(){
        $(".wrapper.active .vertical-centering").dialog(fallSixTimesDialog);
      });
    });
  }

  function activateHelp(dataScene, hookName, helpFunction) {
    if (dataScene.scene.isPaused() === false) {
      dataScene.scene.setPaused(true);
      dataScene.needStopPaused = true;
    } else {
      dataScene.needStopPaused = false;
    }
    currentGame[hookName] = false;


    var helpInfo = {
      'sceneName' : dataScene,
      'hookName' : hookName
    };
    helpFunction(helpInfo);
  }

  function deActivateHelp(dataScene, hookName) {
    $("body").closeAllDialogs(function() {});

    // Relaunch the board if necessary.
    if (dataScene.needStopPaused === true) {
      dataScene.scene.setPaused(false);
    }
    dataScene.needStopPaused = null;
    currentGame[hookName] = true;
  }


  function activatePause(dataScene, hookName, pauseFunction) {
    if (dataScene.scene.isPaused() === false) {
      dataScene.scene.setPaused(true);
      dataScene.needStopPaused = true;
    } else {
      dataScene.needStopPaused = false;
    }
    currentGame[hookName] = false;


    var pauseInfo = {
      'sceneName' : dataScene,
      'hookName' : hookName
    };
    pauseFunction(pauseInfo);
  }

  function deActivatePause(dataScene, hookName) {
    $("body").closeAllDialogs(function() {});

    // Relaunch the board if necessary.
    if (dataScene.needStopPaused === true) {
      dataScene.scene.setPaused(false);
    }
    dataScene.needStopPaused = null;
    currentGame[hookName] = true;
  }


  $(document).on("helpCreateKeyEvent", function() {
    activateHelp(currentGame.scenes.create_key_scene, "createKeySceneActive", helpCreateKey);
  });

  $(document).on("pauseCreateKeyEvent", function() {
    activateHelp(currentGame.scenes.create_key_scene, "createKeySceneActive", pauseCreateKey);
  });

  function helpCreateKey() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        $(".wrapper.active .vertical-centering").dialog({
          
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='"+lang.IMG_RESEARCHER+"'>",

          identifier: {
            category: lang.MENU_ARCADE,
            action: lang.DIALOG_STRING30,
            label: "Dialogue 'Aide création de clé publique' (Chercheuse)",
          },

          title: lang.TXT_RESEARCHER,
          content: lang.DIALOG_STRING82.replace("KEYUP",lang.KEYUP).replace("KEYDOWN",lang.KEYDOWN).replace("KEYLEFT",lang.KEYLEFT).replace("KEYRIGHT",lang.KEYRIGHT).replace("KEYSPACE",lang.KEYSPACE),
          controls: [{
            label: lang.TXT_NEXT, 
            class: "button blue",
            onClick: function() {
              deActivateHelp(currentGame.scenes.create_key_scene, "createKeySceneActive");
            }
          }]

        });
  

      });

    });
  }

  function pauseCreateKey() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        $(".wrapper.active .vertical-centering").dialog({
          type: "player",
          title: lang.TXT_PAUSE,
          identifier: {
            category: lang.MENU_ARCADE,
            action: lang.DIALOG_STRING30,
            label: lang.TXT_PAUSE,
          },
          content: [
            {
            label: lang.TXT_RESUME, 
            class: "not-asked",
            onClick: function() {
              deActivatePause(currentGame.scenes.create_key_scene, "createKeySceneActive");
            }},
            {
              label: lang.TXT_ARCADEMENU,
              class: "not-asked",
              onClick: function() {
                menu();
                setTimeout(currentGame.scenes.create_key_scene.scene.setPaused(false), 1500);
              }
            },
            {
              label: lang.TXT_MAINMENU,
              class: "not-asked",
              onClick: function() {
                window.location.href = lang.INDEX_HTMLFILE
              }
            }]

        });
  

      });

    });
  }

  function switchToCreateKey() {
    // Start the increase of time.
    $(document).trigger('startTime', currentGame.scenes.create_key_scene.scene);


    $("body").closeAllDialogs();
    // Enable the action on the key.
    currentGame.createKeySceneActive = true;

    var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        if (currentGame.scenes.create_key_scene.game_box.crypt_key.numberApplied >= currentGame.maxNewKeyMove && currentGame.scenes.create_key_scene.game_box.message.isBlank() === false) {
          waitToContinue.cancel();
          currentGame.createKeySceneActive = false;
          keyPreGenerated();
        }
      }
    );
  }


  function keyPreGenerated() {
    $("body").closeAllDialogs(function() {
      $.switchWrapper('#bg-circuits', function() {
        $(".wrapper.active .vertical-centering").dialog(keyPregeneratedDialog);
      });
    });
  }

  function switchToFinishCreateKey() {
    $("body").closeAllDialogs();
    // Launch the ia.

    currentGame.scenes.create_key_scene.game_box.boxOption.timeInfo = createKeyIASceneTime;
    ia_create_pk(currentGame.scenes.create_key_scene.scene, currentGame.scenes.create_key_scene.game_box);

    var keyScore = score(currentGame.scenes.create_key_scene.game_box.message.getNumbers());
    //console.log('Arcade - Création clé publique - Score de la clé : ' + keyScore);
    
    var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        if (currentGame.goToNextDialog === true) {
          waitToContinue.cancel();
          currentGame.goToNextDialog = false;
          currentGame.createKeySceneActive = false;

          // Disable the action on the key.
          setTimeout(function() {

            currentGame.director.easeInOut(
              currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene),
              CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
              currentGame.director.getSceneIndex(currentGame.scenes.create_key_scene.scene),
              CAAT.Foundation.Scene.prototype.EASE_SCALE,
              CAAT.Foundation.Actor.ANCHOR_CENTER,
              transitionTime,
              true,
              new specialInInterpolator(),
              new specialOutInterpolator()
            );
            endCreateKey();            
            $(document).trigger('freezeTime', {'scene' : currentGame.scenes.create_key_scene.scene, 'timeLabel' : 'createKeySceneActiveTime'});

            currentGame.dontShowKey = false;
          }, 2000);
        }
      }
    );
  }

  function endCreateKey(){
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        playerBoardColorInfo['key-symbol'] = key_symbol_save;
        playerBoardColorInfo['keychain'] = keychain_save;
        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='"+lang.IMG_RESEARCHER+"'>",

          title: lang.TXT_RESEARCHER,
          content: lang.DIALOG_STRING74,
          identifier: {
            category: lang.MENU_ARCADE,
            action: lang.DIALOG_STRING30,
            label: "Dialogue 'J'ai bien ta clé publique' (Chercheuse)",
          },
          controls: [{
            label: lang.TXT_ARCADEMENU,
            class: "button red",
            onClick: menu
          },
          {
            label: lang.TXT_NEXT, 
            class: "button blue",
            onClick: challenge1
          }]

        });

      });

    });

  }

  $.goToBattleScene = goToBattleScene;
  var currentGameOverData = null;

  function stopGameOverDialog() {
    //console.log(currentGameOverData);
    var saveScene = currentGame.scenes[currentGameOverData.sceneName].scene;
    goToBattleScene(currentGameOverData.sceneName, currentGameOverData.onDecrypt, currentGameOverData.sizeBoard, currentGameOverData.hookName, currentGameOverData.withIaBoard, currentGameOverData.timeInfo, currentGameOverData.message, currentGameOverData.helpEvent, currentGameOverData.pauseEvent, currentGameOverData.timeout);
    saveScene.setExpired(true);
    $("body").closeAllDialogs(function() {});
    currentGame.scenes[currentGameOverData.sceneName].scene.setPaused(false);
    $(document).trigger('startTime', currentGame.scenes[currentGameOverData.sceneName].scene);
    currentGame.scenes[currentGameOverData.sceneName].add_key_symbol(currentGame.director, currentGame.scenes[currentGameOverData.sceneName]);
    currentGame[currentGameOverData.hookName] = true;
    currentGame.iaPlay = true;
  }

  function gameOverDialog() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        var content = lang.DIALOG_STRING51;
        if (currentGame.playerKeyType === 'public' || currentGame.iaKeyType === 'private') {
          content = lang.DIALOG_STRING100;
        }
        $(".wrapper.active .vertical-centering").dialog({

          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          identifier: {
            category: lang.MENU_ARCADE,
            action: "Niveau non précisé",
            label: lang.ARCADE_DIALOG_GAME_OVER,
          },

          type: "withAvatar",
          avatar: "<img src='"+lang.IMG_RESEARCHER+"'>",

          title: lang.TXT_RESEARCHER,
          content: content,
          controls: [{
            label: lang.TXT_RESTART, 
            class: "button blue",
            onClick: stopGameOverDialog
          },
          {
            label: lang.DIALOG_STRING7,
            class: "button red",
            onClick: menu
          }]

        });

      });

    });
  }


  function tooManyBlocksDialog() {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){
        $(".wrapper.active .vertical-centering").dialog({

          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='"+lang.IMG_RESEARCHER+"'>",
          identifier: {
            category: lang.MENU_ARCADE,
            action: "Niveau non précisé",
            label: lang.ARCADE_DIALOG_TOO_MANY_BLOCKS,
          },
          title: lang.TXT_RESEARCHER,
          content: lang.DIALOG_STRING79,
          controls: [{
            label: lang.TXT_NEXT, 
            class: "button blue",
            onClick: stopGameOverDialog
          },
          {
            label: lang.DIALOG_STRING7,
            class: "button red",
            onClick: menu
          }]

        });

      });

    });
  }

  /**
   *  Convert seconds to Hh:Mm:Ss string
   */


  function formatSeconds(d) {
    var sign = (d<0 ? "-" : "");
    d = Math.abs(d);
    var sec_num = parseInt(d, 10); // don't forget the second parm
    var days   =  Math.floor(sec_num / 86400);
    var hours   = Math.floor((sec_num - (days * 86400)) / 3600);
    var minutes = Math.floor((sec_num - (days * 86400 + hours * 3600)) / 60);
    var seconds = sec_num - (days * 86400 + hours * 3600) - (minutes * 60);

    if (hours   < 10) { hours   = "0"+hours; }
    if (minutes < 10) { minutes = "0"+minutes; }
    if (seconds < 10) { seconds = "0"+seconds; }


    var time    = sign + (days>0 ? days+lang.TXT_DAYS+' ' : '' ) + (days>10 ? '' : (hours == "00" ? "": hours)+(days>0 ? (hours == "00" ? "": lang.TXT_HOURS+' ') : (hours == "00" ? "": lang.TXT_HOURS+' ')+minutes+lang.TXT_MINUTES+' '+seconds+ lang.TXT_SECONDS));
    return ( d == 0 ? '0' : time);
  }

  var informationBoardIsResolved = null;
  function goToBattleScene(sceneName, onDecrypt, sizeBoard, hookName, withIaBoard, timeInfo, message, helpEvent, pauseEvent, timeout) {

    // Prepare the sceneName and set it as the current scene.
    preparePlayScene(currentGame.director, sizeBoard, sceneName, message, hookName, withIaBoard, helpEvent, pauseEvent);
    currentGame.iaPlay = false;
    currentGame[hookName] = false;
    currentGame.gameOver = false;
    currentGame.tooManyBlocksInAColumn = false;

    currentGame.director.currentScene.setPaused(false);
    currentGame.director.easeInOut(currentGame.director.getSceneIndex(currentGame.scenes[sceneName].scene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                   currentGame.director.getSceneIndex(currentGame.director.currentScene), CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER, transitionTime, true,
                                   new specialInInterpolator(), new specialOutInterpolator());
        
    setTimeout(function() {currentGame.scenes[sceneName].add_key_symbol(currentGame.director, currentGame.scenes[sceneName])}, 500);

    // set the speed of this scene.
    timeInfo && withIaBoard ? currentGame.scenes[sceneName].rival_box.boxOption.timeInfo = timeInfo : null;

    // Create a timer to catch the moment we have to go to the next scene.
    var waitToContinue = currentGame.director.createTimer(currentGame.director.time, Number.MAX_VALUE, null,
      function(time, ttime, timerTask) {
        if ((currentGame.goToNextDialog === true && currentGame.scenes[sceneName].info_column.gameIsInProgress === false) || currentGame.validateCurrentBoard === true) {
          waitToContinue.cancel();

          if (currentGame.validateCurrentBoard === true) {
            currentGame.validateCurrentBoard = false;
            $(document).trigger('freezeTime', {'scene' : currentGame.scenes[sceneName].scene, 'timeLabel' : hookName + 'Time'});
          }

          if (informationBoardIsResolved !== null) {
            //console.log(informationBoardIsResolved.category + ' - ' + informationBoardIsResolved.action + ' - ' + lang.DIALOG_STRING64 + formatSeconds(currentGame[informationBoardIsResolved.timeLabel]));
            informationBoardIsResolved = null;
          }

          currentGame.goToNextDialog = false;
          currentGame[hookName] = false;
          timeout ? setTimeout(onDecrypt, timeout) : onDecrypt();
        }
        
        if ((currentGame.gameOver === true || currentGame.tooManyBlocksInAColumn === true) && currentGame.director.currentScene === currentGame.scenes[sceneName].scene) {
          waitToContinue.cancel();
          //console.log('gameOver : ' + sceneName);
          currentGame.scenes[sceneName].scene.setPaused(true);
          currentGame[hookName] = false;

          currentGameOverData = {
            'sceneName' : sceneName,
            'onDecrypt' : onDecrypt,
            'sizeBoard' : sizeBoard,
            'hookName' : hookName,
            'withIaBoard' : withIaBoard,
            'timeInfo' : timeInfo,
            'message' : message,
            'helpEvent' : helpEvent,
            'pauseEvent' : pauseEvent,
            'timeout' : timeout
          };
          if (currentGame.gameOver === true) {
            gameOverDialog();
          } else if (currentGame.tooManyBlocksInAColumn === true) {
            tooManyBlocksDialog();
          }
          currentGame.gameOver = false;
          currentGame.tooManyBlocksInAColumn = false;
        }
      }
    );
  }

  function challenge1(){
    currentGame.director.easeInOut(
                                    currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                    CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    500,
                                    true,
                                    new specialInInterpolator(),
                                    new specialOutInterpolator()
    );
    $("body").closeAllDialogs(function(){

      // Prepare the first battle message
      var before = $.now();
      currentGame.play_min_scene_msg = createMessageForPlayScene(MIN_BOARD_LENGTH, FIRST_CHALLENGE_MESSAGE);
      var after = $.now();

      setTimeout(function() {

        $.switchWrapper('#bg-circuits', function(){

          // Display the battle scene in background.
          goToBattleScene('play_min_scene', dialogDecryptedMessage1, MIN_BOARD_LENGTH, 'playMinSceneActive', true, false, currentGame.play_min_scene_msg, 'playMinHelpEvent', 'playMinPauseEvent');
        
          setTimeout(function() {
            $(".wrapper.active .vertical-centering").dialog({
                
              animateText: true,
              animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

              type: "withAvatar",
              avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

              identifier: {
                category: lang.MENU_ARCADE,
                action: lang.DIALOG_STRING18,
                label: "Dialogue 'Message crypté' (InriOS)",
              },

              title: lang.DIALOG_STRING52,
              content: (function(){
                var t = board_message_to_string(currentGame.play_min_scene_msg.plain_message),
                    a = t.split(' '),
                    o = '';

                    for (var i = 0; i<a.length; i++) {
                        if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
                    }

                    return o;
              }()),
                
              controls: [{
                label: lang.TXT_DECRYPT_MESSAGE, 
                class: "button blue",
                onClick: playLevel1
              }]

            });
          }, 500);
        });
      }, 100 + (after - before));

    });

  }

  function helpDialog1(helpInfo){


    /*
     * To use analytics here, adapt below
     */

    var identifier = null;
    if (helpInfo.sceneName === currentGame.scenes.play_min_scene) {
      // We are in the 8 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge facile (8 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 1/3"
      };
    } else if (helpInfo.sceneName === currentGame.scenes.play_medium_scene) {
      // We are in the 10 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge novice (10 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 1/3"
      };
    } else if (helpInfo.sceneName === currentGame.scenes.play_max_scene) {
      // We are in the 12 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge apprenti (12 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 1/3"
      };
    } else if (helpInfo.sceneName === currentGame.scenes.play_super_max_scene) {
      // We are in the 14 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge chercheur (14 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 1/3"
      };
    } else if (helpInfo.sceneName === currentGame.scenes.play_mega_max_scene) {
      // We are in the 16 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge expert (16 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 1/3'"
      };
    }

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='"+lang.IMG_RESEARCHER+"'>",


          identifier: identifier,

          title: lang.TXT_RESEARCHER,
          content: lang.DIALOG_STRING22.replace("KEYUP",lang.KEYUP).replace("KEYDOWN",lang.KEYDOWN).replace("KEYLEFT",lang.KEYLEFT).replace("KEYRIGHT",lang.KEYRIGHT).replace("KEYSPACE",lang.KEYSPACE),
          controls: [{
            label: lang.TXT_NEXT, 
            class: "button blue",
            onClick: function() {
              helpDialog2(helpInfo);
            }
          }]
        });   
      });
    });
  }

  function helpDialog2(helpInfo) {
    /*
     * To use analytics here, adapt below
     */

    var identifier = null;
    if (helpInfo.sceneName === currentGame.scenes.play_min_scene) {
      // We are in the 8 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge facile (8 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 2/3"
      };
    } else if (helpInfo.sceneName === currentGame.scenes.play_medium_scene) {
      // We are in the 10 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge novice (10 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 2/3"
      };
    } else if (helpInfo.sceneName === currentGame.scenes.play_max_scene) {
      // We are in the 12 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge apprenti (12 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 2/3"
      };
    } else if (helpInfo.sceneName === currentGame.scenes.play_super_max_scene) {
      // We are in the 14 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge chercheur (14 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 2/3"
      };
    } else if (helpInfo.sceneName === currentGame.scenes.play_mega_max_scene) {
      // We are in the 16 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge expert (16 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 2/3'"
      };
    }

    $("body").closeAllDialogs(function(){

      // Launch the timer and display private key.

      $(".wrapper.active .vertical-centering").dialog({

        animateText: true,
        animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

        type: "withAvatar",
        avatar: "<img src='"+lang.IMG_RESEARCHER+"'>",

        identifier: identifier,

        title: lang.TXT_RESEARCHER,
        content: lang.DIALOG_STRING67.replace("KEYUP",lang.KEYUP).replace("KEYDOWN",lang.KEYDOWN).replace("KEYLEFT",lang.KEYLEFT).replace("KEYRIGHT",lang.KEYRIGHT).replace("KEYSPACE",lang.KEYSPACE),
        controls: [{
          label: lang.TXT_NEXT, 
          class: "button blue",
          onClick: function() {
              // Fix: Added firstDialog content as third help screen
              helpDialog3(helpInfo);
//            deActivateHelp(helpInfo.sceneName, helpInfo.hookName);
          }
        }]

      });   

    });

  }


  // Fix: Added firstDialog content as third help screen
  function helpDialog3(helpInfo){


    /*
     * To use analytics here, adapt below
     */

    var identifier = null;
    if (helpInfo.sceneName === currentGame.scenes.play_min_scene) {
      // We are in the 8 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge facile (8 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 3/3"
      };
    } else if (helpInfo.sceneName === currentGame.scenes.play_medium_scene) {
      // We are in the 10 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge novice (10 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 3/3"
      };
    } else if (helpInfo.sceneName === currentGame.scenes.play_max_scene) {
      // We are in the 12 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge apprenti (12 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 3/3"
      };
    } else if (helpInfo.sceneName === currentGame.scenes.play_super_max_scene) {
      // We are in the 14 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge chercheur (14 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 3/3"
      };
    } else if (helpInfo.sceneName === currentGame.scenes.play_mega_max_scene) {
      // We are in the 16 blocks level.
      identifier = {
        category: 'Arcade',
        action: 'Challenge expert (16 blocs)',
        label: "Dialogue 'Aide' (Chercheuse) 3/3'"
      };
    }

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({

          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<img src='"+lang.IMG_RESEARCHER+"'>",


          identifier: identifier,

          title: lang.TXT_RESEARCHER,
          content: lang.DIALOG_STRING87,
          controls: [{
            label: lang.TXT_NEXT,
            class: "button blue",
            onClick: function() {
              deActivateHelp(helpInfo.sceneName, helpInfo.hookName);
            }
          }]
        });
      });
    });
  }




  $(document).on("playMinHelpEvent", function() {
    activateHelp(currentGame.scenes.play_min_scene, "playMinSceneActive", helpDialog1);
  });

  $(document).on("playMinPauseEvent", function() {
    activatePause(currentGame.scenes.play_min_scene, "playMinSceneActive", pauseDialog);
  });

  function pauseDialog(pauseInfo) {

    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        /*
         * To use analytics here, adapt below
         */

        var identifier = null;
        if (pauseInfo.sceneName === currentGame.scenes.play_min_scene) {
          // We are in the 8 blocks level.
          identifier = {
            category: 'Arcade',
            action: 'Challenge facile (8 blocs)',
            label: 'Pause'
          };
        } else if (pauseInfo.sceneName === currentGame.scenes.play_medium_scene) {
          // We are in the 10 blocks level.
          identifier = {
            category: 'Arcade',
            action: 'Challenge novice (10 blocs)',
            label: 'Pause'
          };
        } else if (pauseInfo.sceneName === currentGame.scenes.play_max_scene) {
          // We are in the 12 blocks level.
          identifier = {
            category: 'Arcade',
            action: 'Challenge apprenti (12 blocs)',
            label: 'Pause'
          };
        } else if (pauseInfo.sceneName === currentGame.scenes.play_super_max_scene) {
          // We are in the 14 blocks level.
          identifier = {
            category: 'Arcade',
            action: 'Challenge chercheur (14 blocs)',
            label: 'Pause'
          };
        } else if (pauseInfo.sceneName === currentGame.scenes.play_mega_max_scene) {
          // We are in the 16 blocks level.
          identifier = {
            category: 'Arcade',
            action: 'Challenge expert (16 blocs)',
            label: 'Pause'
          };
        }

        $(".wrapper.active .vertical-centering").dialog({
          type: "player",
          title: lang.TXT_PAUSE,
          identifier: identifier,
          content: [
            {
              label: lang.TXT_RESUME, 
              class: "not-asked",
              onClick: function() {
                deActivatePause(pauseInfo.sceneName, pauseInfo.hookName);
              }
            },
            {
              label: lang.TXT_ARCADEMENU,
              class: "not-asked",
              onClick: function() {
                menu();
                setTimeout(currentGame.scenes.create_key_scene.scene.setPaused(false), 1500);
              }
            },
            {
              label: lang.TXT_MAINMENU,
              class: "not-asked",
              onClick: function() {
                window.location.href = lang.INDEX_HTMLFILE
              }
            }
          ]

        });
  

      });

    });
  }

  function playLevel1(){

    //console.log('Arcade - Challenge facile (8 blocs) - Début');
    
    /**
     * Prepare information if the board is resolved.
     */
    informationBoardIsResolved = {
      category: lang.MENU_ARCADE,
      action: lang.DIALOG_STRING18,
      timeLabel: "playMinSceneActiveTime",
    }

    // Activate the timer.
    $(document).trigger('startTime', currentGame.scenes.play_min_scene.scene);

    $("body").closeAllDialogs(function(){
      // Active input for play_min_scene
      currentGame.iaPlay = true;
      currentGame.scenes.play_min_scene.scene.setPaused(false);
      currentGame.playMinSceneActive = true;

      // Fix: show help dialogs at start of game once
      if (!firstHelp)
      {
        firstHelp = true;
        activateHelp(currentGame.scenes.play_min_scene, "playMinSceneActive", helpDialog1);
      }

    });
  }


  function dialogDecryptedMessage1(){
    $("body").closeAllDialogs(function() {

      $.switchWrapper('#bg-circuits', function() {
        var randLetter = null;
        var o = "";
        var t = lang.DIALOG_STRING83+" : " + FIRST_CHALLENGE_MESSAGE;
       
        // we need to do it once more;
        t = $('<div></div>').html(t).text();

        for (var i = 0; i < t.length; i++) {
          randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
          o += "<span class='letter-block crypted'>" + randLetter + "</span>";
        }

        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: lang.DIALOG_STRING20,
          content: o,

          identifier: {
            category: lang.MENU_ARCADE,
            action: lang.DIALOG_STRING18,
            label: "Dialogue 'Affichage du message décrypté' (InriOS)",
          },

          transitionCallback: {
            in: function() {
              // alert("Dialog was added to the dom");
            },
            show: function() {
              // alert("Dialog intro animation is complete");
              $.simulateDecrypt($(".dialog .content .text"), lang.DIALOG_STRING83+" : " + FIRST_CHALLENGE_MESSAGE, 2, -2);
            },
            out: function() {
              // alert("Dialog outro animation is complete, html element will be removed now.");
            }
          },

          controls: [{
            label: lang.TXT_ARCADEMENU,
            class: "button red",
            onClick: menu
          },{
            label: lang.DIALOG_STRING21, 
            class: "button blue",
            onClick: challenge2
          }]

        });   

      });

    });

  }       























  function challenge2(){

    currentGame.director.easeInOut(
                                    currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                    CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    300,
                                    true,
                                    new specialInInterpolator(),
                                    new specialOutInterpolator()
    );
    $("body").closeAllDialogs(function(){

      // Prepare the second battle message
      var before = $.now();
      currentGame.play_medium_scene_msg = createMessageForPlayScene(MEDIUM_BOARD_LENGTH, SECOND_CHALLENGE_MESSAGE);
      var after = $.now();

      setTimeout(function() {
        $.switchWrapper('#bg-circuits', function(){

          // Display the battle scene in background.
          goToBattleScene('play_medium_scene', dialogDecryptedMessage2, MEDIUM_BOARD_LENGTH, 'playMediumSceneActive', true, false, currentGame.play_medium_scene_msg, 'playMediumHelpEvent', 'playMediumPauseEvent');

          setTimeout(function() {
            $(".wrapper.active .vertical-centering").dialog({
                
              animateText: true,
              animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

              type: "withAvatar",
              avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

              identifier: {
                category: lang.MENU_ARCADE,
                action: lang.DIALOG_STRING19,
                label: "Dialogue 'Message crypté' (InriOS)",
              },

              title: lang.DIALOG_STRING52,
              content: (function(){
                var t = board_message_to_string(currentGame.play_medium_scene_msg.plain_message),
                    a = t.split(' '),
                    o = '';

                for (var i = 0; i<a.length; i++) {
                  if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
                }

                return o;
              }()),
                
              controls: [{
                label: lang.TXT_DECRYPT_MESSAGE, 
                class: "button blue",
                onClick: playLevel2
              }]
            });
          }, 500);

        });

      }, 100 + (after - before));
    });
  }

  $(document).on("playMediumHelpEvent", function() {
    activateHelp(currentGame.scenes.play_medium_scene, "playMediumSceneActive", helpDialog1);
  });
  $(document).on("playMediumPauseEvent", function() {
    activatePause(currentGame.scenes.play_medium_scene, "playMediumSceneActive", pauseDialog);
  });


  function playLevel2(){

    //console.log('Arcade - Challenge novice (10 blocs) - Début');

    /**
     * Prepare information if the board is resolved.
     */
    informationBoardIsResolved = {
      category: lang.MENU_ARCADE,
      action: lang.DIALOG_STRING19,
      timeLabel: "playMediumSceneActiveTime",
    }

    // Activate the timer.
    $(document).trigger('startTime', currentGame.scenes.play_medium_scene.scene);

    $("body").closeAllDialogs(function(){
      // Active input for play_medium_scene
      currentGame.iaPlay = true;
      currentGame.scenes.play_medium_scene.scene.setPaused(false);
      currentGame.playMediumSceneActive = true;

      // Fix: show help dialogs at start of game once
      if (!firstHelp)
      {
        firstHelp = true;
        activateHelp(currentGame.scenes.play_medium_scene, "playMediumSceneActive", helpDialog1);
      }

    });
  }


  function dialogDecryptedMessage2(){
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        var randLetter = null;
        var o = "";
        var t = lang.DIALOG_STRING33+" : " + SECOND_CHALLENGE_MESSAGE;
       
        // we need to do it once more;
        t = $('<div></div>').html(t).text();

        for (var i = 0; i < t.length; i++) {
          randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
          o += "<span class='letter-block crypted'>" + randLetter + "</span>";
        }
        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          identifier: {
            category: lang.MENU_ARCADE,
            action: lang.DIALOG_STRING19,
            label: "Dialogue 'Affichage du message décrypté' (InriOS)",
          },

          title: lang.DIALOG_STRING20,
          content: o,

          transitionCallback: {
            in: function() {
              // alert("Dialog was added to the dom");
            },
            show: function() {
              // alert("Dialog intro animation is complete");
              $.simulateDecrypt($(".dialog .content .text"), lang.DIALOG_STRING33+" : " + SECOND_CHALLENGE_MESSAGE, 2, -2);
            },
            out: function() {
              // alert("Dialog outro animation is complete, html element will be removed now.");
            }
          },
                
          controls: [{
            label: lang.TXT_ARCADEMENU,
            class: "button red",
            onClick: menu
          },{
            label: lang.DIALOG_STRING21, 
            class: "button blue",
            onClick: challenge3
          }]

        });   
      });
    });
  }













  function challenge3(){

    currentGame.director.easeInOut(
                                    currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                    CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    300,
                                    true,
                                    new specialInInterpolator(),
                                    new specialOutInterpolator()
    );
    $("body").closeAllDialogs(function(){

      // Prepare the second battle message
      var before = $.now();
      currentGame.play_max_scene_msg = createMessageForPlayScene(MAX_BOARD_LENGTH, THIRD_CHALLENGE_MESSAGE);
      var after = $.now();

      setTimeout(function() {
        $.switchWrapper('#bg-circuits', function(){

          // Display the battle scene in background.
          goToBattleScene('play_max_scene', dialogDecryptedMessage3, MAX_BOARD_LENGTH, 'playMaxSceneActive', true, false, currentGame.play_max_scene_msg, 'playMaxHelpEvent', 'playMaxPauseEvent');

          setTimeout(function() {
            $(".wrapper.active .vertical-centering").dialog({

              animateText: true,
              animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

              type: "withAvatar",
              avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

              identifier: {
                category: lang.MENU_ARCADE,
                action: lang.DIALOG_STRING15,
                label: "Dialogue 'Message crypté' (InriOS)",
              },

              title: lang.DIALOG_STRING52,
              content: (function(){
                var t = board_message_to_string(currentGame.play_max_scene_msg.plain_message),
                    a = t.split(' '),
                    o = '';

                for (var i = 0; i<a.length; i++) {
                  if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
                }

                return o;
              }()),
            
              controls: [{
                label: lang.TXT_DECRYPT_MESSAGE, 
                class: "button blue",
                onClick: playLevel3
              }]

            });
          }, 500);   
        });
      }, 100 + (after - before));

    });

  }

  $(document).on("playMaxHelpEvent", function() {
    activateHelp(currentGame.scenes.play_max_scene, "playMaxSceneActive", helpDialog1);
  });

  $(document).on("playMaxPauseEvent", function() {
    activatePause(currentGame.scenes.play_max_scene, "playMaxSceneActive", pauseDialog);
  });


  function playLevel3(){
    //console.log('Arcade - Challenge apprenti (12 blocs) - Début');

    /**
     * Prepare information if the board is resolved.
     */
    informationBoardIsResolved = {
      category: lang.MENU_ARCADE,
      action: lang.DIALOG_STRING15,
      timeLabel: "playMaxSceneActiveTime",
    }

    // Activate the timer.
    $(document).trigger('startTime', currentGame.scenes.play_max_scene.scene);

    $("body").closeAllDialogs(function(){
      // Active input for play_max_scene
      currentGame.iaPlay = true;
      currentGame.scenes.play_max_scene.scene.setPaused(false);
      currentGame.playMaxSceneActive = true;

      // Fix: show help dialogs at start of game once
      if (!firstHelp)
      {
        firstHelp = true;
        activateHelp(currentGame.scenes.play_max_scene, "playMaxSceneActive", helpDialog1);
      }

    });
  }


  function dialogDecryptedMessage3(){
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        var randLetter = null;
        var o = "";
        var t = lang.DIALOG_STRING96+" : " + THIRD_CHALLENGE_MESSAGE;
       
        // we need to do it once more;
        t = $('<div></div>').html(t).text();

        for (var i = 0; i < t.length; i++) {
          randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
          o += "<span class='letter-block crypted'>" + randLetter + "</span>";
        }
        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          title: lang.DIALOG_STRING20,
          content: o,
                
          identifier: {
            category: lang.MENU_ARCADE,
            action: lang.DIALOG_STRING15,
            label: "Dialogue 'Affichage du message décrypté' (InriOS)",
          },

          transitionCallback: {
            in: function() {
              // alert("Dialog was added to the dom");
            },
            show: function() {
              // alert("Dialog intro animation is complete");
              $.simulateDecrypt($(".dialog .content .text"), lang.DIALOG_STRING96+" : " + THIRD_CHALLENGE_MESSAGE, 3, -3);
            },
            out: function() {
              // alert("Dialog outro animation is complete, html element will be removed now.");
            }
          },
          controls: [{
            label: lang.TXT_ARCADEMENU,
            class: "button red",
            onClick: menu
          },{
            label: lang.DIALOG_STRING21, 
            class: "button blue",
            onClick: challenge4
          }]

        });   

      });

    });

  }       



















  function challenge4(){

    currentGame.director.easeInOut(
                                    currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                    CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    300,
                                    true,
                                    new specialInInterpolator(),
                                    new specialOutInterpolator()
    );
    $("body").closeAllDialogs(function(){

      // Prepare the second battle message
      var before = $.now();
      currentGame.play_super_max_scene_msg = createMessageForPlayScene(SUPER_MAX_BOARD_LENGTH, FOURTH_CHALLENGE_MESSAGE);
      var after = $.now();

      setTimeout(function() {
        $.switchWrapper('#bg-circuits', function(){

          // Display the battle scene in background.
          goToBattleScene('play_super_max_scene', dialogDecryptedMessage4, SUPER_MAX_BOARD_LENGTH, 'playSuperMaxSceneActive', true, false, currentGame.play_super_max_scene_msg, 'playSuperMaxHelpEvent', 'playSuperMaxPauseEvent');

          setTimeout(function() {
            $(".wrapper.active .vertical-centering").dialog({
                
              animateText: true,
              animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

              type: "withAvatar",
              avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

              identifier: {
                category: lang.MENU_ARCADE,
                action: lang.DIALOG_STRING16,
                label: "Dialogue 'Message crypté' (InriOS)",
              },

              title: lang.DIALOG_STRING52,
              content: (function(){
                var t = board_message_to_string(currentGame.play_super_max_scene_msg.plain_message),
                    a = t.split(' '),
                    o = '';

                for (var i = 0; i<a.length; i++) {
                  if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
                }

                return o;
              }()),
        
              controls: [{
                label: lang.TXT_DECRYPT_MESSAGE, 
                class: "button blue",
                onClick: playLevel4
              }]

            });   
          }, 500);
        });
      }, 100 + (after - before));
    });

  }

  $(document).on("playSuperMaxHelpEvent", function() {
    activateHelp(currentGame.scenes.play_super_max_scene, "playSuperMaxSceneActive", helpDialog1);
  });

  $(document).on("playSuperMaxPauseEvent", function() {
    activatePause(currentGame.scenes.play_super_max_scene, "playSuperMaxSceneActive", pauseDialog);
  });

  function playLevel4(){
    //console.log('Arcade - Challenge chercheur (14 blocs) - Début');

    /**
     * Prepare information if the board is resolved.
     */
    informationBoardIsResolved = {
      category: lang.MENU_ARCADE,
      action: lang.DIALOG_STRING16,
      timeLabel: "playSuperMaxSceneActiveTime",
    }

    // Activate the timer.
    $(document).trigger('startTime', currentGame.scenes.play_super_max_scene.scene);

    $("body").closeAllDialogs(function(){
      // Active input for play_super_max_scene
      currentGame.iaPlay = true;
      currentGame.scenes.play_super_max_scene.scene.setPaused(false);
      currentGame.playSuperMaxSceneActive = true;

      // Fix: show help dialogs at start of game once
      if (!firstHelp)
      {
        firstHelp = true;
        activateHelp(currentGame.scenes.play_super_max_scene, "playSuperMaxSceneActive", helpDialog1);
      }

    });
  }


  function dialogDecryptedMessage4(){
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        var randLetter = null;
        var o = "";
        var t = lang.DIALOG_STRING86+" : " + FOURTH_CHALLENGE_MESSAGE;
       
        // we need to do it once more;
        t = $('<div></div>').html(t).text();

        for (var i = 0; i < t.length; i++) {
          randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
          o += "<span class='letter-block crypted'>" + randLetter + "</span>";
        }
        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          identifier: {
            category: lang.MENU_ARCADE,
            action: lang.DIALOG_STRING16,
            label: "Dialogue 'Affichage du message décrypté' (InriOS)",
          },
          title: lang.DIALOG_STRING20,
          content: o,
          transitionCallback: {
            in: function() {
              // alert("Dialog was added to the dom");
            },
            show: function() {
              // alert("Dialog intro animation is complete");
              $.simulateDecrypt($(".dialog .content .text"), lang.DIALOG_STRING86+" : " + FOURTH_CHALLENGE_MESSAGE, 3, -3);
            },
            out: function() {
              // alert("Dialog outro animation is complete, html element will be removed now.");
            }
          },
                
          controls: [{
            label: lang.TXT_ARCADEMENU,
            class: "button red",
            onClick: menu
          },{
            label: lang.DIALOG_STRING21, 
            class: "button blue",
            onClick: challenge5
          }]

        });   

      });

    });

  }       





















  function challenge5(){

    currentGame.director.easeInOut(
                                    currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                    CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                    CAAT.Foundation.Actor.ANCHOR_CENTER,
                                    300,
                                    true,
                                    new specialInInterpolator(),
                                    new specialOutInterpolator()
    );
    $("body").closeAllDialogs(function(){

      // Prepare the second battle message
      var before = $.now();
      currentGame.play_mega_max_scene_msg = createMessageForPlayScene(MEGA_MAX_BOARD_LENGTH, FIFTH_CHALLENGE_MESSAGE);
      var after = $.now();

      setTimeout(function() {
        $.switchWrapper('#bg-circuits', function(){

          // Display the battle scene in background.
          goToBattleScene('play_mega_max_scene', dialogDecryptedMessage5, MEGA_MAX_BOARD_LENGTH, 'playMegaMaxSceneActive', true, false, currentGame.play_mega_max_scene_msg, 'playMegaMaxHelpEvent', "playMegaMaxPauseEvent");

          setTimeout(function() {
            $(".wrapper.active .vertical-centering").dialog({
                
              animateText: true,
              animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

              type: "withAvatar",
              avatar: "<div class='new-message encrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-closed.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

              identifier: {
                category: lang.MENU_ARCADE,
                action: lang.DIALOG_STRING17,
                label: "Dialogue 'Message crypté' (InriOS)",
              },
              title: lang.DIALOG_STRING52,
              content: (function(){
                var t = board_message_to_string(currentGame.play_mega_max_scene_msg.plain_message),
                    a = t.split(' '),
                    o = '';

                for (var i = 0; i<a.length; i++) {
                  if(a[i] != '') o += "<span class='letter-block crypted crypted-message'>"+a[i]+"</span>";
                }

                return o;
              }()),
                
              controls: [{
                label: lang.TXT_DECRYPT_MESSAGE, 
                class: "button blue",
                onClick: playLevel5
              }]

            });   
          }, 500);
        });
      }, 100 + (before - after));
    });

  }

  $(document).on("playMegaMaxHelpEvent", function() {
    activateHelp(currentGame.scenes.play_mega_max_scene, "playMegaMaxSceneActive", helpDialog1);
  });
  $(document).on("playMegaMaxPauseEvent", function() {
    activatePause(currentGame.scenes.play_mega_max_scene, "playMegaMaxSceneActive", pauseDialog);
  });

  function playLevel5(){
    //console.log('Arcade - Challenge expert (16 blocs) - Début');

    /**
     * Prepare information if the board is resolved.
     */
    informationBoardIsResolved = {
      category: lang.MENU_ARCADE,
      action: lang.DIALOG_STRING17,
      timeLabel: "playMegaMaxSceneActiveTime",
    }
    // Activate the timer.
    $(document).trigger('startTime', currentGame.scenes.play_mega_max_scene.scene);

    $("body").closeAllDialogs(function(){
      // Active input for play_super_max_scene
      currentGame.iaPlay = true;
      currentGame.scenes.play_mega_max_scene.scene.setPaused(false);
      currentGame.playMegaMaxSceneActive = true;

      // Fix: show help dialogs at start of game once
      if (!firstHelp)
      {
        firstHelp = true;
        activateHelp(currentGame.scenes.play_mega_max_scene, "playMegaMaxSceneActive", helpDialog1);
      }


    });
  }


  function dialogDecryptedMessage5(){
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        var randLetter = null;
        var o = "";
        var t = lang.DIALOG_STRING23+" : " + FIFTH_CHALLENGE_MESSAGE;
       
        // we need to do it once more;
        t = $('<div></div>').html(t).text();

        for (var i = 0; i < t.length; i++) {
          randLetter = String.fromCharCode(Math.round(Math.random() * 224) + 32);
          o += "<span class='letter-block crypted'>" + randLetter + "</span>";
        }
        $(".wrapper.active .vertical-centering").dialog({
                
          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,

          type: "withAvatar",
          avatar: "<div class='new-message decrypted'><img src='img/avatar-new-message-background.jpg' class='background'><img src='img/avatar-new-message-envelope.png' class='envelope blinking-smooth'><img src='img/avatar-new-message-padlock-open.png' class='padlock rotating'><img src='img/avatar-new-message-ring.png' class='ring blinking-smooth'></div>",

          identifier: {
            category: lang.MENU_ARCADE,
            action: lang.DIALOG_STRING17,
            label: "Dialogue 'Affichage du message décrypté' (InriOS)",
          },
          title: lang.DIALOG_STRING20,
          content: o,
          transitionCallback: {
            in: function() {
              // alert("Dialog was added to the dom");
            },
            show: function() {
              // alert("Dialog intro animation is complete");
              $.simulateDecrypt($(".dialog .content .text"), lang.DIALOG_STRING23+" : " + FIFTH_CHALLENGE_MESSAGE, 4, -4);
            },
            out: function() {
              // alert("Dialog outro animation is complete, html element will be removed now.");
            }
          },
                
          controls: [{
            label: lang.TXT_ARCADEMENU, 
            class: "button blue",
            onClick: menu
          }]

        });   

      });

    });

  }       


  //console.log('Arcade - Début du mode arcade');

  menu();

  // Fix: replace firstDialog (boolean flag firstLaunch), by showing help dialogs once (boolean flag firstHelp)
  var firstLaunch = true;
  var firstHelp = false;
  var haveName = false;
  function firstDialog(challenge) {
    firstLaunch = true;
    $("body").closeAllDialogs(function(){

      $.switchWrapper('#bg-circuits', function(){

        $(".wrapper.active .vertical-centering").dialog({

          animateText: true,
          animateTextDelayBetweenLetters: game.animateTextDelayBetweenLetters,
          type: "withAvatar",
          avatar: "<img src='"+lang.IMG_RESEARCHER+"'>",

          identifier: {
            category: lang.MENU_ARCADE,
            action: lang.DIALOG_STRING85,
            label: "Dialogue 'Si tu as besoin d'aide (Chercheuse)",
          },

          title: lang.TXT_RESEARCHER,
          content: lang.DIALOG_STRING87,
          controls: [{
            label: lang.TXT_NEXT, 
            class: "button blue",
            onClick: challenge
          }]
        });   

      });

    });
  }

  function addControlToDialogs() {
    addControlToDialog(announcePublicKeyDialog, [{label: labelNext, class: "button blue", onClick: hereYourPrivateKey}]);
    addControlToDialog(hereYourPrivateKeyDialog, [{label: labelNext, class: "button blue", onClick: fallSixTimes}]);
    addControlToDialog(fallSixTimesDialog, [{label: labelNext, class: "button blue", onClick: switchToCreateKey}]);
    addControlToDialog(keyPregeneratedDialog, [{label: labelNext, class: "button blue", onClick: switchToFinishCreateKey}]);

  }
  addControlToDialogs();


  function deactivateMenu() {
    var allItems = ['item-public-key', 'item-8-board', 'item-10-board', 'item-12-board', 'item-14-board', 'item-16-board'];
    for (var i = 0; i < allItems.length; ++i) {
      $('#' + allItems[i]).removeClass('active');
    }
  }

  function menu() {

    //console.log('Arcade - Affichage du menu');
  
    $("body").closeAllDialogs(function(){
      $.switchWrapper('#menu-view', function() {
        // -- switch to waiting scene.
        if (currentGame.scenes != null) {
          var currentScene = currentGame.director.currentScene;
          currentScene.setPaused(false);
          currentGame.director.easeInOut(
                                      currentGame.director.getSceneIndex(currentGame.scenes.waiting_scene),
                                      CAAT.Foundation.Scene.prototype.EASE_SCALE, CAAT.Foundation.Actor.ANCHOR_CENTER,
                                      currentGame.director.getSceneIndex(currentGame.director.currentScene),
                                      CAAT.Foundation.Scene.prototype.EASE_SCALE,
                                      CAAT.Foundation.Actor.ANCHOR_CENTER,
                                      0,
                                      true,
                                      new specialInInterpolator(),
                                      new specialOutInterpolator()
          );
          currentScene.setExpired(true);
        }
        deactivateMenu();
        $('#item-public-key').addClass('active');
      });
    });
  }


  function launchChallenge(challenge) {
    if (haveName === false) {
      haveName = true;
      getName(challenge);
    } else {
      firstLaunch === false ? firstDialog(challenge) : challenge();
    }
  }

  $('#link-public-key').bind('click', function() {
    deactivateMenu();
    if (haveName === false) {
      haveName = true;
      getName(announcePublicKey, true);
    } else {
      announcePublicKey();
    }
  });
  $('#link-8-board').bind('click', function() {
    deactivateMenu();
    launchChallenge(challenge1);
  });
  $('#link-10-board').bind('click', function() {
    deactivateMenu();
    launchChallenge(challenge2);
  });
  $('#link-12-board').bind('click', function() {
    deactivateMenu();
    launchChallenge(challenge3);
  });
  $('#link-14-board').bind('click', function() {
    deactivateMenu();
    launchChallenge(challenge4);
  });
  $('#link-16-board').bind('click', function() {
    deactivateMenu();
    launchChallenge(challenge5);
  });
});
