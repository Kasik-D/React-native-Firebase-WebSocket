import cors from "cors"
import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { ALLOWED_ORIGIN } from "./config.js"
import onConnection from "./src/socket.io/onConection.js"
import onError from "./src/utils/onError.js"

const app = express()

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
  })
)

app.use(onError)

const server = createServer(app)

const io = new Server(server, {
  // ❗ ПРЕДУПРЕЖДЕНИЕ О БЕЗОПАСНОСТИ. Настройка источника *открывает возможность для фишинговых сайтов имитировать внешний вид вашего сайта
  cors: {
    origin: "*",
  },
})

// Событие коннекта сокета к серверу
io.on("connection", (socket) => {
  onConnection(io, socket)
})

// Событие не удачного коннекта сокета к серверу
io.on("connect_failed", function () {
  console.log("Connection Failed")
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`)
})
