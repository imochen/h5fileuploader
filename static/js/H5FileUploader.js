(function( root , factory ){

	if( typeof define === 'function' && define.amd ){
		//AMD
		define( factory );
	}else if(  typeof exports === 'object' ){
		//CommonJS Nodejs
		module.exports = factory();
	}else{
		// add to window
		root.h5fileuploader = factory();
	}

})( window , function(){

	'use strict';

	var noop = function(){},

		console = window.console || { log : noop };

	function Uploader( options ){
		
		if( typeof options.debug === 'undefined'){
			this.debug =  true;
		}else{
			this.debug =  options.debug;
		}
		//调试模式，默认开启。

		this.uploadUrl = options.uploadUrl ; //POST地址

		this.data = options.data || {}; //文件上传自定义字段
		this.key = options.key || 'file'; //文件标识

		this.dropContainer = options.dropContainer , //拖拽容器
		this.fileInput =  options.fileInput, //input file

		this.maxActiveNumber = options.maxActiveNumber || 1 ; //允许同时上传文件个数，默认为1。0为不限制。
		this.activeUpload = 0; //当前正在上传的数量

		this.dragenter = options.dragenter || noop; //拖拽进入
		this.dragover = options.dragover || noop; //拖拽over
		this.dragleave = options.dragleave || noop; //拖拽离开
		this.drop = options.drop || noop; //拖拽放下

		this.readFiles = options.readFiles || noop; //读取所有文件
		this.fileAdd = options.fileAdd || noop; //文件添加到上传队列事件

		this.uploadsQueue = []; //上传队列
		
		this.init();
	}

	function FileUpload( file ){

		var self = this;

		self.file = file;
		self.fileName = file.name ;
		self.fileSize = file.size ;
		self.uploadSize = file.size ;
		self.uploadedBytes = 0 ;
		self.eventHandlers = {};

		self.events = {

			onProgress : function( fileSize , uploadedBytes ){
				var progress = uploadedBytes/fileSize*100;
				( self.eventHandlers.onProgress || noop )( progress , fileSize , uploadedBytes );
			},

			onStart : function(){
				( self.eventHandlers.onStart || noop )();
			},

			onCompleted : function( data ){
				file = null;
				( self.eventHandlers.onCompleted || noop )( data );
			}

		}

	}
	FileUpload.prototype = {
        on: function ( eventHandlers ) {
            this.eventHandlers = eventHandlers;
        }
    };

	Uploader.prototype = {

		init : function(){

			var self = this;

			self.debug && console.log('H5FileUploader : 初始化中...');

			var dropContainer = self.dropContainer,
				fileInput = self.fileInput,

				cancelEvent = function( e ){
					e.preventDefault();
                    e.stopPropagation();
				};

			if( dropContainer ){
				self.on( dropContainer , 'dragenter' , function(){
					self.dragenter();
				});
				self.on( dropContainer , 'dragover' , function( e ){
					self.dragover();
					cancelEvent(e);
				});
				self.on( dropContainer , 'dragleave' , function(){
					self.dragleave();
				});
				self.on( dropContainer , 'drop' , function (e) {
                    self.drop();
                    self.processFiles( e.dataTransfer.files );
                    cancelEvent(e);
                });
                self.debug && console.log('H5FileUploader : 拖拽事件绑定完毕');
			}
			if( fileInput ){
				self.on( fileInput , 'change', function () {
                    self.processFiles( this.files );
                });
                self.debug && console.log('H5FileUploader : input file事件绑定完毕');
			}

		},

		processFiles : function( files ){

			var self = this,
				len = files.length,
				i = 0;

			self.debug && console.log('H5FileUploader : 文件读取成功，数量：' + files.length );
			self.readFiles( files );

			for( ; i < len ; i++ ){
				var file = files[i];
				if( file.size === 0 ){
					self.debug && console.log('H5FileUploader : 发现空文件 ： ' + files.name );
				}else{
					self.uploadFile( new FileUpload(file) );
				}
			}
		},

		uploadFile : function( upload ){

			var self = this;

			self.fileAdd( upload );

			if( self.activeUpload === self.maxActiveNumber ){
				self.debug && console.log('H5FileUploader : ' + upload.fileName + ' 添加到上传队列');
				self.uploadsQueue.push( upload );
			}else{
				self.ajaxUpload( upload );
			}

		},

		ajaxUpload : function( upload ){

			var XHR , formData , fileName,
				self = this, 
				data = self.data,
				file = upload.file,
				key = self.key;

			self.activeUpload += 1;

			XHR = new window.XMLHttpRequest();
			formData = new window.FormData();
			fileName = upload.fileName;

			XHR.open('POST', self.uploadUrl );

			XHR.upload.onloadstart = function(){
				upload.events.onStart();
				self.debug && console.log('H5FileUploader : ' + upload.fileName + ' 开始上传');
			};

			XHR.upload.onprogress = function (event) {
                if (!event.lengthComputable) {
                    return;
                }
                upload.events.onProgress(event.total, event.loaded);
				self.debug && console.log('H5FileUploader : ' + upload.fileName + ' ' + event.loaded + '/' + event.total );

            };

            XHR.onload = function (event) {

                self.activeUpload -= 1;

                self.debug && console.log('H5FileUploader : ' + upload.fileName + ' 上传完成');

                upload.events.onCompleted( event.target.responseText );

                if( self.uploadsQueue.length ){
                	self.ajaxUpload( self.uploadsQueue.shift() );
                }
            };
            XHR.onerror = function () {
               self.debug && console.log('H5FileUploader : ' + upload.fileName + ' 上传失败');
            };

            if ( data ) {
                for (prop in data) {
                    if ( data.hasOwnProperty(prop) ) {
                        formData.append( prop , data[prop] );
                    }
                }
            }

            formData.append(key, file);

            XHR.send(formData);

		},

		on : function( element , name , handler ){

			if( !element ) { 
				return false; 
			}

			if( element.addEventListener ){

				element.addEventListener( name , handler , false );

			}else if( element.attachEvent ){

				element.attachEvent('on' + name , handler);

			}else{

				element['on' + name] = handler;

			}
		}
	}


	function H5FileUploader( options ){
		return new Uploader( options );
	}

	return H5FileUploader;

})