import { Server } from 'socket.io'
import * as sessionManager from './lib/sessionManager.js'


/** @type {import('socket.io').Server | undefined} */
export let io

/**
 * 
 * @param {import("node:http").Server} httpServer 
 */
export function setupWebSocketServer(httpServer) {
  io = new Server(httpServer)

  //usa middleware de session para poner el objeto request.session en socket
  io.engine.use(sessionManager.middleware)
  const onlineUsers = new Map();

  io.on('connection', socket => {
    // console.log(socket.request.session.fullname,'está en linea')
    const session = socket.request.session;
    const user = session?.user;
    // const sessionId = socket.request.session.id;
    // console.log(socket.request.session,sessionId);
    if(!user)return;

    onlineUsers.set(user.id,{
      id:user.id,
      fullname:user.fullname,
      socketId:socket.id
    })

    io.emit('update-online-users',[...onlineUsers.values()])

    socket.on('start-private-chat',(targetUserId)=>{
      const userStartChat = user.id;
      const targetUser = onlineUsers.get(targetUserId)

      if(!targetUser){
        socket.emit('chat-error','El usuario no está conectado.')
        return;
      }

      const roomId = [userStartChat,targetUserId].sort().join('--')

      socket.join(roomId)

      const targetSocket = io.sockets.sockets.get(targetUser.socketId)
      if(targetSocket){
        targetSocket.join(roomId)
      }

      socket.emit('private-chat-started',{roomId,withUser:targetUser})
      if(targetSocket){
        targetSocket.emit('private-chat-started',{roomId,withUser:onlineUsers.get(userStartChat)})
      }
    })

    // ----Lógica para enviar mensajes---
    socket.on('send-private-message',({roomId,content})=>{
      const message = {
        content,
        author: onlineUsers.get(user.id),
        timestamp:new Date()
      }

      // Envio mensaje a la sala especifica
      io.to(roomId).emit('new-private-message',message);      
    })
    socket.on('disconnect',()=>{
      onlineUsers.delete(user.id);
      io.emit('update-online-users',[...onlineUsers.values()])
    })
    // crear una sala de chat con el sessionId
    // socket.join(sessionId)
    // socket.join('users-online')

    // socket.on('chat-message', payload => {
    //   console.log(`Mensaje recibido del cliente id: ${socket.id} y texto: "${payload}"`)
    //   io.emit('chat-message', payload)
    // })
  })
}