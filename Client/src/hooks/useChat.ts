import React from 'react';
import { IMessage } from 'react-native-gifted-chat';
import { messagesType, MessageUser, usersType, usersOBJ, usersTypingType } from '../constants/types'
import { useAuth, useWebSocket } from '../hooks/index';

// проверяем на параметры наш хук
type Props = {
    roomId : string,
    userId :string,
    userName : string,
}

export const useChat = ({ roomId , userId, userName } : Props)  => {
  // локальное состояние для пользователей
  const [users, setUsers] = React.useState<usersType | []>([])
   // локальное состояние для пользователей
  const [usersTyping, setUsersTyping] = React.useState<usersTypingType[] | []>([])
  // локальное состояние для сообщений
  const [messages, setMessages] = React.useState<IMessage[] | []>([])

  // получаем наш сокет и функции 
  const { socketRef, leaveInRoom, joinInRoom } = useWebSocket()

  // получаем нашего пользователя 
  const {currentUser } = useAuth()

  // создаем timeout для идентификатора печатания пользователя
  const timeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  // создаем Ref состаяния печатает ли пользователь
  const isTypingRef = React.useRef<boolean>(false);


  React.useEffect(() => {

    // подключаемся к комнате
    joinInRoom({ roomId });

    return () => {
        // при демонтировании компонента выполняем отключение от комнаты
        leaveInRoom({roomId})
    }   

  }, [roomId, userId, userName])

  React.useEffect(() => {

    // отправляем запрос на получение сообщений
    socketRef?.current?.emit('message:get', { roomId })

    // обрабатываем получение сообщений
    socketRef?.current?.on("messages" , (messages : messagesType) => {

      // обновляем массив сообщений
      setMessages(messages.reverse() as IMessage[] | [])
    })
       
    return () => {
      // удаляет указанный прослушиватель из массива прослушивателей для события с именем messages .
      socketRef?.current?.off("messages")
    }   

  }, [roomId, userId, userName])

  React.useEffect(() => {
    
    // отправляем событие добавления пользователя,
    socketRef?.current?.emit('user:add', { userName, userId, avatar: currentUser?.photoURL || 'https://i.pravatar.cc/300' })

      // обрабатываем получених пользователей
    socketRef?.current?.on("users", (users : usersOBJ) => {

      // обновляем массив пользователей
      setUsers(users.users)
    })

    return () => {
        // удаляет указанный прослушиватель из массива прослушивателей для события с именем users .
        socketRef?.current?.off("users")
    }   

  }, [roomId , userId, userName])

  React.useEffect(() => {
    
    // получаем пользотеля который начал печатать
    socketRef?.current?.on("usersTyping", (userTyping : usersTypingType) => {
        // обновляем массив пользотелей которые печатают
        setUsersTyping((prev) => {
          const temp = prev.slice()
          // если пользователь уже есть не добавляем эго
          !temp.some(item => item.userId === userTyping.userId) && temp.push(userTyping)
          // if (temp.some(item => item.userId === userTyping.userId)) {

          // } else {
          //   temp.push(userTyping)
          // }
          return temp
        })
    })

    return () => {
        // удаляет указанный прослушиватель из массива прослушивателей для события с именем usersTyping .
        socketRef?.current?.off("usersTyping")
    }   

  }, [roomId , userId, userName])

  React.useEffect(() => {
    
     // получаем пользотеля который перестал печатать
    socketRef?.current?.on("usersStopTyping", (userStopTyping : usersTypingType) => {
        // обновляем массив пользотелей которые печатают
        setUsersTyping((prev) => {
          const temp = prev.slice()
          // содаем index пользователя которого будем удалять
          let indexDelete = 0
          if (temp.some((item, index) => {
            if (item.userId === userStopTyping.userId) {
              indexDelete = index
              return true
            }
            return false 
           })) {
            // удаляем пользователя
            temp.splice(indexDelete, 1)
          }
          return temp
        })
    })

    return () => {
        // удаляет указанный прослушиватель из массива прослушивателей для события с именем usersStopTyping .
        socketRef?.current?.off("usersStopTyping")
    }   

  }, [roomId , userId, userName])

    
  // функция отправки сообщения
  // принимает объект с текстом сообщения и именем отправителя
  const sendMessage = ({ _id, createdAt, text, user, roomId } : { _id : string, createdAt : string,  text : string , user  : MessageUser, roomId : string}) => {
    // отправляем событие что пользователя перестал печатать 
    socketRef?.current?.emit('user:stopTyping', { userName, userId, roomId })
    isTypingRef.current = false

    // отправляем событие на добавления сообщения
    socketRef?.current?.emit("message:add", {
        _id,
        createdAt,
        text,
        user,
        roomId,
    })
  }
  
    // функция удаления сообщения по id
    const removeMessage = (_id : string) => {
       // отправляем событие на удаления сообщения
        socketRef?.current?.emit('message:remove', _id)
    }

    // функция оброботки когда пользователь пичатает
    const handleInputTextChanged = (text : string) => {
      if (text) {
        if (!isTypingRef.current) {
          socketRef?.current?.emit('user:typing', { userName, userId, roomId })
          isTypingRef.current = true
        }
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          // отправляем событие что пользователя начал печатать
          socketRef?.current?.emit('user:stopTyping', { userName, userId, roomId })
          isTypingRef.current = false
        }, 1500);
      }
    }


    // возвращаем наши значения и функции
    return { users, messages, sendMessage, removeMessage, handleInputTextChanged, usersTyping }

}