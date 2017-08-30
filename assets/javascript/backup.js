(function() {

  //jQuery equivelent to window.onload = function{}
  //code in here wont run until page loads
  $(function() {


    function buildTable(CharactersObject) {
      //Build an array containing Customer records.
      var characters = CharactersObject.data.results;
      console.log(characters[0]);

      // let heroRows = ''
      // for (hero of heroes) {
      //   let heroRow = `
      //     <tr>
      //       <td>
      //         <a class="heroProfile" id="${hero.id}">${name}</a>
      //         <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}">
      //       </td>
      //     </tr>`
      //   heroRows += heroRow
      //
      //   $('#' + hero.id).click(function() {
      //
      //     $.get(`http://wwhatev.marbel.com/api./getindivchar?id=${hero.id}`)
      //       .done(function(data) {
      //         hideTable()
      //         showProfile()
      //       })
      //   })
      // }
      // $('#dvTable').html(heroRows)

      //Create a HTML Table element.
      var table = $("<table />");
      table[0].border = "1";

      // Add column headers
      row = $(table[0].insertRow(-1));

      var header1 = $("<td />");
      header1.html("Character Name");
      row.append(header1);
      var header2 = $("<td />");
      header2.html("Character Name");
      row.append(header2);

      //Add the data rows.
      for (var i = 0; i < characters.length; i++) {
        row = $(table[0].insertRow(-1));

        var cell1 = $("<td />");
        cell1.html(characters[i].name);
        row.append(cell1);
        var cell2 = $("<td />");
        var imageString = characters[i].thumbnail.path + "." + characters[i].thumbnail.extension;
        var cellString = "<img src=\"" + imageString + "\" border=3 height=300 width=400></img>";
        cell2.html(cellString);
        row.append(cell2);
      }

      var dvTable = $("#dvTable");
      dvTable.html("");
      dvTable.append(table);
    };

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


    //call the api for the first time and store into variable called result
    let result = initCharacters();

    //use the done promise on result to build the table
    result.done(function(data) {
      buildTable(data)
    });

    $("#searchbutton").click(function(e) {
      e.preventDefault();
      let searchText = $('#save-me').val(); // capture answer from box
      console.log(searchText);
      var characterSearchString = "http://gateway.marvel.com/v1/public/characters?ts=1&apikey=70192f833372c4bf90536c073f57817a&hash=428fbcd16d2262d0cf696698994796d9&nameStartsWith=" + searchText;
      let characterSet = getCharacters(characterSearchString);
      //use the done promise on characterSet to build the table
      characterSet.done(function(data) {
        buildTable(data);
      });


    })


  })

})();
