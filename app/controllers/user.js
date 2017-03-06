var User = require('../models/user.js');
//User  注册
exports.signup = function(req,res){
	var _user = req.body.user;
	// url（params）>body>query
	// 用户名重复检测
	User.findOne({name:_user.name},function(err,user){
		if(err){console.log(err)}
		if( user ){ 
			return res.redirect('/signin');
		}else{
			var user = new User(_user);
			user.save(function(err,user){
				if(err) { console.log(err)}
				req.session.user = user;
				console.log(user);
				res.redirect('/');
			});
		}
	})
};
//sigin 登录
exports.signin = function(req,res){
	var _user = req.body.user;
	User.findOne({name:_user.name},function(err,user){
		if(err){console.log(err)}
		if( !user ){ 
			console.log('没有此帐号');
			return res.redirect('/signup');
		}
		user.comparePassword(_user.password,function(err,isMatch){
			if(err){console.log(err)}
			if(isMatch){
				console.log('Password is matched !!!');
				req.session.user = user;
				return res.redirect('/')
			}else{
				console.log('Password is not matched !!!')
				return res.redirect('/signin')
			}
		});
		
	})
};
// 登录
exports.showSignin = function(req,res){
	res.render('signin',{
		title : '登录页面'
	});
};
// 注册
exports.showSignup = function(req,res){
	res.render('signup',{
		title : '注册页面'
	});
};
// 注销
exports.logout = function(req, res){
	delete req.session.user;
	// delete app.locals.user;
	res.redirect('/');
};
//userlist 
exports.list = function(req, res){
	User.fetch(function(err, users){
 		if (err) { console.log(err) }
 		res.render('userlist',{
 			title:'用户列表',
 			users:users
 		})
 	})
};

// 删除
exports.del = function(req, res){
	var id= req.query.id;
	console.log(id);
	if( id ){
		User.remove( { _id : id }, function(err, user){
			if( err ){ 
				console.log(err); 
				res.json({success : 0});
			}else{
				res.json({success : 1});
			}
		});
	}
};
exports.signinRequired = function (req, res, next) {
	var _user = req.session.user;
	if( !_user ) {
		return res.redirect('/signin');
	}
	next()
};
exports.adminRequired = function (req, res, next) {
	var _user = req.session.user;
	if( _user.role <= 10 ) {
		return res.redirect('/signin');
	}
	next()
}