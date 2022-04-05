import React from "react"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
// для формы используем formik
import { Formik } from "formik"
import { Box, Button, HStack, Text } from "native-base"
import { TouchableOpacity } from "react-native"
import { BoxContainer, Layout } from "../components"
// поле ввода для formik
import { TextField } from "../components/text-field/text-field"
import { ROUTES } from "../constants/constants"
import { useAuth } from "../hooks"
import { AuthStackParamList } from "../navigation/AuthNavigator"
// схема проверки значений форми на валидность
import { loginSchema } from "../validation/schemas/login.schema"

// тип для значений форми
type FormValuesType = {
  email: string
  password: string
}

// создаем тип для проверки маршрутов и параметров
type NavigationProps = NativeStackNavigationProp<AuthStackParamList>

export const Login = () => {
  const {
    login,
    promtAsunc,
    loadingUser,
    errorUserMessage,
    successUserMessage,
  } = useAuth()

  const navigation = useNavigation<NavigationProps>()

  // начальные значения
  const initialValues = {
    email: "",
    password: "",
  }

  const handleFormSubmit = async (values: FormValuesType) => {
    await login(values.email, values.password)
  }

  return (
    <Layout
      wrapperOptions={{
        padding: 3,
        mt: 10,
        alignItems: "center",
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit }) => (
          <BoxContainer>
            <Text fontSize="21" fontWeight="bold">
              Log In
            </Text>
            {
              // выводим сообщения ошибки если оно есть
              errorUserMessage && (
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
              )
            }
            {
              // выводим сообщения успеха если оно есть
              successUserMessage && (
                <Box
                  backgroundColor="green.400"
                  alignItems="center"
                  padding="3"
                  my="3"
                  width="100%"
                >
                  <Text fontSize="16" color="green.800">
                    {successUserMessage}
                  </Text>
                </Box>
              )
            }
            <TextField
              // ❗ name должен совпадать со значением из initialValues
              name={"email"}
              placeholder="Email"
              label="Email"
              wrapperProps={{
                mb: 7,
              }}
              inputProps={{
                // выставляем тип для клавиатуры пользователя
                keyboardType: "email-address",
                fontSize: 16,
              }}
            />
            <TextField
              // ❗ name должен совпадать со значением из initialValues
              name={"password"}
              placeholder="Password"
              label="Password"
              wrapperProps={{
                mb: 7,
              }}
              inputProps={{
                // выставляем тип для клавиатуры пользователя
                type: "password",
                fontSize: 16,
              }}
            />
            <Button
              isLoading={loadingUser}
              fontSize="16"
              backgroundColor="blue.500"
              _pressed={{
                background: "blue.400",
              }}
              width="100%"
              onPress={() => handleSubmit()}
            >
              Log In
            </Button>
            <Button
              mt="3"
              fontSize="16"
              variant="unstyled"
              _pressed={{
                background: "gray.100",
              }}
              _text={{
                underline: true,
                color: "blue.400",
              }}
              width="100%"
              onPress={() =>
                promtAsunc({
                  showInRecents: true,
                })
              }
            >
              Log In With Google
            </Button>
            <Button
              mt="3"
              fontSize="16"
              variant="unstyled"
              _pressed={{
                background: "gray.100",
              }}
              _text={{
                underline: true,
                color: "blue.400",
              }}
              width="100%"
              onPress={() => navigation.navigate(ROUTES.resetPasswordOnEmail)}
            >
              Reset Password
            </Button>
          </BoxContainer>
        )}
      </Formik>
      <HStack mt="4">
        <Text fontSize="17">Need an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.singUp)}>
          <Text fontSize="17" color="blue.500" ml="2">
            Sing In
          </Text>
        </TouchableOpacity>
      </HStack>
    </Layout>
  )
}
