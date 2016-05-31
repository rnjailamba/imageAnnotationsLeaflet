$(document).ready(function () {

    SirTrevor.Blocks.Text.onBlockRender = function() {
      alert('Do something');
    };

    $('.submit').on('click', function(e) {
      e.preventDefault();

      // Skip validaton for now, we're just saving as we're going
      SirTrevor.SKIP_VALIDATION = true;

      // Store the current set of cards
      SirTrevor.onBeforeSubmit();

      // Grab the data
      var json = SirTrevor.getInstance().store.retrieve();
      console.log(json);

      // var imagePath = SirTrevor.getInstance().blocks;
      // var imagePath = SirTrevor.Blocks.Image;
      // console.log(imagePath);


      // Turn validation back on
      SirTrevor.SKIP_VALIDATION = false;

//        $('.output').html(JSON.stringify(json, null, ' '));
      $('.output').text($('.js-st-instance').val());
    });

    // SirTrevor.setDefaults({
    //   uploadUrl: "https://cementifyblogimages.s3-ap-southeast-1.amazonaws.com/1454841932002.jpg?AWSAccessKeyId=AKIAJDTELPCXKB6E3LBQ&Content-Type=image%3Bcharset%3DUTF-8&Expires=1460841932&Signature=S8sgrSI%2FQgmonHYHogye14sRE6o%3D"
    // });
    SirTrevor.EventBus.on('block:create:new', function(){
     console.log("arguments are " ,arguments);
    });

});