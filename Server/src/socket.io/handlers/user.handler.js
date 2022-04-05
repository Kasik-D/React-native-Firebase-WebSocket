// Регистрируем обработку соответствующих событий:
// user:connectToRoom — присоединения пользователя к комнате
// user:leaveToRoom — события когда пользователь покидает комнату

export default function usersHandlers(io, socket) {
  // обрабатываем присоединения пользователя к комнате
  const joinRoom = ({ roomId }) => {
    // присоединяемся к комнате
    socket.join(roomId)
    console.log("join on room", roomId)
  }

  // обрабатываем событие когда пользователь покидает комнату
  const leaveRoom = ({ roomId }) => {
    // покидаем комнату
    socket.leave(roomId)
    console.log("disconnect on room", roomId)
  }

  // регистрируем обработчики
  socket.on("user:connectToRoom", joinRoom)
  socket.on("user:leaveToRoom", leaveRoom)
}
