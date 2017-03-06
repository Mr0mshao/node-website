var Movie = require('../app/controllers/movie.js');
var User = require('../app/controllers/user.js');
var Index = require('../app/controllers/index.js');
var Comment = require('../app/controllers/comment.js');
var Category = require('../app/controllers/category.js');
module.exports = function(app){
	//预处理session
	app.use(function(req,res,next){
		var _user = req.session.user;
		app.locals.user = _user;
		next()
	});
	//index
	app.get('/' , Index.index);
	//movie
	 app.get('/movie/:id' , Movie.detail);
	 app.get('/admin/movie/new' , User.signinRequired, User.adminRequired,Movie.new);
	 app.get('/admin/movie/update/:id',User.signinRequired, User.adminRequired,Movie.update);
	 app.post('/admin/movie',User.signinRequired, User.adminRequired, Movie.savePoster,Movie.save);
	 app.get('/admin/movie/list', User.signinRequired, User.adminRequired,Movie.list);
     app.delete('/admin/movie/list',User.signinRequired, User.adminRequired, Movie.del);
	//User
	app.post('/user/signup', User.signup);
	app.post('/user/signin', User.signin);
	app.get('/signin', User.showSignin);
	app.get('/signup', User.showSignup);
	app.get('/logout', User.logout);
	app.get('/admin/user/list',User.signinRequired, User.adminRequired, User.list);
	app.delete('/admin/user/list',User.signinRequired, User.adminRequired, User.del);
	// Comment
	app.post('/user/comment',User.signinRequired , Comment.save);
	  // Category
	app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
	app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
	app.delete('/admin/category/list', User.signinRequired, User.adminRequired, Category.del);

	// results
	app.get('/results', Index.search);
	// 404 page
	app.get('*', function(req, res){
		res.render('404-notFind',{
			title : 'Not Find !'
		});
	});

};





