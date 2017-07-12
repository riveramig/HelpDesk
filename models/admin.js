var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
var Ticket=require('./ticket');

var AdminSchema=Schema({
	name:{type:String,required:true},
	email:{type:String,required:true},
	password:{type:String,required:true},
	tickets:[{type:String}]
});

AdminSchema.pre('save',function(next){
	var user=this;
	if(!user.isModified('password')) return next();
	bcrypt.hash(user.password,null,null,function(err,hash){
		if(err) return next(err);
		user.password=hash;
		next();
	});
});

module.exports=mongoose.model('Admin',AdminSchema);


module.exports.comparePassword=function(candidatePass,hash,callback){
	bcrypt.compare(candidatePass,hash,function(err,isMatch){
		if(err) throw err;
		callback(null,isMatch);
	});
}