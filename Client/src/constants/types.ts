export type DataMessages =  {
  _id :  string,
  roomName : string,
  messages : messagesType
}

export type User = {
    Name : string
    Age : number
    id : string
}

export type usersTypingType = {
  userName : string
  userId : string
}

export type MessageUser = {
  _id : string,
  name : string,
  avatar? : string
}

export type usersOBJ = {users : Array<{userName : string, online : boolean}>  }
export type usersType = Array<{userName : string, online : boolean, avatar? : string }>
export type roomsOBJ = {rooms : Array<DataMessages> } 
export type roomsType = Array<DataMessages> 
export type messagesOBJ = {messages :  Array<{_id : string, user : {
    _id  : string,
    name : string,
    avatar? : string
} , senderName : string, text : string, createdAt :string, currentUser? : boolean}> }
export type messagesType = Array<{_id : string, user : {
    _id  : string,
    name : string,
    avatar? : string
} , senderName : string, text : string, createdAt :string, currentUser? : boolean}>

// Тип событий, которые мы отправляем на сервер
export interface ClientToServerEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: number[]) => void;
    'user:add' : ({ userName , userId } : { userName : string, userId : string, avatar? : string | undefined | null }) =>  void
    'message:get' : ({ roomId } : {roomId : string}) => void
    "message:add" : ({ _id , createdAt, text , user, roomId} : {_id :string, createdAt : string,  text : string , user : MessageUser, roomId : string} )  => void
    "message:remove" : ( _id : string ) => void
    "user:leave" : ( _id : string ) => void
    "user:connectToRoom" : ( { roomId } : { roomId : string } ) => void
    "user:leaveToRoom" : ( { roomId } : { roomId : string } ) => void
    "user:typing" : ({ userName , userId, roomId } : { userName : string, userId : string, roomId : string }) => void
    "user:stopTyping" : ({ userName , userId, roomId } : { userName : string, userId : string,  roomId : string }) => void
    "rooms:get" : () => void
    "room:add" : ( { roomId, roomName } : { roomId : string, roomName : string } ) => void
  }
  
// Тип событий, которые мы получаем из сервер
export interface ServerToClientEvents {
    withAck: (d: string, cb: (e: number) => void) => void;
    users : (users : usersOBJ) => void
    messages : (messages : messagesType) => void
    rooms : (rooms : roomsOBJ) => void
    usersTyping : (userTyping : usersTypingType) => void
    usersStopTyping : (userStopTyping : usersTypingType) => void
  }