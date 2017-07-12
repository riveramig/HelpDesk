var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ticketSchema=new Schema({
	phone:String,
	email:String,
	description:String,
	file:{data:String, contentType:String},
	isAlive:Boolean,
	category:String,
	procedure:{type:String, required:true},
	satisfaction:String
});

module.exports=mongoose.model('Ticket',ticketSchema);
