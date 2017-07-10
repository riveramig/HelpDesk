var express = require('express');
var Mailjet= require('node-mailjet').connect('d269fb35916cab84fdab2f73c3fcfab3','2389f47ff86dccb50393b17b10e762af');
var router = express.Router();

var sendEmail= Mailjet.post('send');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/sendMail',function(req,res){
	var str=req.body.file;
	var res=str.split(",");
	var emailData = {
		'FromEmail': 'rivera-miguel@hotmail.com',
		'FromName': 'Soporte de TI',
		'Subject': 'Problema en el area: '+req.body.department,
		'Text-part': req.body.description,
		'Recipients': [{'Email': 'miguel.rivera@correo.usa.edu.co'}],
		'Attachments': [{
			'Content-Type': 'text-plain',
			'Filename': 'screen.jpg',
			'Content': res[1]
		}]
	};
	sendEmail.request(emailData,function(err){
		if(err){
			console.log(err);
		}else{
			console.log('message sent');
		}
	});
});

module.exports = router;
