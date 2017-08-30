(function() {

  //jQuery equivelent to window.onload = function{}
  //code in here wont run until page loads
  $(function() {

    // function to build the hero table from object received from Marvel API
    function buildTable(CharactersObject) {
      //Build an array containing Customer records.
      var characters = CharactersObject.data.results;
      console.log(characters[0]);

      //  Initialize heroRows and add header row
      let heroRows = `
        <thead>
          <th>Character Name</th>
          <th>Character Picture</th>
        </thead>`;


      //Add the data rows.
      for (var i = 0; i < characters.length; i++) {
        let heroRow = `
            <tr>
              <td>
                <a class="heroProfile" data-characterid="${characters[i].id}">${characters[i].name}</a>
              </td>
              <td>
                <img src="${characters[i].thumbnail.path}.${characters[i].thumbnail.extension}" border=3 height=300 width=400>
              </td>
            </tr>`
        //  append new row to heroRows object
        heroRows += heroRow

      }

      //  select heroTable and populate with finished heroRows
      var heroTable = $("#heroTable");
      heroTable.html("");
      heroTable.html(heroRows);
    };

    // function to populate the Hero Details Box and show it and hide the table
    function populateProfile(sentData) {
      // Initialize heroItem and populate with name and image
      let heroItem = `
      <div>
        <h2>${sentData.data.results[0].name}</h2>
      </div>
      <div>
        <img src="${sentData.data.results[0].thumbnail.path}.${sentData.data.results[0].thumbnail.extension}" border=3 height=300 width=400>
      </div>
      `

      // Now get events for hero using api
      $.get(`http://gateway.marvel.com/v1/public/characters/${sentData.data.results[0].id}/events?ts=1&apikey=70192f833372c4bf90536c073f57817a&hash=428fbcd16d2262d0cf696698994796d9`)
        .done(function(eventdata) {
          let heroCount = eventdata.data.count;
          // only show max of 5 events
          if (heroCount > 5) {
            heroCount = 5
          }
          // append header for events
          heroItem += `
          <div>
            <h3>Events Hero Participated In</h3>
          </div>
          `
          // if no events, append message
          if (heroCount === 0) {
            heroItem += `
            <div>
              <h4>Sorry, no Events for this Hero</h4>
            </div>
            `
          } else {
            //  loop through events and append to heroItem
            for (let i = 0; i < heroCount; i++) {
              heroItem += `
              <div>
                <h4>${eventdata.data.results[i].title}</h4>
              </div>
              <div>
                <p>${eventdata.data.results[i].description}</p>
              </div>
              <div>
                <p>${eventdata.data.results[i].characters.available} Heros were involved in this event</p>
              </div>
              <div>**************************</div>
              `
            }
          }

          //  append button to allow user to return to table
          heroItem += `
          <div>
            <button id="returnButton">Return to Table</button>
          </div>
          `
          //  select detailBox and populate with heroItem.  Show it and hide table
          var heroBox = $("#detailBox");
          heroBox.html("");
          heroBox.html(heroItem);
          $("#heroTable").hide();
          $("#detailBox").show();
        })

    }

    //  On Click event will respond to click on "heroProfile" class in heroTable
    $("#heroTable").on("click", ".heroProfile", function() {
      $.get(`http://gateway.marvel.com/v1/public/characters/${$(this).data("characterid")}?ts=1&apikey=70192f833372c4bf90536c073f57817a&hash=428fbcd16d2262d0cf696698994796d9`)
        .done(function(data) {
          populateProfile(data);
        })
    })

    //  On Click event will respond to click on "returnButton" class in detailBox
    $("#detailBox").on("click", "#returnButton", function() {
      $("#detailBox").hide();
      $("#heroTable").show();
    })

    //make initial ajax request and handle failure
    function initCharacters() {
      //hit the api endpoint and put the question in the div with the id of questions
      return $.get("http://gateway.marvel.com/v1/public/characters?ts=1&apikey=70192f833372c4bf90536c073f57817a&hash=428fbcd16d2262d0cf696698994796d9&limit=100")
        .fail(function(req) {
          alert("no game for you")
        })
    }

    //make ajax request to search for characers based on input string and handle failure
    function getCharacters(inputString) {
      //hit the api endpoint and put the question in the div with the id of questions
      return $.get(inputString)
        .fail(function(req) {
          alert("no game for you")
        })
    }

    $("#detailBox").hide();
    //call the api for the first time and store into variable called result
    let result = initCharacters();


    //use the done promise on result to build the table
    result.done(function(data) {
      buildTable(data);
      $("#detailBox").hide();
    });

    $("#searchbutton").click(function(e) {
      e.preventDefault();
      let searchText = $('#save-me').val(); // capture answer from box
      if (searchText != "") {
        var characterSearchString = "http://gateway.marvel.com/v1/public/characters?ts=1&apikey=70192f833372c4bf90536c073f57817a&hash=428fbcd16d2262d0cf696698994796d9&nameStartsWith=" + searchText;
      } else {
        var characterSearchString = "http://gateway.marvel.com/v1/public/characters?ts=1&apikey=70192f833372c4bf90536c073f57817a&hash=428fbcd16d2262d0cf696698994796d9";
      }

      let characterSet = getCharacters(characterSearchString);
      //use the done promise on characterSet to build the table
      characterSet.done(function(data) {
        buildTable(data);
        $("#detailBox").hide();
        $("#heroTable").show();
      });


    })


  })

})();
