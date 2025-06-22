import { inputController } from "./Controllers/input-controller.js"
import { registerController } from "./Controllers/register-controller.js"

document.addEventListener('DOMContentLoaded',()=>{
    const form = document.querySelector('.form')
    const containerName = form.querySelector('.name')
    const containerEmail = form.querySelector('.email')
    const containerPassword = form.querySelector('.password')
    const name = inputController(containerName,'text','name','Nombres y apellidos')
    const email = inputController(containerEmail,'email','email','Dirección de e-mail')
    const password = inputController(containerPassword,'password','password','Contraseña')
    const fields = [name.getInput(),email.getInput(),password.getInput()]
    registerController(form,fields)
})