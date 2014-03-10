var lastUpdated = new Date(0);

$(document).ready(function() {

  // Receives array of messages, puts them in appropriate room, updates 'lastUpdated', and sets 'fetchMessages' to run again after delay.
  var updateMessages = function(response) {
    //console.log(response.results);
    _.each(response.results, function(messageObj) {
      if(messageObj.roomname === "" || !messageObj.roomname) {
        messageObj.roomname = "lobby";
      }
      if(rooms[messageObj.roomname] === undefined) {
        rooms[messageObj.roomname] = new Room(messageObj.roomname);
      }
      rooms[messageObj.roomname].addMessage(messageObj);
      if( (new Date(messageObj.updatedAt)).valueOf() > lastUpdated.valueOf() ) {
        lastUpdated = new Date(messageObj.updatedAt);
        //console.log("date updated to: ", lastUpdated);
      }
    });
    setTimeout(fetchMessages, 1000);
  };

  // Fetches new messages and passes them to updateMessages method.
  var fetchMessages = function() {
    var obj = {
      updatedAt: {
        "$gt": {
          "__type": "Date",
          "iso": lastUpdated
        }
      }
    };
    $.get('https://api.parse.com/1/classes/chatterbox?where=' + encodeURIComponent(
      JSON.stringify(obj)
    ), updateMessages);
  };

  fetchMessages();

});


