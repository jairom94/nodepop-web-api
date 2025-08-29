/**
 * @type {import("socket.io-client").Socket}
 */
const socket = io();

document.addEventListener("DOMContentLoaded", () => {
  /**
   * @param {string} selector
   * @returns {Element | null}
   */
  const $ = (selector) => document.querySelector(selector);
  const usersOnline = $(".users-online");
  const txtMessage = $(".txt-message");
  let userSelected = false;
  const messages = $(".messages");  
  const btnSendMessage = $(".send-message");
  if (txtMessage instanceof HTMLInputElement) {
    txtMessage.addEventListener("keyup", (e) => {});
  }
  if (usersOnline instanceof HTMLUListElement) {
    socket.on("update-online-users", (usersOnlineList) => {
      if (Array.isArray(usersOnlineList)) {
        usersOnline.innerHTML = "";
        const usersOnlineData = usersOnlineList.map((u) => ({
          ...u,
          select: false,
        }));
        for (const user of usersOnlineList) {
          const li = createElement("li",{'data-user':user.id});
          li.classList.add(
            "flex",
            "items-center",
            "gap-3",
            "hover:bg-amber-500",
            "p-2"
          );
          const circle = createElement("span");
          circle.classList.add("bg-emerald-500", "size-[10px]", "rounded-full");
          li.appendChild(circle);
          const span = createElement("span");
          span.textContent = user?.fullname;          
          li.appendChild(span);

        //   const idUser = createElement('span')
        //   idUser.textContent = user?.id
        //   li.appendChild(idUser)
          // li.textContent = user?.fullname
          usersOnline.appendChild(li);
          li.addEventListener("click", () => {
            usersOnline.querySelectorAll("li").forEach((el) => {
              el.classList.remove("bg-amber-600");
            });
            li.classList.add("bg-amber-600");
            //Creacion de sala para chat
            if (messages instanceof HTMLUListElement) {
              const userID = li.dataset.user ?? "";
              if (userID) {
                socket.emit("start-private-chat", userID);
              }
            }
          });
        }
      }
    });
  }
  socket.on('private-chat-started',(payload)=>{
    console.log(payload);
    socket.emit('send-private-message',{roomId:payload.roomId,content:'hola desde el navegador'})
  })  
  socket.on('new-private-message',(message)=>{
    console.log(message);
    
  })
});

/**
 * Crea un elemento HTML con atributos personalizados.
 *
 * @param {keyof HTMLElementTagNameMap} tag - Nombre de la etiqueta HTML (por ejemplo, "div", "button").
 * @param {{ [key: string]: string }} attributes - Objeto con atributos HTML como pares clave-valor.
 * @returns {HTMLElement} El elemento HTML creado.
 */
function createElement(tag, attributes) {
  const el = document.createElement(tag);
  for (const key in attributes) {
    el.setAttribute(key, attributes[key]);
  }
  return el;
}

// socket.on("server-message", (payload) => {
//   console.log("message from server", payload);
// });
// socket.on("update_online_users", (payload) => {
//   console.log("usuarios en linea", payload);
// });
