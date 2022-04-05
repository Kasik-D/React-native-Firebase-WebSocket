// Регистрируем обработку соответствующих событий:
// message:get — получение сообщений
// message:add — добавление сообщения
// message:remove — удаление сообщения

// _id (string) — индентификатор сообщения
// user (object) — пользователь
// text (string) — текст сообщения
// createdAt (date) — дата создания

import { LowSync, JSONFileSync } from "lowdb"
// БД хранится в директории "db" под названием "messages.json"
const adapter = new JSONFileSync("messages.json")
const db = new LowSync(adapter)

// Чтение данных из файла JSON, это установит содержимое db.data
await db.read()

export default function messageHandlers(io, socket) {
  // обрабатываем запрос на получение сообщений
  const getMessages = async ({ roomId }) => {
    // Чтение данных из файла JSON, это установит содержимое db.data
    await db.read()

    // получаем сообщения из БД
    const messages = db.data.rooms.find((item) => item._id === roomId).messages

    // передаем сообщения пользователям, находящимся в комнате
    // синонимы - распространение, вещание, публикация
    io.in(roomId).emit("messages", messages)
  }

  // обрабатываем добавление сообщения
  // функция принимает объект сообщения и идентификатор комнаты
  const addMessage = async ({ _id, createdAt, text, user, roomId }) => {
    db.data.rooms
      // ищем нашу конмату
      .find((item) => item._id === roomId)
      .messages.push({
        _id,
        createdAt,
        text,
        user,
      })

    await db.write()
    // выполняем запрос на получение сообщений
    getMessages({ roomId })
  }

  // обрабатываем удаление сообщение
  // функция принимает id сообщения
  const removeMessage = (_id) => {
    db.data.message.remove({ _id })
    db.write()

    // выполняем запрос на получение сообщений
    getMessages()
  }

  // регистрируем обработчики
  socket.on("message:get", getMessages)
  socket.on("message:add", addMessage)
  socket.on("message:remove", removeMessage)
}
