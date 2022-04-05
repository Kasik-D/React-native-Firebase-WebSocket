// Регистрируем обработку соответствующих событий:
// user:get — получение пользователей
// user:add — добавление пользователя
// user:leave — удаление пользователя
// user:typing — пользователь печатает сообщения
// user:stopTyping — пользователь перестал печатать сообщения

// userId — индентификатор пользователя
// online — индикатор нахождения пользователя в сети
// userName — имя пользователя
// avatar — аватар пользователя

import { LowSync, JSONFileSync } from "lowdb"
// БД хранится в директории "db" под названием "users.json"
const adapter = new JSONFileSync("users.json")
const db = new LowSync(adapter)

// Чтение данных из файла JSON, это установит содержимое db.data
await db.read()
// Установить данные по умолчанию
if (!db.data) {
  db.data = { users: [] }
  await db.write()
}

export default function userHandlers(io, socket) {
  // обрабатываем запрос на получение пользователей
  const getUsers = async () => {
    // Чтение данных из файла JSON, это установит содержимое db.data
    await db.read()

    // получаем сообщения из БД
    const users = db.data

    // передаем пользователей
    io.emit("users", users)
  }

  // обрабатываем добавление пользователя
  // функция принимает объект с именем пользователя и его id и avatar
  const addUser = async ({ userName, userId, avatar }) => {
    // проверяем, имеется ли пользователь в БД
    if (
      db.data &&
      db.data.users.find((el) => {
        return el.userId === userId
      })
    ) {
      // если имеется, меняем его статус на онлайн
      db.data.users.find((el) => {
        return el.userId === userId
      }).online = true
    } else {
      // если не имеется, добавляем его в БД
      db.data.users.push({ userId, online: true, userName, avatar })
    }
    await db.write()
    getUsers()
  }

  // обрабатываем удаление пользователя
  const removeUser = async (userId) => {
    // меняем его статус на офлайн
    if (db.data.users) {
      db.data.users.find((el) => el.userId === userId).online = false
      await db.write()
    }
    getUsers()
  }

  // обрабатываем событие когда пользователь печатает
  const UserTyping = async ({ userId, userName, roomId }) => {
    // отправляем событие только в ту комнату где находится пользователь
    socket.to(roomId).emit("usersTyping", { userId, userName })
  }

  // обрабатываем событие когда пользователь перестал печатает
  const UserStopTyping = async ({ userId, userName, roomId }) => {
    socket.to(roomId).emit("usersStopTyping", { userId, userName })
  }

  // регистрируем обработчики
  socket.on("user:get", getUsers)
  socket.on("user:add", addUser)
  socket.on("user:leave", removeUser)
  socket.on("user:typing", UserTyping)
  socket.on("user:stopTyping", UserStopTyping)
}
