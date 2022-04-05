import React from "react"
import { useNavigation } from "@react-navigation/native"
import { Box, Divider, HStack, Text } from "native-base"
import { FlatList, Platform, TouchableOpacity } from "react-native"
import { CreateChat, Layout } from "../components"
import { ROUTES } from "../constants/constants"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { MainStackParamList } from "../navigation/MainNavigator"
import { useAuth, useChats } from "../hooks"

// создаем тип для проверки маршрутов и параметров
type NavigationProps = NativeStackNavigationProp<MainStackParamList>

export const SelectChat = () => {
  // получаем нашего пользователя
  const { currentUser } = useAuth()

  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  // получаем комнаты, и функцию создание комнаты
  // передаем userId и userName, чтобы если пользователь создан в нашей бд отобразить что он в сети, если нет то создать эго
  const { rooms, createRoom } = useChats({
    userId: currentUser?.email as string,
    // если нет имнени передаем user
    userName: (currentUser?.displayName as string) || "user",
  })

  const navigation = useNavigation<NavigationProps>()

  // передаем параметры комнаты в наш chat
  const onPressChat = (index: number) => {
    navigation.navigate(ROUTES.chat, {
      roomId: rooms[index]._id,
      roomName: rooms[index].roomName,
    })
  }

  const onClose = () => {
    setIsOpen(false)
  }

  return (
    <Layout
      wrapperOptions={{
        padding: 3,
        mt: 2,
      }}
      isScrollable={false}
    >
      <HStack justifyContent="space-between">
        <Text fontSize="20" fontWeight="bold" color="blue.500">
          Chats
        </Text>
        <TouchableOpacity activeOpacity={0.3} onPress={() => setIsOpen(true)}>
          <Text fontSize="20" fontWeight="bold" color="blue.700">
            Create chat
          </Text>
        </TouchableOpacity>
      </HStack>
      <Divider my="2" />
      <FlatList
        data={rooms}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <>
              <TouchableOpacity
                activeOpacity={0.3}
                onPress={() => onPressChat(index)}
              >
                <HStack width="100%" justifyContent="space-between">
                  <Box>
                    <Text fontSize="20" fontWeight="bold">
                      {item.roomName}
                    </Text>
                    <Text fontSize="16" fontWeight="bold">
                      {item.messages.length !== 0 &&
                        item.messages[item.messages.length - 1].user.name}
                    </Text>
                    <Text fontSize="16">
                      {item.messages.length !== 0 &&
                        item.messages[item.messages.length - 1].text}
                    </Text>
                  </Box>
                  <Box>
                    {item.messages.length !== 0 && (
                      <Text>
                        {
                          // отображаем время последнего сообщения в комнате
                          Platform.OS === "ios"
                            ? new Date(
                                item.messages[
                                  item.messages.length - 1
                                ].createdAt
                              )
                                .toLocaleString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                })
                                .split(" ")
                            : new Date(
                                item.messages[
                                  item.messages.length - 1
                                ].createdAt
                              )
                                .toLocaleString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                })
                                .split(" ")[3]
                        }
                      </Text>
                    )}
                  </Box>
                </HStack>
              </TouchableOpacity>
              {index !== rooms.length - 1 ? <Divider my="2" /> : null}
            </>
          )
        }}
      />
      <CreateChat
        // модлка для создания комнаты
        isOpen={isOpen}
        onClose={onClose}
        createRoom={createRoom}
      />
    </Layout>
  )
}
