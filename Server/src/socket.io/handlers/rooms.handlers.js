// Регистрируем обработку соответствующих событий:
// rooms:get — получение комнат
// rooms:add — добавление комнаты
// rooms:remove — удаление комнаты

// _id (string) — идентификатор комнаты
// roomName (object) — название комнаты
// messages (string) — массив сообщеный

import { LowSync, JSONFileSync } from "lowdb"
// БД хранится в директории "db" под названием "messages.json"
const adapter = new JSONFileSync("messages.json")
const db = new LowSync(adapter)

// Чтение данных из файла JSON, это установит содержимое db.data
await db.read()
// Установить данные по умолчанию
if (!db.data) {
  db.data = { rooms: [] }
  await db.write()
}

export default function roomsHandlers(io, socket) {
  // обрабатываем запрос на получение комнат
  const getRooms = async () => {
    // Чтение данных из файла JSON, это установит содержимое db.data
    await db.read()

    // получаем комнаты из БД
    const rooms = db.data

    // передаем комнаты пользователю
    io.emit("rooms", rooms)
  }

  // обрабатываем добавление комнаты
  // функция принимает идентификатор комнаты, название комнаты
  const addRoom = async ({ roomId, roomName }) => {
    db.data.rooms.push({
      _id: roomId,
      roomName,
      messages: [],
    })

    await db.write()
    // выполняем запрос на получение комнат
    getRooms()
  }

  // обрабатываем удаление комнаты
  // функция принимает id комнаты
  const removeRoom = (_id) => {
    db.data.rooms.remove({ _id })
    db.write()

    // выполняем запрос на получение комнат
    getRooms()
  }

  // регистрируем обработчики
  socket.on("rooms:get", getRooms)
  socket.on("room:add", addRoom)
  socket.on("room:remove", removeRoom)
}
