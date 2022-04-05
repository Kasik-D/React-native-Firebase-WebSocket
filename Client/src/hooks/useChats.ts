import React from 'react'
import { roomsType, roomsOBJ } from '../constants/types'
import { useAppActive } from './useAppActive';

import { useAuth, useWebSocket } from '../hooks/index';

// проверяем на параметры наш хук
type Props = {
    userId :string,
    userName : string,
}

export const useChats = ({ userId, userName } : Props)  => {

  // локальное состояние для комнат
  const [rooms, setRooms] = React.useState<roomsType | []>([])
  
  // получаем функии connectToServer, disconnectToServer для нашего socket
  // и сам socket
  const { connectToServer, disconnectToServer, socketRef } = useWebSocket()
  const { currentUser } = useAuth()

  // получаем состояния нашего приложения
  const { appStateVisible } = useAppActive();

  React.useEffect(() => {
    // если приложения свернуто
    if (appStateVisible === 'background') {
      // вызываем функцию что пользователь вышел
      leaveUser(userId)
    }
    // если приложения стало активно
    if (appStateVisible === "active") {
      // вызываем функцию что пользователь зашел
      userConnect({userName,userId, avatar: currentUser?.photoURL || 'https://i.pravatar.cc/300' })
    }
  }, [appStateVisible]);


  React.useEffect(() => {
    // коннектимся к нашему серверу
    connectToServer()

    return () => {
        leaveUser(userId)
        // отключаемся от нашего серверу
        disconnectToServer()
        console.log("disconnect")
    }   

  }, [userId, userName])

  React.useEffect(() => {

    // отправляем запрос на получение комнат
    socketRef?.current?.emit('rooms:get')

    // обрабатываем получение комнаты
    socketRef?.current?.on("rooms" , (rooms : roomsOBJ) => {   
        setRooms(rooms?.rooms || [])
    })

    return () => {
        // удаляет указанный прослушиватель из массива прослушивателей для события с именем rooms .
        socketRef?.current?.off("rooms")
    }   

  }, [userId, userName])

  
  const createRoom = ({ roomId, roomName } : { roomId : string, roomName : string }) => {
    // отправляем запрос на добавления комнаты
    socketRef?.current?.emit("room:add" ,  {
        roomId,
        roomName,
    })
  }

  const leaveUser = (_id : string) => {
    // отправляем событие на отключение пользователя
    socketRef?.current?.emit('user:leave', _id)
  }

  const userConnect = ({ userId, userName, avatar } : {userId : string, userName : string, avatar : string}) => {
    // отправляем событие добавления пользователя
    socketRef?.current?.emit('user:add', { userName, userId, avatar })
  }


    // хук возвращает комнаты, и функцию создания комнаты
    return { rooms, createRoom }

}