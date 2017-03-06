var mongoose = require('mongoose')
var Movie = require('../models/movie.js');
var Category = require('../models/category.js');
var Comment = require('../models/comment.js');
var _ = require('underscore');
var fs = require('fs')
var path = require('path')
//detail
exports.detail = function(req, res){
	var id = req.params.id;
	Movie.update( {_id:id} , {$inc : {pv:1}}, function(err){
		if(err){console.log(err)}
	});
	Movie.findById(id, function(err, _movie){
		Comment
		.find({ movie:id })
		.populate('from', 'name')
		.populate('reply.from reply.to', 'name')
		.exec(function(err,_comments) {
			console.log(_comments);
			res.render('detail',{
				title : '电影详情' + _movie.title,
				movie : _movie,
				comments : _comments
			});
		})
	});	
};
//admin new
exports.new = function(req, res){
	Category.find({},function(err,_categories) {
		res.render('admin',{
			title : '后台录入页',
			categories : _categories,
			movie: {}
		});
	})
};
//admin update
exports.update = function(req, res){
	var id = req.params.id;
	if( id ) {
		Movie.findById( id, function(err, _movie){
			Category.find( {}, function(err,_categories){
				res.render('admin', {
					title : '后台更新页',
					movie : _movie,
					categories : _categories
				});	
			})
		});
	}
};
//psoter
exports.savePoster = function(req,res,next){
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path;
	var originalFilename = posterData.originalFilename;
	if(originalFilename) {
		fs.readFile(filePath, function(err,data){
			var timestamp = Date.now();
			var type = posterData.type.split('/')[1];
			var poster = timestamp+'.'+type;
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);
			fs.writeFile(newPath, data, function(err) {
		        req.poster = poster;
		        next();
		    })
		});
	}else{
		next()
	}
}

//admin post movie 
exports.save = function(req, res){
	var movieObj = req.body.movie ;
	var id = movieObj._id;
	var _movie;
	if (req.poster) {
	    movieObj.poster = req.poster;
	}
	if(id){
		Movie.findById(id, function(err, movie){
			if( err ){ console.log( err )}
			_movie = _.extend(movie, movieObj);
			_movie.save(function(err, movie){
				if( err ) {console.log( err )}
				res.redirect('/movie/' + movie._id );
			});
		});
	}else{
		_movie = new Movie( movieObj);
		var categoryId = movieObj.category;
		var categoryName = movieObj.categoryName;
		_movie.save( function(err, movie){
			if(err){ console.log(err)}
			if(categoryId){
				Category.findById( categoryId, function(err,category){
					category.movies.push(movie._id);
					category.save(function(err, category) {
						if( err ) { console.log(err) }
			            res.redirect('/movie/' + movie._id)
			        });
				});

			}else if( categoryName ){
				var category = new Category({
					name: categoryName,
          			movies: [movie._id]
				});
				category.save(function(err, category) {
					movie.category = category._id
					movie.save(function(err, movie) {
						res.redirect('/movie/' + movie._id)
					})
		        })
			}
		});
	}
};
//list
exports.list = function(req, res){
	Movie
	.find({})
	.populate('category','name')
	.exec(function(err, _movies){
		if( err ) { console.log( err) } 
		res.render('list',{
			title : '电影列表',
			movies : _movies
		});
	});	
};
// 删除
exports.del = function(req, res){
	var id= req.query.id;
	if( id ){
		Movie.remove( { _id : id }, function(err, movie){
			if( err ){ 
				console.log(err); 
				res.json({success : 0});
			}else{
				res.json({success : 1});
			}
		});
	}
};