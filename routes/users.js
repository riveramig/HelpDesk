var express = require('express');
var router = express.Router();
var passport = require('passport');
var Admin = require('../models/admin');
var Ticket= require('../models/ticket');
var Category = require('../models/category');
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
 	res.render('login');
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
		res.render('dashboard',{usuario:req.user.name});
	}else{
		res.redirect('/users');
	}
});

router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/users');
});

//----------------------------------------------> Tickets routes

router.get('/getTickets',function(req,res){
	if(req.isAuthenticated()){
		Admin.findOne({_id:req.user._id},'tickets')
		.populate('tickets')
		.exec((err,doc)=>{
			if(err) throw err;
			res.json(doc);
		});
	}else{
		res.json({message:'No se encuentra autenticado'});
	}
});

router.get('/getAliveTickets',function(req,res){
	if(req.isAuthenticated()){
		Admin.findOne({_id:req.user._id},'tickets')
		.populate({path:'tickets',match:{isAlive:true}})
		.exec((err,doc)=>{
			if(err) throw err;
			res.json(doc);
		});
	}else{
		res.json({message:'No se encuentra autenticado'});
	}
});

//----------------------------------------------> Categories routes

router.post('/createCategory',function(req,res){
	if(req.isAuthenticated()){
		var cate = new Category({
			name:req.body.cateName
		});
		Category.findOne({name:req.body.cateName},function(err,doc){
			if(err) throw err;
			if(doc){
				res.json({message:'La categoria ya se encuentra en la bd'});
			}else{
				cate.save(function(err){
					if(err) throw err;
					console.log('La categoria fue creada');
					res.json({message:'Categoria creada'});
				});
			}
		});
	}else{
		res.json({message:'No se encuentra autenticado'});
	}
});

router.get('/categories',function(req,res){
	Category.find({},function(err,docs){
		if(err) throw err;
		res.json(docs);
	});
});
//obtain user data: req.user
module.exports = router;
