/**
 * @type {import("socket.io-client").Socket}
 */
const socket = io();

/**
 * @param {string} selector
 * @returns {Element | null}
 */
const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
  const usersOnline = $(".users-online");
  const txtMessage = $(".txt-message");
  let sessionUserId;
  const messages = $(".messages");
  const btnSendMessage = $(".send-message");
  if (messages instanceof HTMLUListElement) {
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
          const li = createElement("li", { "data-user": user.id });
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
                if (sessionUserId && sessionUserId !== user.id) {
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
  if (btnSendMessage instanceof HTMLButtonElement) {
    btnSendMessage.addEventListener("click", () => {
      if (currentChatRoomId && txtMessage instanceof HTMLInputElement) {
        // console.log(currentChatRoomId);
        if (txtMessage.value) {
          sendMessagePrivate(txtMessage.value, currentChatRoomId);
          messages.scrollTo({
            top: messages.scrollHeight,
            behavior: "smooth",
          });
          txtMessage.value = "";
        }
      }
    });
  }
  if (txtMessage instanceof HTMLInputElement) {
    txtMessage.addEventListener("keyup", (e) => {
      console.log(e.key);
      if (e.key === "Enter") {
        if (currentChatRoomId && txtMessage instanceof HTMLInputElement) {
          // console.log(currentChatRoomId);
          if (txtMessage.value) {
            sendMessagePrivate(txtMessage.value, currentChatRoomId);
            messages.scrollTo({
              top: messages.scrollHeight,
              behavior: "smooth",
            });
            txtMessage.value = "";
          }
        }
      }
    });
  }
  socket.on("private-chat-started", (payload) => {
    // console.log(payload);
    currentChatRoomId = payload.roomId;
  });
  socket.on("new-private-message", (message) => {
    // console.log(message);
    if (messages instanceof HTMLUListElement) {
      const msg = createElement("li");
      msg.classList.add("relative");
      if (message.author.id !== sessionUserId) {
        msg.classList.add("ml-auto");
      }
      const bgMessage =
        sessionUserId === message.author.id ? "bg-amber-300" : "bg-amber-100";
      const shapeMessage =
        sessionUserId === message.author.id
          ? "-left-[.15rem] skew-x-[30deg]"
          : "-right-[.14rem] skew-x-[-30deg]";
      msg.innerHTML = `
        <span 
        class="block absolute w-4 h-3 ${bgMessage} ${shapeMessage} top-0 z-0"></span>
          <div class="w-fit ${bgMessage} rounded-lg px-2 py-1 text-xs z-10 relative">
              <span>${message.content}</span>
          </div>
        <span class="text-xs text-gray-700">hace 2min</span>
      `;

      messages.appendChild(msg);
    }
  });

  /**
   *
   * @param {string} message
   * @param {string} roomId
   */
  function sendMessagePrivate(message, roomId) {
    if (message.trim() && currentChatRoomId) {
      socket.emit("send-private-message", {
        roomId: roomId,
        content: message,
      });
    }
  }

  const chatPanel = $(".chat-module");
  moduleChatController(chatPanel);
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

/**
 *
 * @param {HTMLDivElement} nodeModuleChat
 */
function moduleChatController(nodeModuleChat) {
  let isVisible = false;
  const btnShow = $(".bnt-show-users");
  if (btnShow instanceof HTMLButtonElement) {
    btnShow.addEventListener("click", () => {
      isVisible = !isVisible;
      if (isVisible) {
        nodeModuleChat.classList.remove("grid-cols-[1fr_0px]");
        nodeModuleChat.classList.add("grid-cols-[1fr_200px]");
      } else {
        nodeModuleChat.classList.remove("grid-cols-[1fr_200px]");
        nodeModuleChat.classList.add("grid-cols-[1fr_0px]");
      }
    });
  }
}

/**
 *
 * @param {HTMLDivElement} nodeChat
 */
function chatBoxController(nodeChat) {
  
  function viewChatBox() {
    return /*html*/ `
    <div class="pointer-events-auto flex flex-col p-2 z-50 w-[300px] h-[350px] bg-amber-300">
    <div class="other-user py-1 px-2 bg-amber-500">
    <p class="flex gap-2 items-center">
      <span class="block size-[10px] bg-emerald-500 rounded-full">
      </span>
      <span>
        Otro usuario
      </span>
    </p>
  </div>
  <div class="bg-indigo-300 h-[300px] flex items-end">
    <ul class="messages flex-1 max-h-[300px] overflow-y-auto flex flex-col gap-2 py-1 px-2"
    data-user="<%= session.userID %>">
      <li class="relative">
        <span class="block absolute size-3 skew-x-[30deg] bg-amber-300 top-0 -left-[.15rem] z-0">
        </span>
        <div class="w-fit bg-amber-300 rounded-lg px-2 py-1 text-xs z-10 relative">
          <span>
            Hola mundo, desde chat
          </span>
        </div>
        <span class="text-xs text-gray-700">
          hace 2min
        </span>
      </li>
      <li class="relative ml-auto">
        <span class="block absolute size-3 skew-x-[-30deg] bg-amber-100 top-0 -right-[.15rem] z-0">
        </span>
        <div class="w-fit bg-amber-100 rounded-lg px-2 py-1 text-xs z-10 relative">
          <span>
            Hola mundo, desde chat
          </span>
        </div>
        <span class="text-xs text-gray-700">
          hace 2min
        </span>
      </li>
    </ul>
  </div>
  <div class="flex">
    <input class="txt-message bg-white border px-2 py-1 flex-1" type="text"
    name="message" id="message">
    <button class="send-message bg-emerald-900 rounded-md cursor-pointer px-3 hover:bg-emerald-600 transition-colors duration-300">
      <div class="text-white text-lg flex justify-center items-center">
        <iconify-icon icon="iconoir:send-solid">
        </iconify-icon>
      </div>
    </button>
  </div>
</div>
    `;
  }
}
