import React from "react"
import { io, Socket } from "socket.io-client"
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../constants/types"

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents> | null

export const WebSocketProvider = ({ children }: Props) => {
  const socketRef = React.useRef<SocketType>(null)

  // создаем экземпляр сокета, передаем ему адрес сервера
  // и записываем объект с названием комнаты в строку запроса "рукопожатия"
  // socket.handshake.query.roomId
  const connectToServer = () => {
    socketRef.current = io("http://192.168.1.6:4000") //  http://192.168.1.6:4000
  }

  const joinInRoom = ({ roomId }: { roomId: string }) => {
    socketRef?.current?.emit("user:connectToRoom", {
      roomId,
    })
  }

  const leaveInRoom = ({ roomId }: { roomId: string }) => {
    socketRef?.current?.emit("user:leaveToRoom", {
      roomId,
    })
  }

  // при размонтировании компонента выполняем отключение сокета
  const disconnectToServer = () => {
    socketRef.current?.disconnect()
  }

  return (
    <WebSocketContext.Provider
      value={{
        socketRef,
        joinInRoom,
        leaveInRoom,
        connectToServer,
        disconnectToServer,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

type Props = {
  children: React.ReactNode
}

type ContextProps = {
  socketRef: React.MutableRefObject<SocketType> | null
  joinInRoom: ({ roomId }: { roomId: string }) => void
  leaveInRoom: ({ roomId }: { roomId: string }) => void
  connectToServer: () => void
  disconnectToServer: () => void
}

export const WebSocketContext = React.createContext<ContextProps>({
  socketRef: null,
  connectToServer: () => {},
  joinInRoom: () => {},
  leaveInRoom: () => {},
  disconnectToServer: () => {},
})

export const useWebSocketContext = () => {
  const webSocketContext = React.useContext(WebSocketContext)
  if (!webSocketContext) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    )
  }
  return webSocketContext
}
