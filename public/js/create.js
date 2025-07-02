import { notificationController } from "./Controllers/notification-controller.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");

  const name = form.querySelector(".name");
  const price = form.querySelector(".price");

  if (name instanceof HTMLInputElement) {
    styleInput(name)
    name.addEventListener("keyup", () => {
      styleInput(name);
    });
  }
  if (price instanceof HTMLInputElement) {
    styleInput(price)
    price.addEventListener("keyup", () => {
      styleInput(price);
    });
  }

  const errors = document.querySelector(".errors");
  if (errors instanceof HTMLDivElement) {
    const errorsData = errors.dataset.errors;
    const errorsList = errorsData.split(",");
    const notificationsContainer = document.querySelector(
      ".notification-container"
    );
    const notifications = notificationController(notificationsContainer);
    errorsList.forEach((err) => {
      notifications.show(err, "error");
    });
  }

  // console.log('Escuchando desde create');
  
  const image = form.querySelector(".image");
  const previewContainer = form.querySelector(".preview-container");
  if(previewContainer instanceof HTMLDivElement){
    if (previewContainer.children.length > 0) {
      const btnCloseImagePreview = form.querySelector('.btn-close-preview')
      if(btnCloseImagePreview instanceof HTMLButtonElement){
        btnCloseImagePreview.addEventListener('click',()=>{
          clearImagePreview(previewContainer,image)
          const inputPreviewImage = form.querySelector('.image-preview')
          if(inputPreviewImage instanceof HTMLInputElement)
            inputPreviewImage.remove()
        })
      }
    }
  }
  if (image instanceof HTMLInputElement) {
    image.addEventListener('change',()=>{
      console.log('poniendo imagen');      
      previewContainer.classList.remove('hidden')
      previewContainer.classList.add('relative')
      const btnClose = document.createElement('button')
      btnClose.classList.add(
        'bg-red-500',
        'hover:bg-red-600',
        'transition-colors',
        'duration-300',
        'cursor-pointer',
        'px-4',
        'text-white',
        'font-medium',
        'py-2',
        'absolute',
        'right-0',
        'top-0'
      )
      btnClose.textContent = 'X';
      btnClose.type = 'button'
      btnClose.addEventListener('click',()=>clearImagePreview(previewContainer,image))
      if (previewContainer instanceof HTMLDivElement) {

        const img = document.createElement("img");
        img.classList.add('aspect-video', 'object-center', 'object-contain')
        const urlImage = URL.createObjectURL(image.files[0])
        img.src = urlImage
        img.alt = 'Product image'
        previewContainer.appendChild(img)
        previewContainer.appendChild(btnClose)
      }
    })
  }
});

/**
 *
 * @param {HTMLInputElement} input
 */
function styleInput(input) {
  if (input.value) {
    input.classList.remove("pt-3", "pb-3");
    input.classList.add("[&+label]:top-0", "[&+label]:text-xs", "pt-4", "pb-2");
  } else {
    input.classList.add("pt-3", "pb-3");
    input.classList.remove(
      "[&+label]:top-0",
      "[&+label]:text-xs",
      "pt-4",
      "pb-2"
    );
  }
}

/**
 * @param {HTMLDivElement} container 
 * @param {HTMLInputElement} input 
 */
function clearImagePreview(container,input){
  input.value = ''
  container.classList.add('hidden')
  container.innerHTML = ''
}