var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ticketSchema=new Schema({
	name:String,
	cc:String,
	phone:String,
	email:String,
	description:String,
	file:{data:String, contentType:String},
	isAlive:Boolean,
	priority:String,
	tipoFalla:String,
	procedure:String,
	satisfaction:String
});

module.exports=mongoose.model('Ticket',ticketSchema);
