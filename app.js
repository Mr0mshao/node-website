var express = require('express');
var path = require('path');
var port = process.env.POTR || 3000;
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var multiparty = require('multiparty');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var morgan = require('morgan'); //logger模块的这个新名字真是神奇
var mongoStore = require('connect-mongo')(session);
// var serveStatic = require('serve-static');
var app = express();
var dburl = 'mongodb://127.0.0.1:27017/imooc';
//连接数据库     imooc数据库名
var db = mongoose.connect('mongodb://127.0.0.1:27017/imooc');
db.connection.on('error', function( err ){ 
	console.log("failed to connect :"+err)
});
db.connection.on('open', function(){ 
	console.log("successed to connect mongodb")
});

app.set( 'views', './app/views/pages');
app.set( 'view engine','jade');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret : 'imooc',
	store : new mongoStore({
		url : dburl,
		collection : 'sessions'
	})
}));
app.use(bodyParser.urlencoded({ extended: true }));//
app.use(express.static(path.join(__dirname, 'public')));//静态资源
app.use(favicon(__dirname +'/public/favicon.ico'));//favicon
app.use(require('connect-multiparty')());
app.locals.moment = require('moment');
app.listen( port );

//开发环境
var env = process.env.NODE_ENV || 'development';
if( 'development' == env ){
	app.set('showStackError',true);
	app.use(morgan(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug',true);
}

require('./config/routes.js')(app);
console.log(__dirname);
console.log('this server is start at port:' + port);
