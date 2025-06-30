import { notificationController } from "./Controllers/notification-controller.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");

  const name = form.querySelector(".name");
  const price = form.querySelector(".price");

  if (name instanceof HTMLInputElement) {
    name.addEventListener("keyup", () => {
      styleInput(name)
    });
  }
  if (price instanceof HTMLInputElement) {
    price.addEventListener("keyup", () => {
      styleInput(price)
    });
  }

  const errors = document.querySelector('.errors')
  if(errors instanceof HTMLDivElement){
    const errorsData = errors.dataset.errors
    const errorsList = errorsData.split(',')
    const notificationsContainer = document.querySelector('.notification-container');
    const notifications = notificationController(notificationsContainer)
    errorsList.forEach(err => {
      notifications.show(err,'error')
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
