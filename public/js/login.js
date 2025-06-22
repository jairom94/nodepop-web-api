import { inputController } from "./Controllers/input-controller.js"
import { loginController } from "./Controllers/login-controller.js"
import { notificationController } from "./Controllers/notification-controller.js"

document.addEventListener('DOMContentLoaded',()=>{
    const form = document.querySelector('.form') 
    const containerEmail = form.querySelector('.email')
    const containerPassword = form.querySelector('.password')   
    const email = inputController(containerEmail,'email','email','Dirección de e-mail')
    const password = inputController(containerPassword,'password','password','Contraseña')
    const fields = [email.getInput(),password.getInput()]
    
    const notificationsContainer = document.querySelector('.notification-container');
    const error = notificationsContainer.dataset.error
    const notifications = notificationController(notificationsContainer)
    if(error){
        notifications.show(error,'error')
    }

    form.addEventListener('error-login',(e)=>{
        notifications.show(e.detail,'error')
    })
    
    loginController(form,fields)
})