//Controlador de almacenamiento local
const AlmCtrl = (function(){
    return{
        //se cargan los datos que esten en el almacenamiento local y se los devuelve. en caso de que no haya datos, se devuelve un array vacio 
        cargarAlmacenamiento : function(){
            let itemsEnAlm;
            if (localStorage.getItem("comida") === null){
                itemsEnAlm = [];
            }else{
                itemsEnAlm = JSON.parse(localStorage.getItem("comida"));
            }
            return itemsEnAlm
        },    
        //se cargan los items ya existentes en alm. local en un array y luego a ese se le agrega el nuevo item usando push.
        //despues se agrega el array al almacenamiento local, reemplazando al viejo.
        guardarEnAlmacenamiento: function(item){
            const comidaEnAlm = this.cargarAlmacenamiento();
            comidaEnAlm.push(item);
            localStorage.setItem("comida", JSON.stringify(comidaEnAlm));
        },
        //se cargan items ya existentes en alm. local en un array, se realiza for each para buscar el item a actualizar y se le
        //reemplazan las propiedades por las propiedades del item recibido por parametro que ya esta actualizado.
        //despues se agrega el array al almacenamiento local, reemplazando al viejo.
        actualizarItemEnAlmacenamiento: function(itemParaActualizar){
            const comidaEnAlm = JSON.parse(localStorage.getItem("comida"));
            comidaEnAlm.forEach(function(item){
                if (item.id === itemParaActualizar.id){
                    item.nombre = itemParaActualizar.nombre;
                    item.calorias = itemParaActualizar.calorias;
                }
                localStorage.setItem("comida", JSON.stringify(comidaEnAlm));
            })
        },
        //mismo procedimiento que en los metodos anteriores, pero cuando cuando se encuentra el item, se usa splice con la id del item
        //recibido por parametro para quitarlo del array. despues se reemplaza el array en el alm. local
        borrarItemEnAlmacenamiento: function(itemParaBorrar){
            const comidaEnAlm = JSON.parse(localStorage.getItem("comida"));
            comidaEnAlm.forEach(function(item){
                if (item.id === itemParaBorrar.id){
                    comidaEnAlm.splice(itemParaBorrar.id, 1)
                }
            })
            localStorage.setItem("comida", JSON.stringify(comidaEnAlm));
        },
        //se borran todas las entradas en almacenamiento local con la clave "comida", que es la clave que usa este proyecto. 
        borrarTodoEnAlmacenamiento: function(){
            localStorage.removeItem("comida");
        }
    }
})();

//Controlador de Items
const ItemCtrl = (function(){
    //Constructor Item
    const Item = function(id, nombre, calorias){
        this.id = id;
        this.nombre = nombre;
        this.calorias = calorias;
    }
    //Estructura de datos. ejemplo comentado para entenderlo mejor sin tener que ir a la app.
    // const datos = {items: [
    //       {id:0, nombre: "Bife", calorias:1200},
    //       {id:1, nombre: "Galletita", calorias:400},
    //       {id:2, nombre: "Huevo", calorias:300}
    // ],
    //le asigno al array items los datos que tenga en el almacenamiento local usando el metodo cargar almacenamiento del controlador de alm. 
    const datos = {items: AlmCtrl.cargarAlmacenamiento(),
    itemSeleccionado: null,
    totalCal: 0
    }
    return{
        //simple get del array datos. no se usa en la aplicacion, mas que nada usada para testeo durante tiempo de ejecucion.
        datosLog: function(){
            return datos;
        },
        //get de los items. 
        traerItems: function(){
            return datos.items;
        },
        //get item por id. se hace un for each de los items, se captura y devuelve el item que coincida con la id recibida por parametro.
        //se usa para editar items 
        traerItemPorID: function(id){
            let itemEncontrado = null;
            datos.items.forEach(function(item){
                if (item.id === id){
                    itemEncontrado = item;
                }
            })
            return itemEncontrado;
        },
        //agrego items en la Estructura de Datos)
        agregarItemEnED: function(comida, cal){
            let ID;
            //creo ID. si el array de items esta cargado...
            if (datos.items.length > 0){
                //...busco el numero de id del ultimo item ingresado y le sumo 1
                ID = datos.items[datos.items.length - 1].id + 1;
            }else{
                //si el array de items esta vacio, dejo la variable en 0
                ID = 0;
            }
            //paso las calorias a integer porque vienen en string del input de la interfaz de usuario
            cal = parseInt(cal);
            //creo una nueva instancia de item
            nuevoItem = new Item(ID, comida, cal);
            //agrego el nuevo item a la estructura de datos
            datos.items.push(nuevoItem);
            //devuelvo el nuevo item para poder agregarlo a la interfaz de usuario por medio de su controlador
            return nuevoItem;
        },
        //metodo para actualizar un item en particular en la estructura de datos. recibe las propiedades a actualizar por parametro
        actualizarItemEnED: function(nombre, calorias){
            //paso las calorias a int, ya que vienen en string del input de la interfaz
            calorias = parseInt(calorias);
            //variable para capturar item del array
            let itemEncontrado = null;
            //recorro array con for each
            datos.items.forEach(function(item){
                //si propiedad id del item recibido por parametro es igual a la propiedad id del item seleccionado en la ED, 
                //igualo las propiedades y capturo el item
                if(item.id === datos.itemSeleccionado.id){
                    item.nombre = nombre;
                    item.calorias = calorias;
                    itemEncontrado = item;
                }
            })
            //devuelvo item para que sea utilizado por el controlador de interfaz
            return itemEncontrado;
        },
        //borro item en estructura de datos
        borrarItemEnED: function(){
            //declaro variable para usar en el for each y splice
            let indice = 0;
            //variable para capturar item del array
            let itemEncontrado = null;
             //recorro array con for each
            datos.items.forEach(function(item){
                //si id del item recibido por parametro y el id del item seleccionado son iguales...
                if(item.id === datos.itemSeleccionado.id){
                    //...capturo el item...
                    itemEncontrado = item;
                    //...y quito item del array usando splice. calculo la posicion del array usando variable indice
                    datos.items.splice(indice, 1);
                }
                //acumulo en indice
                indice++;
            })
             //devuelvo item para que sea utilizado por el controlador de interfaz
            return itemEncontrado;
        },
        //se resesetean las propiedades del controlador de items
        borrarTodoEnED: function(){
            datos.items = [];
            datos.itemSeleccionado = null;
            datos.totalCal = 0;
        },
        //get de item seleccionado. se utiliza para poder pasarle esta informacion al controlador de interfaz.
        traerItemSeleccionado: function(){
            return datos.itemSeleccionado;
        },
        //set de item seleccionado. se utiliza para que el controlador de interfaz pueda pasar estos datos a los inputs del estado edicion
        setearItemSeleccionado: function(item){
            datos.itemSeleccionado = item;
        },
        //se suman las calorias haciendo un acumulador de la propiedad calorias de cada item del array de items. despues se asigna este valor
        //a la propiedad totalCal y se devuelve para que se utilize por el controlador de interfaz
        sumarCalorias: function(){
            let total = 0;
            datos.items.forEach(function(item){
                total += item.calorias
            })
            datos.totalCal = total;
            return datos.totalCal;
        }
    }
})();

//Controlador de interfaz de usuario (UI)
const UICtrl = (function(){
    //variables con valores del html para un acceso mas facil y ordenado
    const seleccionadorUI ={
        divPrincipal: ".card-content",
        listaItems: "#lista-items",
        itemEnLista: "#item-",
        btnAgregar: "#btn-agregar",
        btnActualizar: "#btn-actualizar",
        btnBorrarItem: "#btn-borrar-item",
        btnBorrarTodo: "#btn-borrar-todo",
        btnVolver: "#btn-volver",
        inputNombre: "#comida-input",
        inputCalorias: "#cal-input",
        calTotal: "#cal-total"
    }
    return{
        //metodo para poder acceder a los valores del seleccionadorUI
        cargarSeleccionador: function(){
            return seleccionadorUI;
        },
        //recibe un array con todos los items de la estructura de datos y agrega a la interfaz usando for each y teamplate strings para el html,
        //asignando las propiedades de los items cuando corresponde
        agregarArrayItemsEnUI: function(arrayItems){
            let filaItem = "";
            arrayItems.forEach(function(item){
                filaItem += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.nombre}: </strong> <em>${item.calorias} Calorias</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item material-icons">create</i></a>`;
            })
            document.querySelector(seleccionadorUI.listaItems).innerHTML = filaItem;
        },
        //similar al metodo anterior, pero con un solo item. se crea un nuevo elemento li que se agrega al final de la lista. 
        agregarItemEnUI: function(item){
            document.querySelector(seleccionadorUI.listaItems).style.display = "block";
            const nuevoItem = ` <li class="collection-item" id="item-${item.id}">
            <strong>${item.nombre}: </strong> <em>${item.calorias} calorías</em>
            <a href="#" class="secondary-content">
            <i class="edit-item material-icons">create</i></a>`
            document.querySelector(seleccionadorUI.listaItems).insertAdjacentHTML("beforeend", nuevoItem);
        },
        //se busca el html del item a actualizar usando la propiedad id del item recibido por parametro, y se lo reemplaza por un
        //nuevo element html con las propiedades del item actualizadas
        actualizarItemEnUI: function(item){
            let itemLista = document.querySelector(seleccionadorUI.itemEnLista+item.id)
            const itemActualizado = `<strong>${item.nombre}: </strong> <em>${item.calorias} calorías</em>
            <a href="#" class="secondary-content">
            <i class="edit-item material-icons">create</i></a>`
            itemLista.innerHTML = itemActualizado;
        },
        //busca y borra de la interfaz el item que recibe por parametro
        borrarItemEnUI: function(item){
            let itemLista = document.querySelector(seleccionadorUI.itemEnLista+item.id);
            itemLista.remove();
       },
       //captura la lista entera y la borra de la interfaz
        borrarTodoEnUI(){
           let listaItems = document.querySelector(seleccionadorUI.listaItems);
           listaItems.innerHTML = "";
       },
       //se carga en los input de la interfaz los valores del item seleccionado que me proporciona el controlador de items, para poder luego
       //hacer la edicion de dicho item. tambien se muestra el estado edicion para continuar con la modificacion del item
        mostrarItemSeleccionado: function(){
            document.querySelector(seleccionadorUI.inputNombre).value = ItemCtrl.traerItemSeleccionado().nombre;
            document.querySelector(seleccionadorUI.inputCalorias).value = ItemCtrl.traerItemSeleccionado().calorias;
            this.mostrarEstadoEdicion();
        },
        //muestra en la UI el valor que recibe por parametro
        mostrarTotalCalorias: function(totalCalorias){
            document.querySelector(seleccionadorUI.calTotal).textContent = totalCalorias;
        },
        //este metodo captura los valores ingresados en los inputs y los devuelve para que los metodos
        //del controlador de items de pueda usarlos
        traerInputsItems: function(){
            return {
            nombre: document.querySelector(seleccionadorUI.inputNombre).value,
            calorias: document.querySelector(seleccionadorUI.inputCalorias).value}
        },
        //mostrar advertencias cuando los datos no se ingresan correctamente. se usan los "toast" de materialize
        //tambien se quitan advertencias anteriores en caso de que existan
        mostrarMensajeError: function(){
            this.quitarMensajeError();
            M.toast({html: 'Ingrese los datos correctamente'})
        },
        //quitar advertencias
        quitarMensajeError: function(){
            M.Toast.dismissAll();
        },
        //metodo para limpiar inputs
        limpiarInput: function(){
            document.querySelector(seleccionadorUI.inputNombre).value = "";
            document.querySelector(seleccionadorUI.inputCalorias).value = "";
        },
        //la lista queda visible por mas de que esta vacia. este metodo la oculta para que quede mejor
        ocultarLista: function(){
            document.querySelector(seleccionadorUI.listaItems).style.display = "none";
        },
        //oculto el estado edicion cambiando el display de los botones. tambien limpio el input
        ocultarEstadoEdicion: function(){
            this.limpiarInput();
            document.querySelector(seleccionadorUI.btnAgregar).style.display = "inline";
            document.querySelector(seleccionadorUI.btnActualizar).style.display = "none";
            document.querySelector(seleccionadorUI.btnBorrarItem).style.display = "none";
            document.querySelector(seleccionadorUI.btnVolver).style.display = "none";
        },
        //muestro el estado edicion cambiando el display de los botones
        mostrarEstadoEdicion: function(){
            document.querySelector(seleccionadorUI.btnAgregar).style.display = "none";
            document.querySelector(seleccionadorUI.btnActualizar).style.display = "inline";
            document.querySelector(seleccionadorUI.btnBorrarItem).style.display = "inline";
            document.querySelector(seleccionadorUI.btnVolver).style.display = "inline";
        },
    }
})();

//Controlador de la aplicacion
const App = (function(AlmCtrl, ItemCtrl, UICtrl){
    //metodo para cargar los event listeners y las variables de acceso de la interfaz
    const cargarEventos = function(){
        const seleccionadorUI = UICtrl.cargarSeleccionador();
        //listener de boton agregar
        document.querySelector(seleccionadorUI.btnAgregar).addEventListener("click", agregarItem);
        //se deshabilitan las teclas enter para evitar duplicados.
        document.addEventListener("keypress", function(e){
            if (e.code === "Enter" || e.code === "NumpadEnter"){
                e.preventDefault();
                return false;
            }
        })
        //listener de boton editar
        document.querySelector(seleccionadorUI.listaItems).addEventListener("click", editarItem);
        //listener de boton actualizar
        document.querySelector(seleccionadorUI.btnActualizar).addEventListener("click", actualizarItem);
        //listener de boton borrar
        document.querySelector(seleccionadorUI.btnBorrarItem).addEventListener("click", borrarItem);
        //listener de boton volver. se oculta el estado edicion, que tambien borra los valores que esten en los inputs
        document.querySelector(seleccionadorUI.btnVolver).addEventListener("click", function(e){
            UICtrl.ocultarEstadoEdicion();
            e.preventDefault();
        });
        //listener del boton borrar todo
        document.querySelector(seleccionadorUI.btnBorrarTodo).addEventListener("click", borrarTodo);
    }
    //en todas estas funciones se pasa el evento por parametro para prevenir un envio prematuro del formulario
     agregarItem = function(e){
        e.preventDefault();
        //capturo los valores ingresados en los inputs
        const input = UICtrl.traerInputsItems();
        //pregunto si se ingreso algo en los inputs
        if (input.nombre !== "" && input.calorias !== ""){
            //agrego item en estructura de datos, pasando por parametro el valor de sus propiedades y capturo el item que devuelve el metodo
            const nuevoItem = ItemCtrl.agregarItemEnED(input.nombre, input.calorias);
            //agrego el item en interfaz de usuario
            UICtrl.agregarItemEnUI(nuevoItem);
            //sumo las calorias en estructura de datos, capturo el valor y lo envio a controlador de interfaz para mostrarlo
            const totalCal = ItemCtrl.sumarCalorias();
            UICtrl.mostrarTotalCalorias(totalCal);
            //guardo el item en almacenamiento local
            AlmCtrl.guardarEnAlmacenamiento(nuevoItem);
            //vacio los inputs
            UICtrl.limpiarInput();
         }else{
             //muestro mensaje de error en caso de que los inputs esten vacios
             UICtrl.mostrarMensajeError();
         }
    }
    //esta funcion usa delegacion de eventos. como no hay items al inicio de la app (en caso de que no haya nada guardado en alm. local)
    //lo que hago es que el evento se dispare cada vez que se haga click en la lista, y que luego se pregunte si en la lista hay un icono
    editarItem = function(e){
        e.preventDefault();
        if (e.target.classList.contains("material-icons")){
            //si hay icono, entonces capturo el id del item "navegando" por el target del evento
            const itemID = e.target.parentNode.parentNode.id;
            //como el valor capturado va a ser del estilo "item-X", y solo necesito el numero, quito lo que no me sirve con split 
            const itemIDArray = itemID.split("-");
            //finalmente obtengo el numero id que necesito, que va a estar en la posicion 1 del array (en la pos 0 estaria la parte "item-")
            const id = parseInt(itemIDArray[1]);
            //y uso traerItemPorID para capturar el item que quiero editar 
            const itemAEditar = ItemCtrl.traerItemPorID(id);
            //lo seteo como item seleccionado dentro de la estructura de datos, que me va a servir para poder enviarlo al controlador
            //de interfaz
            ItemCtrl.setearItemSeleccionado(itemAEditar);
            //muestro el item seleccionado en la interfaz
            UICtrl.mostrarItemSeleccionado();
        }
    }
    actualizarItem = function(e){
        e.preventDefault();
        //capturo valores de los inputs
        const valoresInput = UICtrl.traerInputsItems();
        //los paso por parametro al controlador de items para actualizar los items en la estructura de datos
        const itemActualizado = ItemCtrl.actualizarItemEnED(valoresInput.nombre, valoresInput.calorias);
        //ahora se pasa al controlador de interfaz el item actualizado en la estructura de datos, asi se muestra
        UICtrl.actualizarItemEnUI(itemActualizado);
        //se suman las calorias en la ED y se captura el valor
        const totalCalActualizado = ItemCtrl.sumarCalorias();
        //se envia ese valor al controlador de interfaz para mostrarlo
        UICtrl.mostrarTotalCalorias(totalCalActualizado);
        //se actualiza en alm. local el item
        AlmCtrl.actualizarItemEnAlmacenamiento(itemActualizado);
        //finalmente se oculta el estado edicion para que se continue con el estado normal de la app
        UICtrl.ocultarEstadoEdicion();
    }
    borrarItem = function(e){
        e.preventDefault();
        //borro el item en la estructura de datos y lo capturo en una variable para enviarlo al controlador de interfaz y de alm.
        const itemParaBorrar = ItemCtrl.borrarItemEnED();
        //se borra el item en la interfaz
        UICtrl.borrarItemEnUI(itemParaBorrar);
        //se borra el item en el almacenamiento local
        AlmCtrl.borrarItemEnAlmacenamiento(itemParaBorrar);
        //capturo la suma de calorias y la muestro en la interfaz
        const totalCalActualizado = ItemCtrl.sumarCalorias();
        UICtrl.mostrarTotalCalorias(totalCalActualizado);
        //oculto estado edicion
        UICtrl.ocultarEstadoEdicion();
    }
    borrarTodo = function(e){
        e.preventDefault();
        //borro todos items en estructura de datos
        ItemCtrl.borrarTodoEnED();
        //borro todos los items que esten en la interfaz
        UICtrl.borrarTodoEnUI();
        //capturo la suma de calorias y la muestro en la interfaz, para que no me quede el valor anterior. 
        //tambien podria usar mostrarTotalCalorias y pasarle el valor 0 por parametro. 
        const totalCalActualizado = ItemCtrl.sumarCalorias();
        UICtrl.mostrarTotalCalorias(totalCalActualizado);
        //borro items en almacenamiento local
        AlmCtrl.borrarTodoEnAlmacenamiento();
        //oculto el estado edicion
        UICtrl.ocultarEstadoEdicion();
        //oculto la lista
        UICtrl.ocultarLista();
    }
    return{
        init: function(){
            //se ocultan los botones del estado edicion
            UICtrl.ocultarEstadoEdicion();
            //se cargan event listeners
            cargarEventos();
            //se traen los items que esten en el almacenamiento local
            const itemsTraidos = ItemCtrl.traerItems();
            //si no hay items, se oculta la lista
            if(itemsTraidos.length === 0){
                UICtrl.ocultarLista();
            }else{
                //en caso de que haya items, se los muestra en la interfaz
                UICtrl.agregarArrayItemsEnUI(itemsTraidos);
            }
            //se captura en una variable la suma de las calorias en la estructura de datos 
            const totalCal = ItemCtrl.sumarCalorias();
            //se muestra esa suma en la interfaz
            UICtrl.mostrarTotalCalorias(totalCal);
        }
    }
})(AlmCtrl, ItemCtrl, UICtrl);

App.init();