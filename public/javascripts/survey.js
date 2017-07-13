Survey.Survey.cssType = "bootstrap";
Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

window.survey = new Survey.Model( { questions: [
     {name:"name", type:"text", title: "Tú nombre:", placeHolder:"Jon Snow", isRequired: true},
     {name:"email", type:"text", inputType:"email", title:"E-mail", placeHolder:"jon.snow@independence.com.co", isRequired:true, validators:[{type:"email"}]},
     {name:"phone", type:"text", title:"Telefono", placeHolder:"(999) 123-45678", isRequired:true},
     {name:"falla", type:"dropdown", title:"Tipo de falla", isRequired:true, colCount:0,
 		choices:["JDE", "Internet y telefonia", "Microinformatica", "Impresoras", "Otros"]},
     {name:"description", type:"comment", title: "Descripcion de la falla:", isRequired:true},
     {name:"priority", type:"dropdown", title:"Prioridad", colCount:0, isRequired:true, choices:["Alto","Medio","Bajo"]},
     {name:"file", type:"file", title:"Adjunta aqui la evidencia de tu falla (opcional):", storeDataAsText: true, showPreview: true, imageWidth: 150, maxSize: 0}
]});
survey.onComplete.add(function(result) {

	if(typeof result.file!=undefined){
		console.log('atach');
		$.post('/sendMailAtach',result.data,function(data,status){
			console.log('Data: '+data+'\nStatus: '+status);
		});
	}else{
		$.post('/sendMailUnat',result.data,function(data,status){
			console.log('unat');
			console.log('Data: '+data+'\nStatus: '+status);
		});
	}
	document.querySelector('#surveyResult').innerHTML = "<h3>La ayuda esta en camino!</h3>";
});

$("#surveyElement").Survey({model:survey});