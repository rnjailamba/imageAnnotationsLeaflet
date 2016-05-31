  // Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
var previewNode = document.querySelector("#template");
previewNode.id = "";
var previewTemplate = previewNode.parentNode.innerHTML;
previewNode.parentNode.removeChild(previewNode);

var preSignedURL = function(){
   var url = $(".presignedurl").text();
   return url;
}


var myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
  url: "will_be_set_dynamically",
  thumbnailHeight: 80,
  parallelUploads: 20,
  previewTemplate: previewTemplate,
  autoQueue: true, // Make sure the files aren't queued until manually added
  previewsContainer: "#previews", // Define the container to display the previews
  acceptedMimeTypes: "image/bmp,image/gif,image/jpg,image/jpeg,image/png",
  headers: {'Content-Type': 'image;charset=UTF-8'},
  method: 'put',
  maxFilesize: 2,
        maxFiles: 3,

  init: function() {
      this.on("processing", function(file) {
            console.log("new url here");
              $.ajax({
                  url:"/imageUploadAPI/getImageURL",
                  type: 'POST',
                  async: false,
                  data: '',
                  dataType: "text",
                  context: this,
                  cache: false,
                  processData: false,
                  success: function(response) {
                    console.log('S3 url retrieval successs!',response);
                        this.options.url = response;
                  },
                  error: function(response) {
                    console.log('Error with S3 upload: ' + response.statusText);
                  }
              });
      });
      this.on("queuecomplete", function (file) {
//          console.log(myDropzone.getFilesWithStatus(Dropzone.ADDED));

//        alert("All files have uploaded ");
      });
      //Max size exceeded so automatically remove
      this.on("error", function(file, message) {
             alert(message);
             this.removeFile(file);
      });
  },
  sending: function(file, xhr) {
    var _send = xhr.send;
    xhr.send = function() {
      _send.call(xhr, file);
    };
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
//            alert(xhr.responseURL);
        }
    }
  },
  clickable: ".fileinput-button" // Define the element that should be used as click trigger to select files.

});


myDropzone.on("addedfile", function(file) {
  // Hookup the start button  
  file.previewElement.querySelector(".start").onclick = function() { myDropzone.enqueueFile(file); };
});

// Update the total progress bar
myDropzone.on("totaluploadprogress", function(progress) {
  document.querySelector("#total-progress .progress-bar").style.width = progress + "%";
});

myDropzone.on("sending", function(file) {
  // Show the total progress bar when upload starts
  document.querySelector("#total-progress").style.opacity = "1";
  // And disable the start button
  console.log(file);
  file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");

});

// Hide the total progress bar when nothing's uploading anymore
myDropzone.on("queuecomplete", function(progress) {
  document.querySelector("#total-progress").style.opacity = "0";
  console.log(myDropzone.files);

  var text = "";
  var i;
  for (i = 0; i < myDropzone.files.length; i++) {
      text += myDropzone.files[i].xhr.responseURL;
      lastUrl = myDropzone.files[i].xhr.responseURL;
  }
  
  if (typeof addImagesToSortable != "undefined") { 
    // safe to use the function
    addImagesToSortable(lastUrl);

  }

});

// Setup the buttons for all transfers
// The "add files" button doesn't need to be setup because the config
// `clickable` has already been specified.
document.querySelector("#actions .start").onclick = function() {
  myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
};
document.querySelector("#actions .cancel").onclick = function() {
  myDropzone.removeAllFiles(true);
};