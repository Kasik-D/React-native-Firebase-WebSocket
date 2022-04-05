import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Formik } from "formik"
import { Box, Button, HStack, Text } from "native-base"
import React from "react"
import { TouchableOpacity } from "react-native"
import { BoxContainer, Layout } from "../components"
import { TextField } from "../components/text-field/text-field"
import { ROUTES } from "../constants/constants"
import { useAuth } from "../hooks"
import { AuthStackParamList } from "../navigation/AuthNavigator"
// схема проверки значений форми на валидность
import { registrationSchema } from "../validation/schemas/registration.schema"

// тип для значений форми
type FormValuesType = {
  email: string
  password: string
  confirm_password: string
}

// создаем тип для проверки маршрутов и параметров
type NavigationProps = NativeStackNavigationProp<AuthStackParamList>

export const SingUp = () => {
  const { singUp, loadingUser, errorUserMessage } = useAuth()

  const navigation = useNavigation<NavigationProps>()

  const initialValues = {
    email: "",
    password: "",
    confirm_password: "",
  }

  const handleFormSubmit = async (values: FormValuesType) => {
    await singUp(values.email, values.password)
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
        validationSchema={registrationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit }) => (
          <BoxContainer>
            <Text fontSize="21" fontWeight="bold">
              Sing Up
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
            <TextField
              // ❗ name должен совпадать со значением из initialValues
              name={"email"}
              placeholder="Email"
              label="Email"
              wrapperProps={{
                mb: 7,
              }}
              inputProps={{
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
                type: "password",
                fontSize: 16,
              }}
            />
            <TextField
              // ❗ name должен совпадать со значением из initialValues
              name={"confirm_password"}
              placeholder="Confirm password"
              label="Confirm password"
              inputProps={{
                type: "password",
                fontSize: 16,
              }}
              wrapperProps={{
                mb: 7,
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
              Sing Up
            </Button>
          </BoxContainer>
        )}
      </Formik>
      <HStack mt="4">
        <Text fontSize="17">Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.login)}>
          <Text fontSize="17" color="blue.500" ml="2">
            Log In
          </Text>
        </TouchableOpacity>
      </HStack>
    </Layout>
  )
}
