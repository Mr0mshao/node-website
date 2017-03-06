var mongoose = require('mongoose')
var Category = mongoose.model('Category')
//admin new
exports.new = function(req, res){
	res.render('category_admin', {
	    title: 'imooc 后台分类录入页',
	    category: {}
	});
};
//admin post movie 
exports.save = function(req, res){
	var _category = req.body.category;
	var category= new Category(_category);
		category.save( function(err, movie){
			if( err ){ console.log( err )}
			res.redirect('/admin/category/list');
		});
};
//list
exports.list = function(req, res){
	Category.fetch( function(err, _catetories){
		if( err ) { console.log( err) } 
		res.render('categorylist',{
			title : '电影类别列表页',
			catetories : _catetories
		});
	});	
};
// 删除
exports.del = function(req, res){
	var id= req.query.id;
	if( id ){
		Category.remove( { _id : id }, function(err, category){
			if( err ){ 
				console.log(err); 
				res.json({success : 0});
			}else{
				res.json({success : 1});
			}
		});
	}
};