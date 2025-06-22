import { buildNotification } from '../Views/notification-view.js'

/**
 * Crea y controla una caja flotante.
 * @param {HTMLDivElement} $notifications - El elemento contenedor para el input y el label. 
 */
export function notificationController($notifications){
    // const $notifications = document.querySelector('.notification-container');
    function removeNotification($notification){
        $notification.remove();
    }
    return {
        show(message,type){
            const $notificationNew = document.createElement('li');
            $notificationNew.classList.add('notification-item');
            $notificationNew.classList.add(type);
            $notificationNew.innerHTML = buildNotification(message,type)
            $notifications.appendChild($notificationNew);

            const $btnClose = $notificationNew.querySelector('.notification-close')
            $btnClose.addEventListener('click',()=>{
                removeNotification($notificationNew);
            });

            setTimeout(() => {
                removeNotification($notificationNew);
            }, 5000);
        }
    }
}