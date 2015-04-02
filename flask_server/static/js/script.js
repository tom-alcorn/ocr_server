// hide buttons
$("#retry").hide()
$("#results").hide()

$(function() {

  // sanity check
  console.log("dom is ready!");

  // event handler for multi-image form submission
  $('#post-form').on('submit', function(event){
      $("results").hide()
      value = $('textarea[name="image_urls"]').val().split("\n")
      $.ajax({
          type: "POST",
          url: "v1/ocr",
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify({ "image_urls" : value }),
          success: function(result) {
              console.log(result);
              $("#post-form").hide()
              $("#post-form-kw").hide()
              $("#retry").show()
              $("#results").show()
              var res = ""
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

  // event handler for multi-image form submission
  $('#post-form-kw').on('submit', function(event){
      $("results").hide()
      keywords = $('textarea[name="keywords"]').val().split("\n")
      image_urls = $('textarea[name="image_urls_kw"]').val().split("\n")
      console.log(keywords)
      console.log(image_urls)
      $.ajax({
          type: "POST",
          url: "v1/ocr_kw",
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify({ "image_urls" : image_urls,
                                 "keywords": keywords }),
          success: function(result) {
              console.log(result)
              $("#post-form").hide()
              $("#post-form-kw").hide()
              $("#retry").show()
              $("#results").show()
              var res = ""
              var text;
              for (i=0; i<image_urls.length; i++) {
                  text = result["output"][i]
                  if (result["contains_kw"][text]) {
                      res = res.concat("<img src="+image_urls[i]+
                        " style='max-width: 400px;'><br><h3>Results</h3><div class='well'>"+
                        text+"</div>\n")
                }
              }
              $("#results").html(res)
          },
          error: function(error) {
              console.log(error)
          }
      });
  });

  // Start search over, clear all existing inputs & results
  $('#retry').on('click', function(){
    $("input").val('').show()
    $("#post-form").show()
    $("#post-form-kw").show()
    $("#retry").hide()
    $('#results').html('')
  });


});
