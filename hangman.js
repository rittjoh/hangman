var DBPlayers = new Meteor.Collection("Players");
var DBLetters = new Meteor.Collection("Letters");
var DBPhrase = new Meteor.Collection("Phrase");


if (Meteor.isClient) {
  Template.header.title = function () {
    return "----";
  };

  Template.header.tagline = function () {
    return "----";
  };

  Template.body.rendered = function() {
    //console.log('thisPlayer');

  };

  Template.newPlayer.events({
    'click #addPlayer' : function() {
      var input = $('#playerToAdd');
      var checkPlayers = DBPlayers.find({name: input.val().toUpperCase()}).count();
      var getIDQRY;


      if(!checkPlayers){
        DBPlayers.insert({ name: input.val().toUpperCase(), guesses: 0 });
      }
      
      getIDQRY = DBPlayers.find({name: input.val().toUpperCase()}).fetch();

      Session.set('thisPlayer', input.val());
      Session.set('thisPlayerID', getIDQRY[0]._id);
      console.log(Session.get('thisPlayerID'));

      input.val('');
      $('#playerAdd').hide();

      if(DBPhrase.find({}).count()){
        $('#phraseAdd').hide();
        $('#letterAdd').show();
      } 
      else{
        $('#phraseAdd').show();
      }  
      //$('#playerAdd').remove();

      //console.log(Session);
    }
  });

  Template.newPhrase.events({
    'click #addPhrase' : function() {
      var input1 = $('#PhraseToAdd');
      var input2 = $('#PhraseDesc');
      var puzzle = '';
      var tmpQRY;
      var tmp;
      var checkPhrase = DBPhrase.find({});

      if(checkPhrase.count() > 0){
        input1.val(checkPhrase.fetch()[0].phrase);
      }else{
        DBPhrase.insert({ phrase: input1.val(), description: input2.val() });
      }
      
      for(i=0; i < input1.val().length; i++){
        tmpQRY = DBLetters.find({letter: input1.val().charAt(i).toUpperCase()});
        tmp = tmpQRY.fetch();
        //console.log(tmp);
        if(tmp.length && (input1.val().charAt(i).trim().toUpperCase() == tmp[0].letter.trim().toUpperCase())){
          puzzle = puzzle + tmp[0].letter;
        }
        else if(input1.val().charAt(i).trim().length){
          puzzle = puzzle + ' - ';
        }
        else{
          puzzle = puzzle + '&nbsp;&nbsp;';
        }
      }
      $('#phrase').html(puzzle);
      console.log($('#phrase').html());
      $('#phraseAdd').hide();
      $('#letterAdd').show();
      input1.val('');
    
      //$('#playerAdd').remove();

      //console.log(Session);
    }
  });  

  Template.newLetter.events({
    'click #addLetter' : function() {
        var input = $('#letterToAdd');
        var regx = /[A-Za-z]{1}/;
        var checkLetters = DBLetters.find({letter: input.val().toUpperCase()}).count();
        var guessesQRY;
        var guesses;
        var guessCount = 0;
        var gallows = [];
        
        var puzzle = '';
        var PhrQRY;
        var Phr;
        var tmpQRY;
        var tmp;
        var found = false;

        console.log('WHAT' + checkLetters);

        if(input.val().trim().length > 1){
          alert('Only a one letter guess.');
          input.val('');
        }
        else if (!regx.test(input.val())) {
          alert('That is not a letter genius');
          input.val('');
        }
        else if(checkLetters > 0) {
          alert('Someone already guessed that Mr. Observant!');
          input.val('');
        }
        else{
          DBLetters.insert({ name: Session.get('thisPlayer').trim().toUpperCase(), letter: input.val().trim().toUpperCase() });
          //console.log(Session.get('thisPlayer'));
          input.val('');
        }

        Phr = DBPhrase.find({});
        PhrQRY = Phr.fetch();

        for(i=0; i < PhrQRY[0].phrase.length; i++){
          
          tmpQRY = DBLetters.find({letter: PhrQRY[0].phrase.charAt(i).toUpperCase() });
          tmp = tmpQRY.fetch();
          //console.log(tmp);
          if(tmp.length && (PhrQRY[0].phrase.charAt(i).trim().toUpperCase() === tmp[0].letter.trim().toUpperCase())){
            puzzle = puzzle + tmp[0].letter;
            found = true;
          }
          else if(PhrQRY[0].phrase.charAt(i).trim().length){
            puzzle = puzzle + ' - ';
          }
          else{
            puzzle = puzzle + '&nbsp;&nbsp;';
          }
        }
        $('#phrase').html(puzzle);
       console.log('hello ' + str.indexOf(input.val()));
        if(str.indexOf(input.val()) == -1) {
          DBPlayers.update(Session.get('thisPlayerID'), { $inc: { guesses : 1 }});
        }

        guessesQRY = DBPlayers.find({});
        guesses = guessesQRY.fetch()

        for(j=0; j < guesses.length; j++){
          guessCount = guessCount + guesses[j].guesses; 
        }
        
        gallows[0] = ' <pre>\n     _______\n     |/        |\n     |      \n     |      \n     |       \n     |      \n     |\n________\n\n</pre>';
        gallows[1] = ' <pre>\n     _______\n     |/        |\n     |        (_)\n     |      \n     |       \n     |      \n     |\n________\n\n</pre>';
        gallows[2] = ' <pre>\n     _______\n     |/        |\n     |        (_)\n     |         |\n     |       \n     |      \n     |\n________\n\n</pre>';
        gallows[3] = ' <pre>\n     _______\n     |/        |\n     |        (_)\n     |         |\n     |         |\n     |      \n     |\n________\n\n</pre>';
        gallows[4] = ' <pre>\n     _______\n     |/        |\n     |        (_)\n     |        \\|\n     |         |\n     |      \n     |\n________\n\n</pre>';
        gallows[5] = ' <pre>\n     _______\n     |/        |\n     |        (_)\n     |        \\|/\n     |         |\n     |      \n     |\n________\n\n</pre>'; 
        gallows[6] = ' <pre>\n     _______\n     |/        |\n     |        (_)\n     |        \\|/\n     |         |\n     |        /\n     |\n________\n\n</pre>';               
        gallows[7] = ' <pre>\n     _______\n     |/        |\n     |        (_)\n     |        \\|/\n     |         |\n     |         /\\\n     |\n________\n\n</pre>';



/*
        gallows[1] = '<pre>     
     _______
     |/      |
     |      
     |      
     |       
     |      
     |
________
</pre>';

        gallows[2] = '<pre>     
     _______
     |/      |
     |      (_)
     |       |
     |       
     |       
     |
________
</pre>';     

        gallows[3] = '<pre>     
     _______
     |/      |
     |      (_)
     |       |
     |       |
     |      
     |
________
</pre>';

        gallows[4] = '<pre>     
     _______
     |/      |
     |      (_)
     |      \|
     |       |
     |      
     |
________
</pre>'; 

        gallows[5] = '<pre>     
     _______
     |/      |
     |      (_)
     |      \|/
     |       |
     |      
     |
________
</pre>';

        gallows[6] = '<pre>     
     _______
     |/      |
     |      (_)
     |      \|/
     |       |
     |      / 
     |
________
</pre>'; 

        gallows[7] = '<pre>     
     _______
     |/      |
     |      (_)
     |      \|/
     |       |
     |      / \
     |
________
</pre>';    
*/
        $('#gallow').html(gallows[guessCount]);
      //$('#playerAdd').remove();
    }
  });

  Template.players.players = function() {
    var returnQRY1; 
    var returnQRY2; 
    var letterLst;
    var playerQRY;
    var letterQRY;

    returnQRY1 = DBPlayers.find({});


    playerQRY = returnQRY1.fetch();
    
    for (var i=0; i<playerQRY.length; i++) {
        returnQRY2 = DBLetters.find({name: playerQRY[i].name.toUpperCase()});

        letterQRY = returnQRY2.fetch();
        letterLst = '';

        for (var j=0; j<letterQRY.length; j++) {
          letterLst = letterLst.concat(letterQRY[j].letter.trim().toUpperCase() + ' '); 
        }
        console.log('LETTERS ' + letterLst);
        playerQRY[i].letters = letterLst;
    }

    //console.log(playerQRY);
    return playerQRY;
  };

/*
  Template.players.letters = function() {
    return Letters.find({}, { name: Session.thisPlayer}).sort({letter});
  };
*/
}

if (Meteor.isServer) {
  Meteor.startup(function() {

    return Meteor.methods({

      startOver: function() {

        return DBPhrase.remove({});
        return DBGuesses.remove({});
        return DBLetters.remove({});

      }

    });
  });
}

