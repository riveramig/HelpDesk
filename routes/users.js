var express = require('express');
var router = express.Router();
var passport = require('passport');
var Admin = require('../models/admin');
var LocalStrategy = require('passport-local').Strategy;



passport.serializeUser(function(user,done){
	done(null,user._id);
});

passport.deserializeUser(function(id,done){
	Admin.findById(id,function(err,user){
		done(err,user);
	});
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  
});

router.post('/newAdmin',function(req,res){
	var admi=new Admin({
		name:req.body.name,
		email:req.body.email,
		password:req.body.password
	});
	Admin.findOne({'email':req.body.email},function(err,user){
		if(err) throw err;
		if(user){
			res.json({message:'El email ya se encuentra en uso'});
		}else{
			admi.save(function(err){
				if(err) throw err;
				res.json({message:'admin Creado'});
			});
		} 
	});
});

router.post('/login',passport.authenticate('local',{
	successRedirect:'/users/dashboard',
	failureRedirect: '/users',
	failureFlash:true
}));

router.get('/dashboard',function(req,res){
	if(!req.user){
		res.json({message:'you are not authenticated'});
	}else{
		res.json({message:'user: '+req.user.name});
	}
});

module.exports = router;
