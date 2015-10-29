window.onload = function()
{

var nomServicios = [
	                        {
	                            servicio 	: 	"Trae todas las tareas",
	                            urlServicio	: 	"getAllTask",
	                            metodo		: 	"GET"
	                        },
	                        {
	                            servicio 	: 	"Crear una nueva tarea",
	                            urlServicio	: 	"createTask",
	                            metodo		: 	"POST"
	                        },
	                        {
	                            servicio 	: 	"Editar una tarea",
	                            urlServicio	: 	"updateTask",
	                            metodo		: 	"PUT"
	                        },
	                        {
	                            servicio 	: 	"Eliminar Tarea",
	                            urlServicio	: 	"deleteTask",
	                            metodo		: 	"DELETE"
	                        },
	                        {
	                            servicio 	: 	"Trae una sola tarea",
	                            urlServicio	: 	"getTask",
	                            metodo		: 	"GET"
	                        }
	                    ];

	var consumeServicios = function(tipo, val, callback)
	{
	    var servicio = {
	                        url 	: nomServicios[tipo - 1].urlServicio,
	                        metodo	: nomServicios[tipo - 1].metodo,
	                        datos 	: ""
	                    };
	    if(tipo === 4 || tipo === 5)
	    {
	        servicio.url += "/" + val;
	    }
	    else
	    {
	        servicio.datos = val !== "" ? JSON.stringify(val) : "";
	    }
	    //Invocar el servicio...	    
	    $.ajax(
	    {
	        url 		: servicio.url,
	        type 		: servicio.metodo,
	        data 		: servicio.datos,
	        dataType 	: "json",
	        contentType: "application/json; charset=utf-8"
	    }).done(function(data)
	    {
	        listaTareas = data;
	        imprimeUsuarios();
	    });
	};
	
	listaTareas = [];
	var indEdita = -1; //El índice de Edición...
	var elementos = ["tarea"];
	//Constructor tarea...
	function tarea(id,es)
	{
		this.identificacion = id;
		this.estado = es;

		this.imprime = function()
		{
			return [
						this.identificacion, 
						this.estado
					];
		}
	}

	//Para cargar la información de localStorage...
	if(localStorage.getItem("listado"))
	{
		var objTMP = eval(localStorage.getItem("listado"));
		var id = es = "";
		for(var i in objTMP)
		{
			var id = objTMP[i].identificacion;
			var es = objTMP[i].estado;
			var nuevaTarea = new tarea(id,es);
			listaTareas.push(nuevaTarea);
		}
	}
	//imprimeUsuarios();
	//Imprimer usuarios en pantalla...
	var imprimeUsuarios = (function imprimeUsuarios()
	{
		var txt = "";
		var k=0;
		for(var i = 0; i < listaTareas.length; i++)
		{
			var datosTarea = listaTareas[i].imprime();
			if(datosTarea[1] == 1){
				txt += "<div class='tarea' id='activa'>";
				txt += "<center>"+(datosTarea[0])+"</center>";
				txt += "<img src = 'img/like.png' border = '0' id = 'e_"+i+"'/>";
				txt += "<img align='right' src = 'img/trash.png' border = '0' id = 'd_"+i+"'/>";
				txt += "</div>";
			}
			else{
				txt += "<div class='tarea' id='desactiva'>";
				txt += "<center>"+(datosTarea[0])+"</center>";
				txt += "<img src = 'img/like.png' border = '0' id = 'e_"+i+"'/>";
				txt += "<img align='right' src = 'img/trash.png' border = '0' id = 'd_"+i+"'/>";
				txt += "</div>";
			}
			
		}
		nom_div("imprime").innerHTML = txt;
		//Poner las acciones de editar y eliminar...
		for(var i = 0; i < listaTareas.length; i++)
		{
			
			//Editar...
			nom_div("e_" + i).addEventListener('click', function(event)
			{
				var ind = event.target.id.split("_")[1];
				var idUser = listaTareas[ind].identificacion;
				console.log("Valor de idUser: ", idUser);
				ind = buscaIndice(idUser);
				if(ind >= 0)
				{
					console.log("elementos: ", elementos);
					listaTareas[ind].estado = 0;
					localStorage.setItem("listado", JSON.stringify(listaTareas));
					imprimeUsuarios();
					limpiarCampos();
				}
				else
				{
					alert("No existe el ID");
				}
			});
			//Eliminar...
			nom_div("d_" + i).addEventListener('click', function(event)
			{
				var ind = event.target.id.split("_")[1];
				var idUser = listaTareas[ind].identificacion;
				if(confirm("¿Está segur@ que quiere eliminar esta tarea?"))
				{
					ind = buscaIndice(idUser);
					if(ind >= 0)
					{
						listaTareas.splice(ind, 1);
						localStorage.setItem("listado", JSON.stringify(listaTareas));
						indEdita = -1;
						imprimeUsuarios();
					}
				}
			});
		}
		return imprimeUsuarios;
	})();
	//Dada la identificación, buscar la posición donde se encuentra almacenado...
	var buscaIndice = function(id)
	{
		var indice = -1;
		for(var i in listaTareas)
		{
			if(listaTareas[i].identificacion === id)
			{
				indice = i;
				break;
			}
		}
		return indice;
	}

	//Limpia los campos del formulario...
	var limpiarCampos = function()
	{
		indEdita = -1; //No se está editando nada...
		for(var i = 0; i < elementos.length; i++)
		{
			nom_div(elementos[i]).value = "";	
		}
	}

	//Saber si un usuario ya existe, bien por identificación o por e-mail...
	function existeTarea(id)
	{
		var existe = 0; //0 Ningún campo existe...
		for(var i in listaTareas)
		{
			//Cédula...
			if(i !== indEdita)
			{
				if(listaTareas[i].identificacion.trim().toLowerCase() === id.trim().toLowerCase())
				{
					existe = 1; 
					break;
				}
			}
		}
		return existe;
	}

	//Acciones sobre el botón guardar...
	nom_div("guarda").addEventListener('click', function(event)
	{
		var correcto = true;
		var valores = [];
		for(var i = 0; i < elementos.length; i++)
		{
			if(nom_div(elementos[i]).value === "")
			{
				alert("Digite una tarea");
				nom_div(elementos[i]).focus();
				correcto = false;
				break;
			}
			else
			{
				valores[i] = nom_div(elementos[i]).value;
			}
		}
		if(correcto)
		{
			var existeDatos = existeTarea(valores[0]);
			if(existeDatos === 0) //No existe...
			{

				if(indEdita < 0)
				{
					var nuevaTarea = new tarea(valores[0],1);
					listaTareas.push(nuevaTarea);
				}
				else
				{
					listaTareas[indEdita].identificacion = valores[0];
				}

				localStorage.setItem("listado", JSON.stringify(listaTareas));
				imprimeUsuarios();
				limpiarCampos();

			}
			else
			{
				alert("Ya existe la tarea " + valores[0] + ".");
				nom_div(elementos[0]).focus();
			}
		}

	});

	//Accedera los elementos de HTML...
	function nom_div(div)
	{
		return document.getElementById(div);
	}
}