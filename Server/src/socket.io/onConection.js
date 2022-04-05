import userHandlers from "./handlers/user.handler.js"
import usersHandlers from "./handlers/users.handler.js"
import messageHandlers from "./handlers/message.handlers.js"
import roomsHandlers from "./handlers/rooms.handlers.js"

export default function onConnection(io, socket) {
  console.log("a user connected")

  // регистрируем обработчики для пользователя
  userHandlers(io, socket)

  // регистрируем обработчики для пользователей
  usersHandlers(io, socket)

  // регистрируем обработчики для сообщений
  messageHandlers(io, socket)

  // регистрируем обработчики для комнат
  roomsHandlers(io, socket)

  // Прослушивание событий отключения сокета от сервера
  socket.on("disconnect", () => {
    // выводим сообщение
    console.log("User disconnected")
  })
}
