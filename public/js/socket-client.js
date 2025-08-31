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
  let sessionUserId;
  const messages = $(".messages");  
  const btnSendMessage = $(".send-message");
  if(messages instanceof HTMLUListElement){
    sessionUserId = messages.dataset.user;
  }
  if (txtMessage instanceof HTMLInputElement) {
    txtMessage.addEventListener("keyup", (e) => {});
  }
  if (usersOnline instanceof HTMLUListElement) {
    socket.on("update-online-users", (usersOnlineList) => {
      if (Array.isArray(usersOnlineList)) {
        usersOnline.innerHTML = "";
        // const usersOnlineData = usersOnlineList.map((u) => ({
        //   ...u,
        //   select: false,
        // }));
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
          usersOnline.appendChild(li);
          li.addEventListener("click", () => {
            usersOnline.querySelectorAll("li").forEach((el) => {
              el.classList.remove("bg-amber-600");
            });
            li.classList.add("bg-amber-600");
            //Creación de sala para chat
            if (messages instanceof HTMLUListElement) {
              // const userID = li.dataset.user ?? "";              
              if (user.id) {
                if(sessionUserId && sessionUserId !== user.id){                  
                  socket.emit("start-private-chat", user.id);
                }
              }
            }
          });
        }
      }
    });
  }
  let currentChatRoomId;
  if(btnSendMessage instanceof HTMLButtonElement){
    btnSendMessage.addEventListener('click',()=>{
      if(currentChatRoomId && txtMessage instanceof HTMLInputElement){
        // console.log(currentChatRoomId);   
        if(txtMessage.value){
          sendMessagePrivate(txtMessage.value,currentChatRoomId)
          messages.scrollTo({
            top: messages.scrollHeight,
            behavior: 'smooth'
          });
          txtMessage.value = ''
        }     
      }
    })
  }  
  if(txtMessage instanceof HTMLInputElement){
    txtMessage.addEventListener('keyup',(e)=>{
      console.log(e.key);
      
    })
  }
  socket.on('private-chat-started',(payload)=>{
    // console.log(payload);   
    currentChatRoomId = payload.roomId; 
  })  
  socket.on('new-private-message',(message)=>{
    // console.log(message);
    if(messages instanceof HTMLUListElement){
      const msg = createElement('li')
      msg.classList.add('relative')
      if(message.author.id !== sessionUserId){
        msg.classList.add('ml-auto')
      }
      msg.innerHTML = `
      <span 
      class="block absolute size-3 skew-x-[30deg] bg-amber-300 top-0 -left-[.15rem] z-0"></span>
        <div class="w-fit bg-amber-300 rounded-lg px-2 py-1 text-xs z-10 relative">
            <span>${message.content}</span>
        </div>
      <span class="text-xs text-gray-700">hace 2min</span>
      `
      // msg.textContent = message.content
      messages.appendChild(msg)
    }
  })
 
  /**
   * 
   * @param {string} message 
   * @param {string} roomId 
   */
  function sendMessagePrivate(message,roomId) {
    if(message.trim() && currentChatRoomId){
      socket.emit('send-private-message',{
          roomId:roomId,
          content:message
      })
    }
  }
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
