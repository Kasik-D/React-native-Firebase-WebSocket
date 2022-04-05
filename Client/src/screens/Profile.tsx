import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Box, Button, Text } from "native-base"
import React from "react"
import { Layout } from "../components"
import { ROUTES } from "../constants/constants"
import { useAuth } from "../hooks"
import { MainStackParamList } from "../navigation/MainNavigator"

// создаем тип для проверки маршрутов и параметров
type NavigationProps = NativeStackNavigationProp<MainStackParamList>

export const Profile = () => {
  const {
    loadingUser,
    errorUserMessage,
    currentUser,
    logout,
    successUserMessage,
  } = useAuth()

  const navigation = useNavigation<NavigationProps>()

  return (
    <Layout
      wrapperOptions={{
        padding: 3,
        mt: 10,
        alignItems: "center",
      }}
    >
      <Box
        alignItems="center"
        width="100%"
        mt="4"
        shadow="1"
        height="auto"
        background="#fff"
        padding="8"
      >
        {successUserMessage && (
          <Box bg="green.500" width="100%" padding="1" alignItems="center">
            <Text fontSize="21" fontWeight="bold">
              {successUserMessage}
            </Text>
          </Box>
        )}
        <Text fontSize="21" fontWeight="bold">
          Profile
        </Text>
        {errorUserMessage && (
          <Box
            backgroundColor="red.300"
            alignItems="center"
            padding="3"
            my="3"
            width="100%"
          >
            <Text fontSize="16" color="red.900">
              {errorUserMessage}
            </Text>
          </Box>
        )}
        <Text fontSize="16" mb="3" mt="3">
          Email : {currentUser?.email}
        </Text>
        {currentUser?.displayName && (
          <Text fontSize="16" mb="3" mt="3">
            Name : {currentUser?.displayName}
          </Text>
        )}
        <Button
          mt="3"
          fontSize="16"
          backgroundColor="blue.500"
          _pressed={{
            background: "blue.400",
          }}
          width="100%"
          onPress={() => navigation.navigate(ROUTES.upDateProfile)}
        >
          Update Profile
        </Button>
        <Button
          mt="3"
          fontSize="16"
          backgroundColor="blue.500"
          _pressed={{
            background: "blue.400",
          }}
          width="100%"
          onPress={() => navigation.navigate(ROUTES.resetPassword)}
        >
          Reset Password
        </Button>
        <Button
          mt="3"
          fontSize="16"
          backgroundColor="blue.500"
          _pressed={{
            background: "blue.400",
          }}
          width="100%"
          onPress={() => navigation.navigate(ROUTES.selectChat)}
        >
          Select Chat
        </Button>
      </Box>
      <Button
        mt="3"
        isLoading={loadingUser}
        fontSize="16"
        variant="ghost"
        _pressed={{
          background: "gray.100",
        }}
        width="100%"
        _text={{
          color: "blue.500",
        }}
        onPress={async () => {
          await logout()
        }}
      >
        Log Out
      </Button>
    </Layout>
  )
}
