#H5FileUploader

> a plug-in for html5 file upload

####test

down load the folder test 

use `npm install` to install nodejs packages

then run `node index.js`

open your broswer , type in `http://127.0.0.1:1103`

####Config 
```html
<script src='H5FileUploader.js'></script>
<script>
	h5fileuploader({

		// default value is true . change it to false when release
		debug : flase, 

		//the address you post
		uploadUrl : 'url', 

		//add your own fields for your file
		data : {}, 

		//the key of the file you upload , default value is 'file'
		key : 'file', 

		// the dom that you can drop your file in
		dropContainer : document.querySelector('.drop'),

		//file input 
		fileInput : document.querySelector('input[type="file"]'), 

		// the max number allowed to be upload at the same time
		maxActiveNumber : 1, 

		//when you drag file enter the container
		dragenter : function(){}, 

		// when you drag move over the container
		dragover : function(){}, 

		// when you drag leave the container
		dragleave : function(){}, 

		//when you drop files in the container
		drop : function(){}, 

		//when files start to be load
		readFiles : function( files ){},  

		//when a file add to queue,
		fileAdd : function( fileupload ){ 

			fileupload.on({

				// file start to upload
				onStart : function(){}, 

				// on uploading
				onProgress : function( progress , fileSize , uploadedBytes ){} 

				// on upload completed
				onCompleted : function( res ){} 

			})

		} 
	})
</script>
```

