$("#clear").on("click", function () {
    $.ajax({
        type: "GET",
        url: "/delete"
    }).then(function (response) {
        console.log(response);
        // location.reload();
        window.location.href = "/all";
    });
});

$("#scrape").on("click", function (event) {
    event.preventDefault();
    console.log("scrape is clicking");

    $.ajax({
        type: "GET",
        url: "/scrape"
    }).then(function (response) {
        console.log("ajax scrape call");
        console.log(response);
        // location.reload();
        window.location.href = "/all";

    });
});

$("#save").off().on("click", function (event) {
    event.preventDefault();
    console.log("save is clicking");
    $.ajax({
        type: "GET",
        url: "/savedarticles"
    }).then(function (response) {
        console.log("ajax saved articles call");
        // location.reload();
        window.location.href = "/savedarticles";
    });
});

$(".like").off().on("click", function (event) {
    event.preventDefault();
    var id = $(this).data("id");
    console.log("Id of clicked like button is:" + id);
    console.log("liked");
    $.ajax({
        type: "POST",
        url: "/saved/" + id
    }).then(function (response) {
        console.log("Post request returned(in app.js file).")
    });
});

// $(".comment").on("click", function (event) {
//     event.preventDefault();
//     console.log()
//     var id = $(this).data("id");
//     console.log("id is " +id);
//     $(id).removeClass("comment-form-class");
// });

$(".comment").off().on("click", function(event){
    event.preventDefault();
    $("#commentsection").empty();
    var id = $(this).data("id");
    console.log("id of clicked comment is: "+id);
    $.ajax({
        type: "GET",
        url: "/articlecomments/"+id
    }).then(function(response){
        console.log(response);
        $("#commentsection").append("<div>"+response.title+"</div>");
        $("#commentsection").append("<div><form><textarea id='bodyinput' name='body'></textarea><button data-id='" + id + "' id='savecomment'>Save Comment</button></form></div>");
        if(response.comments.length){
            for(var i=0; i <response.comments.length; i++){
                $("#commentsection").append("<div>Previous Comments:</div>");
                $("#commentsection").append("<div>"+response.comments[i]+"</div>");
            }
        }
        // $("#commentsection").append("<button data-id='" + id + "' id='savecomment'>Save Comment</button>");
    });    
});

$(document).off().on("click","#savecomment", function(event){
    event.preventDefault();
    var id = $(this).attr("data-id");
    console.log("ID of save button: "+id);
    console.log("Comment: "+$("#bodyinput").val().trim());
    $.ajax({
        type: "POST",
        url: "/postcomment/"+id,
        data: {
            comment: $("#bodyinput").val().trim()
        }
    }).then(function(response){
        alert("Comment Posted!");
    });
});