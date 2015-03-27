// hide buttons
$("#retry").hide()
$("#results").hide()

$(function() {

  // sanity check
  console.log("dom is ready!");

  // event handler for form submission
  $('#post-form').on('submit', function(event){
    $("#results").hide()
    value = $('input[name="image_url"]').val();
    $.ajax({
      type: "POST",
      url: "/v1/ocr",
      contentType: "application/json",
      dataType: "json",
      data : JSON.stringify({ "image_url" : value }),
      success: function(result) {
        console.log(result);
        $("#post-form").hide()
        $("#post-form-multi").hide()
        $("#retry").show()
        $("#results").show()
        $("#results").html("<h3>Image</h3><img src="+
          value+" style='max-width: 400px;'><br><h3>Results</h3><div class='well'>"+
          result["output"]+"</div>");
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  // event handler for multi-image form submission
  $('#post-form-multi').on('submit', function(event){
      $("results").hide()
      value = $('textarea[name="image_urls"]').val().split("\n");
      $.ajax({
          type: "POST",
          url: "v1/ocr_multi",
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify({ "image_urls" : value }),
          success: function(result) {
              console.log(result);
              $("#post-form").hide()
              $("#post-form-multi").hide()
              $("#retry").show()
              $("#results").show()
              var res = "";
              for (i=0; i<value.length; i++) {
                  res = res.concat("<img src="+
                    value[i]+" style='max-width: 400px;'><br><h3>Results</h3><div class='well'>"+
                    result["output"][i]+"</div>\n");
              };
              $("#results").html(res);
          },
          error: function(error) {
              console.log(error);
          }
      });
  });

  // Start search over, clear all existing inputs & results
  $('#retry').on('click', function(){
    $("input").val('').show();
    $("#post-form").show()
    $("#post-form-multi").show()
    $("#retry").hide()
    $('#results').html('');
  });


});
