// Grab the articles as a json
$(document).on("click", "#scrapeStarter", function() {
  $.ajax({
    method: "GET",
    url: "/scrape",
  })
  // For each one
  //   for (var i = 0; i < data.length; i++) {
  //     // Display the apropos information on the page
  //     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  //   }
  // });
  
  .then(function(data){
    $.getJSON("/articles", function(data) {
      $("#article-section2").empty()
      $("#article-section").empty()
      var dbArticle = data.slice(0,20)
      $.each(dbArticle, function(i, element ) {
        // console.log(element)
        $a = $("<a>").attr("href",element.link).text(element.title)
        $h3 = $("<h3>").append($a)
        $p = $("<p>").text(element.des).addClass("text-justify")
        $button2 = $("<button>").addClass("btn btn-success saveArticleBtn").attr("data-id",element._id).text("Save Article")
        $button1 = $("<button>").addClass("openNotesButton btn btn-primary").text("Create Note").attr("data-target", "#notesModal").attr("id",element._id).attr("type","button").attr("data-toggle","modal")
        
        if (element.saved == false) {
          $li = $("<li>").addClass('list-group-item articleHeadline').append($h3).append($p).append($button1).append($button2)
          $("#article-section2").append($li)
        }
        else {
          $li = $("<li>").addClass('list-group-item articleHeadline').append($h3).append($p).append($button1)
          $("#article-section").append($li)
        }
      })
      
    })
  })
})


$(document).on("click", ".saveArticleBtn", function() {
  var ID = $(this).attr("data-id")
  $.ajax({
    method: "POST",
    url: "/saved/" + ID,
  }).then(function(data) {
    console.log(data)
    alert("Article saved!")
  })
})

// Whenever someone clicks a p tag
$(document).on("click", ".openNotesButton", function() {
  // Empty the notes from the note section
  $("#savedNotes").empty();
  $("#notesModalTitle").empty();
  $(".modal-footer").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  // With that done, add the note information to the page
  .then(function(data) {

    console.log(data);
    // The title of the article
    $("#notesModalTitle").append("Notes for Article: " + data._id);
    // An input to enter a new title
    $("#savedNotes").append("<p>New Note Title</p>")
    $("#savedNotes").append("<input id='titleInput' name='title' ></input>");
    // A textarea to add a new note body
    $("#savedNotes").append("<p>New Note</p>")
    $("#savedNotes").append("<textarea id='bodyInput' name='body'></textarea>");
    $(".modal-footer").append("<button class='btn btn-primary' data-id='" + data._id + "' id='savenote'>Save Note</button>").append('<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>')
    if (data.note){    
      $.each(data.note, function(i, element ) {
        console.log(element)
        $h5 = $("<h5>").text(element.title)
        $p = $("<p>").text(element.body)
        $("#savedNotes").append($("<hr>")).append($h5).append($p)
        $("#savedNotes").append("<button class='btn btn-warning btn-small deleteNoteBtn' data-id='" + element._id + "' id='savenote'>Delete Note</button>")
      })
    }
    // A button to submit a new note, with the id of the article saved to it
    
    // If there's a note in the article
    // if (data.note) {
    //   // Place the title of the note in the title input
    //   $("#titleinput").val(data.note.title);
    //   // Place the body of the note in the body textarea
    //   $("#bodyinput").val(data.note.body);
    // }
  });
});
$(document).on("click", ".deleteNoteBtn", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/notes/" + thisId
  }).then(function(data) {
    alert("Note deleted!")
  })
})



// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log(thisId)
  
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleInput").val(),
      // Value taken from note textarea
      body: $("#bodyInput").val()
    }
  })
  // With that done
  .then(function(data) {
    // Log the response
    console.log(data);
    // Empty the notes section
    $("#notes").empty();
  });
  
  // Also, remove the values entered in the input and textarea for note entry
  $("#titleText").val("");
  $("#notesText").val("");
});


$(document).on("click", "#databaseClear", function() {
  $.ajax({
    method: "DELETE",
    url: "/articles",
  }).then(function(data) {
    alert("All unsaved articles cleared!")
  })
})