Survey.Survey.cssType = "bootstrap";
Survey.defaultBootstrapCss.navigationButton = "btn btn-green";

window.survey = new Survey.Model( { questions: [
     {name:"name", type:"text", title: "Dinos quién eres:", placeHolder:"Jon Snow", isRequired: true},
     {name:"department", type:"dropdown", title: "¿Cúal es tu departamento?", isRequired: true, colCount:0, choices:["TI","Contabilidad","Finanzas","RH"]},
     {name:"description", type:"comment", title: "Cuentanos lo que ha sucedido:", isRequired:true},
     {name:"priority", type:"dropdown", title:"Prioridad", colCount:0, isRequired:true, choices:["Alto","Medio","Bajo"]},
     {name:"file", type:"file", title:"Envíanos un screen (opcional):", storeDataAsText: true, showPreview: true, imageWidth: 150, maxSize: 0}
]});
survey.onComplete.add(function(result) {
	$.post('/sendMail',result.data,function(data,status){
		console.log('Data: '+data+'\nStatus: '+status);
	});
	document.querySelector('#surveyResult').innerHTML = "<h3>La ayuda esta en camino!</h3>";
});

$("#surveyElement").Survey({model:survey});