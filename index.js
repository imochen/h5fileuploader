var express = require('express'),
	app = express(),

	port = process.env.port || 1103 ;


//相关设置
app.set('views', __dirname + '/views'); //模板目录
app.set('view engine','ejs'); //模板引擎
app.use('/static', express.static( __dirname + '/static')); //静态目录

app.get('/',function( req , res ){
	res.render('index');
});

//上传路由
app.post('/upload',function( req , res ){
	
	var fs = require('fs'),
		formidable = require('formidable'),
		form = new formidable.IncomingForm();

	form.uploadDir = __dirname + '/temp';

	form.parse( req , function( err , fields , files){


		for( var name in files ){

			var _file = files[name],
				id = _file.name.replace('.',''),
				path_old = _file.path,
				matches = _file.type.match(/image\/(jpeg|gif|png)/),
				path_new;

			if( !matches ){
				fs.unlink( path_old );
				res.end('不支持的文件类型');
			}else{
				var postfix = (matches[1] === 'jpeg' ? 'jpg' : matches[1]);
				path_new = path_old + '.' + postfix;

				fs.rename( path_old , path_new , function( err ){
					if( !err ){
						res.end('上传成功');
					}
				});
			}
		}

	});

	

});




if( !module.parent ){
	app.listen( port );
	console.log('Express started on port ' + port );
}

