import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack"
import { Box, Center, HStack, Text } from "native-base"
import React from "react"
import { UsersList } from "../components"
import { DEVICE_WIDTH, ROUTES } from "../constants/constants"
import { MainStackParamList } from "../navigation/MainNavigator"
import { AntDesign } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { TouchableOpacity } from "react-native"
import { GiftedChat, IMessage } from "react-native-gifted-chat"
import { useAuth, useChat } from "../hooks"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
// для инимации typing
import { TypingAnimation } from "react-native-typing-animation"

// Для проверки route реквизитов
type RouteProps = NativeStackScreenProps<MainStackParamList, ROUTES.chat>

// создаем тип для проверки маршрутов и параметров
type NavigationProps = NativeStackNavigationProp<MainStackParamList>

export const Chat = ({ route }: RouteProps) => {
  // получаем id комнаты и название комнаты
  const roomId = route?.params?.roomId
  const roomName = route?.params?.roomName

  const [isOpen, setIsOpen] = React.useState(false)

  // получаем текущего пользователя
  const { currentUser } = useAuth()

  // получаем наши сообщения и список пользователей
  // так же получаем callback для отправки сообщения и callback когда пользователь печатает
  const { messages, sendMessage, users, handleInputTextChanged, usersTyping } =
    useChat({
      roomId,
      userId: currentUser?.email as string,
      userName: currentUser?.displayName as string | "user",
    })

  // создаем массив для наших сообщений
  const [messagesTemp, setMessagesTemp] = React.useState<IMessage[] | []>(
    messages
  )

  React.useEffect(() => {
    setMessagesTemp(messages)
  }, [messages.length])

  const navigation = useNavigation<NavigationProps>()

  const onClose = () => {
    setIsOpen(false)
  }

  // функия которая отрабатывает при отправки сообщения
  const onSend = React.useCallback((messages = []) => {
    setMessagesTemp((previousMessages: IMessage[]) =>
      GiftedChat.append(previousMessages, messages)
    )
    const { _id, createdAt, text, user } = messages[0]
    sendMessage({
      _id,
      createdAt,
      text,
      user,
      roomId,
    })
  }, [])

  // компонент которые будет отображатся когда пользователь будет печатать
  const renderFooter = () => {
    if (usersTyping?.length) {
      return (
        <HStack padding="2" maxWidth="200">
          <TypingAnimation
            style={{
              marginRight: 32,
            }}
          />
          {usersTyping?.map((item, index) => {
            return (
              <Text mr="1">
                {item.userName}
                {index + 1 === usersTyping.length ? "" : ","}
              </Text>
            )
          })}
          <Text>is typing</Text>
        </HStack>
      )
    }
    return null
  }

  return (
    <SafeAreaView
      edges={["right", "top", "left"]}
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <StatusBar />
      <Box
        width={DEVICE_WIDTH}
        justifyContent="center"
        flexDirection="row"
        position="relative"
      >
        <Center
          position="absolute"
          left="0"
          top="0"
          zIndex="3"
          width="16"
          height="12"
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        </Center>
        <Box position="relative" width="100%">
          <TouchableOpacity activeOpacity={0.5} onPress={() => setIsOpen(true)}>
            <Box alignItems="center">
              <Text fontSize="18" maxWidth="180" noOfLines={1}>
                {roomName}
              </Text>
              <Text>
                users {users?.length},{" "}
                {
                  users?.filter((user) => {
                    return user.online === true
                  }).length
                }{" "}
                online
              </Text>
            </Box>

            <Box position="absolute" right="0" top="3">
              <Box
                background="#fff"
                height="40px"
                borderRadius="25"
                paddingX="6"
              >
                <Text fontSize="16px" mr="3" color="#000">
                  Users
                </Text>
              </Box>
            </Box>
          </TouchableOpacity>
        </Box>
      </Box>
      <GiftedChat
        messages={messagesTemp}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: currentUser?.email as string | number,
          avatar: currentUser?.photoURL || "https://i.pravatar.cc/300",
          name: currentUser?.displayName || "user",
        }}
        messagesContainerStyle={{
          backgroundColor: "#fff",
        }}
        // если true появляется иконка прокрутки чата к концу
        scrollToBottom={true}
        renderUsernameOnMessage={true}
        onInputTextChanged={handleInputTextChanged}
        renderFooter={renderFooter}
      />
      <UsersList
        // модальное окно со списком пользователей
        isOpen={isOpen}
        onClose={onClose}
        users={users}
      />
    </SafeAreaView>
  )
}
