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

passport.use('local',new LocalStrategy({passReqToCallback:true},function(req,username,password,done){
	Admin.findOne({'email':username},function(err,user){
		if(err) throw err;
		if(!user){
			console.log('User not Find!');
			return done(null,false,{message:'Usuario no encontrado'});
		}
		Admin.comparePassword(password,user.password,function(err,isMatch){
			if(err) throw err;
			if(isMatch){
				return done(null,user);
			}else{
				console.log('Invalid password');
				return done(null,false,{message:'Contraseña incorrecta'});
			}
		});
	});
}));

/* GET users listing. */
router.get('/', function(req, res, next) {
	
 	res.json({message:'Root'})
});

router.post('/newAdmin',function(req,res){
	var admi=new Admin({
		name:req.body.name,
		email:req.body.email,
		category:req.body.category,
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
	if(req.isAuthenticated()){

	}else{
		res.redirect('/user')
	}
});



//obtain user data: req.user
module.exports = router;
