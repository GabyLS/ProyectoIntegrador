// DECLARACIONES DE VARIABLES Y FUNCIONES GLOBALES
class FormularioAlta {
    inputs = null
    form = null
    button = null
    camposValidos = [false,false,false,false,false,false,false]
    regExpValidar = [
        /^.+$/,     //regexp nombre
        /^.+$/,     //regexp precio
        /^[0-9]+$/, //regexp stock
        /^.+$/,     //regexp marca
        /^.+$/,     //regexp categoria
        /^.+$/,     //regexp foto
        /^.+$/,     //regexp detalles

    ]

    constructor(renderTablaAlta, guardarProducto) {
        
        this.inputs = document.querySelectorAll('.alta-input')
        this.form = document.querySelector('.alta-form')
        this.button = document.querySelector('main form button')

        this.button.disabled = true

         //console.log(inputs)
         this.inputs.forEach((input,index) => {
            if(input.type != 'checkbox') {
                input.addEventListener('input', () => {
                    this.validar(input.value, this.regExpValidar[index], index )
                    if(renderTablaAlta) renderTablaAlta( !this.algunCampoNoValido(), productoController.productos )
                })
            }
        })
    
        this.form.addEventListener('submit', e => {
            e.preventDefault()
    
            let producto = this.leerProductoIngresado()
            this.limpiarFormulario()

            if(guardarProducto) guardarProducto(producto)
        })
    }

        setCustomValidityJS = function(mensaje, index) {
        let divs = document.querySelectorAll('.validation')
        divs[index].innerHTML = mensaje
        divs[index].style.display = mensaje? 'block' : 'none'

    }

    algunCampoNoValido() {
        let valido = 
            this.camposValidos[0] &&
            this.camposValidos[1] &&
            this.camposValidos[2] &&
            this.camposValidos[3] &&
            this.camposValidos[4] &&
            this.camposValidos[5] &&
            this.camposValidos[6] 
            
        return !valido
    }

    validar(valor, validador, index) {
    // console.log(valor,index)

        if(!validador.test(valor)) {
            this.setCustomValidityJS('Campo no válido',index)
            this.camposValidos[index] = false
            this.button.disabled = true
            return null
        }

        this.camposValidos[index] = true
        this.button.disabled = this.algunCampoNoValido()
        this.setCustomValidityJS('',index)
        return valor
    }

    leerProductoIngresado(){
        return {
            nombre: this.inputs[0].value,
            precio: this.inputs[1].value,
            stock: this.inputs[2].value,
            marca: this.inputs[3].value,
            categoria: this.inputs[4].value,
            foto: this.inputs[5].value,
            detalles: this.inputs[6].value,
            envio: this.inputs[7].checked,
        }
    }

    limpiarFormulario(){
        //Borrar inputs
        this.inputs.forEach(input => {
            if(input.type != 'checkbox') input.value = ''
            else if(input.type == 'checkbox') input.checked = false
        })
        
    
        this.button.disabled = true
        this.camposValidos = [false, false, false, false, false, false, false]
        }
}

function renderTablaAlta(validos, productos){

    const xhr = new XMLHttpRequest
    xhr.open('get','plantillas/alta.hbs')
    xhr.addEventListener('load', () => {
        if(xhr.status == 200) {
            let plantillaHbs = xhr.response
            // console.log(plantillaHbs)

            var template = Handlebars.compile(plantillaHbs);
            let html = template({ productos, validos })
            document.getElementById('listado-productos').innerHTML = html 

        }
    })
    xhr.send()
}

    // INICIALIZACIONES PARA EL FUNCIONAMIENTO DEL MODULO
    
    let formularioAlta = null
    
    async function initAlta() {
        console.warn('initAlta()')
    
        formularioAlta = new FormularioAlta(renderTablaAlta, productoController.guardarProducto)
    
        let productos = await productoController.obtenerProductos()
        renderTablaAlta(null, productos)
    }