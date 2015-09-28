#H5FileUploader

> a plug-in for html5 file upload

```html
<script src='H5FileUploader.js'></script>
<script>
	h5fileuploader({

		debug : flase, // default value is true . change it to false when release

		uploadUrl : 'url', //the address you post

		data : {}, //add your own fields for your file

		key : 'file', //the key of the file you upload , default value is 'file'

		dropContainer : document.querySelector('.drop'),// the dom that you can drop your file in

		fileInput : document.querySelector('input[type="file"]'), //file input 

		maxActiveNumber : 1, // the max number allowed to be upload at the same time

		dragenter : function(){}, //when you drag file enter the container
		dragover : function(){}, // when you drag move over the container
		dragleave : function(){}, // when you drag leave the container
		drop : function(){}, //when you drop files in the container

		readFiles : function( files ){},  //when files start to be load
		fileAdd : function( fileupload ){ //when a file add to queue,

			fileupload.on({

				onStart : function(){}, // file start to upload

				onProgress : function( progress , fileSize , uploadedBytes ){} // on uploading

				onCompleted : function( res ){} // on upload completed
			})

		} 
	})
</script>
```

