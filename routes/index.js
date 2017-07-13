var express = require('express');
var Mailjet= require('node-mailjet').connect('d269fb35916cab84fdab2f73c3fcfab3','2389f47ff86dccb50393b17b10e762af');
var router = express.Router();

var sendEmail= Mailjet.post('send');

/* GET home page. */
router.get('/mesaTi', function(req, res, next) {
  res.render('index');
});

router.post('/sendMailAtach',function(req,res){
	var emailData;
	console.log(req.body);
	var str=req.body.file;
	var res=str.split(",");
	emailData = {
			'FromEmail': 'practicanteti@independence.com.co',
			'FromName': 'Soporte de TI',
			'Subject': 'Tipo de falla: '+req.body.falla+' Prioridad: '+req.body.priority,
			'Text-part': 'Nombre: '+req.body.name+'/n Email: '+req.body.email+'/n Telefono: '+req.body.phone+'/n'+req.body.description,
			'Recipients': [{'Email': 'miguel.rivera@correo.usa.edu.co'}],
			'Attachments': [{
				'Content-Type': 'text-plain',
				'Filename': 'screen.jpg',
				'Content': res[1]
			}]
		};

	sendEmail.request(emailData,function(err){
		if(err){
			console.log(emailData);
			console.log(err);
		}else{
			console.log('message sent attachment');
		}
	});
});

router.post('/sendMailUnat',function(req,res){
	var emailData;
	emailData = {
			'FromEmail': 'practicanteti@independence.com.co',
			'FromName': 'Soporte de TI',
			'Subject': 'Tipo de falla: '+req.body.falla+' Prioridad: '+req.body.priority,
			'Text-part': 'Nombre: '+req.body.name+'/n Email: '+req.body.email+'/n Telefono: '+req.body.phone+'/n'+req.body.description,
			'Recipients': [{'Email': 'miguel.rivera@correo.usa.edu.co'}],
		};
	sendEmail.request(emailData,function(err){
		if(err){
			console.log(emailData);
			console.log(err);
		}else{
			console.log('message sent clean');
		}
	});
});

module.exports = router;
