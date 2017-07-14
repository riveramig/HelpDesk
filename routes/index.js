var express = require('express');
var Mailjet= require('node-mailjet').connect('d269fb35916cab84fdab2f73c3fcfab3','2389f47ff86dccb50393b17b10e762af');
var router = express.Router();
var Admin = require('../models/admin.js');
var Ticket = require('../models/ticket.js');
var sendEmail= Mailjet.post('send');

/* GET home page. */
router.get('/mesaTi', function(req, res, next) {
  res.render('index');
});

router.post('/sendMailAtach',function(req,resp){
	var str=req.body.file;
	var res=str.split(",");
	tiq=new Ticket({
		name:req.body.name,
		cc:req.body.cc,
		phone:req.body.phone,
		email:req.body.email,
		description:req.body.description,
		isAlive:true,
		tipoFalla:req.body.falla,
		priority:req.body.priority
	});
	tiq.file.contentType=res[0];
	tiq.file.data=res[1];
	tiq.save(function(err){
		if(err) throw err;
		var cursor=Admin.find({category:req.body.falla}).cursor();
		cursor.on('data',function(admin){
			admin.tickets.push(tiq);
			admin.save();
			var emailData;
			emailData={
				'FromEmail': 'practicanteti@independence.com.co',
				'FromName': 'Soporte de TI',
				'Subject': 'Tipo de falla: '+req.body.falla+' Prioridad: '+req.body.priority,
				'Text-part': 'Nombre: '+req.body.name+'\nCC: '+req.body.cc+'\n Email: '+req.body.email+'\n Telefono: '+req.body.phone+'\nDescripcción: '+req.body.description,
				'Recipients': [{'Email': admin.email}],
				'Attachments':[{
					'Content-Type':'text-plain',
					'Filename':'screen.jpg',
					'Content':res[1]
				}]
			}
			sendEmail.request(emailData,function(err){
				if(err) throw err;
				console.log('email Sent');
			});
		});
		cursor.on('close',function(){
			resp.json(tiq._id);
			console.log('Ticked created!'+tiq._id);
		});
	});
});

router.post('/sendMailUnat',function(req,res){
	tiq=new Ticket({
		name:req.body.name,
		cc:req.body.cc,
		phone:req.body.phone,
		email:req.body.email,
		description:req.body.description,
		file:null,
		isAlive:true,
		tipoFalla:req.body.falla,
		priority:req.body.priority
	});
	tiq.save(function(err){
		if(err) throw err;
		var cursor=Admin.find({category:req.body.falla}).cursor();
		cursor.on('data',function(admin){
			admin.tickets.push(tiq);
			admin.save();
			var emailData;
			emailData={
				'FromEmail': 'practicanteti@independence.com.co',
				'FromName': 'Soporte de TI',
				'Subject': 'Tipo de falla: '+req.body.falla+' Prioridad: '+req.body.priority,
				'Text-part': 'Nombre: '+req.body.name+'\nCC: '+req.body.cc+'\nEmail: '+req.body.email+'\n Telefono: '+req.body.phone+'\n Descripcción: '+req.body.description,
				'Recipients': [{'Email': admin.email}]
			}
			sendEmail.request(emailData,function(err){
				if(err) throw err;
				console.log('email Sent');
			});
		});
		cursor.on('close',function(){
			res.json(tiq._id);
			console.log('Ticked created!'+tiq._id);
		});
	});
});

router.post('/test',function(req,res){
	console.log("data :"+r);
	res.json(req.body);
});

module.exports = router;
