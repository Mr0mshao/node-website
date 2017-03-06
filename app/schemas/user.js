var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10 ;//密码加盐
var UserSchema = new mongoose.Schema({
	name : {
		unique : true,
		type : String 
	},
	password : String,
	role : {
		type : Number,
		default : 0
	},
	meta : {
		createAt : { type : Date, default : Date.now()},
		updateAt : { type : Date, default : Date.now()}
	}
});
//密码加盐处理
UserSchema.pre('save', function(next){
	var user = this;
	if( this.isNew ){
		this.meta.createAt = this.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if(err) return next(err)
			bcrypt.hash(user.password,salt,function(err,hash){
				if(err) next(err)
					user.password=hash
				next()
			})
	})
});
// 实例方法
//密码匹配
UserSchema.methods = {
	comparePassword:function(_password, callback){
		bcrypt.compare(_password, this.password, function(err,isMatch){
			if(err) return callback(err)
			callback(null,isMatch)
		})
	}
};
//静态方法
UserSchema.statics = {
	fetch : function( callback ){
		return this
				.find({})
				.sort('meta.updateAt')
				.exec( callback )

	},
	findById : function(id, callback){
		return this
				.findOne({ _id : id })
				.exec(callback)
	}
};
module.exports = UserSchema;