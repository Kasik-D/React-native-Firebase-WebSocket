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
import { resetPasswordOnEmailSchema } from "../validation/schemas/resetPasswordOnEmail"

// тип для значений форми
type FormValuesType = {
  email: string
}

type NavigationProps = NativeStackNavigationProp<AuthStackParamList>

export const ResetPasswordOnEmail = () => {
  const { resetPasswordOnEmail, loadingUser, errorUserMessage } = useAuth()

  const navigation = useNavigation<NavigationProps>()

  // начальные значения
  const initialValues = {
    email: "",
  }

  const handleFormSubmit = async (values: FormValuesType) => {
    await resetPasswordOnEmail(values.email)
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
        validationSchema={resetPasswordOnEmailSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit }) => (
          <BoxContainer>
            <Text fontSize="21" fontWeight="bold">
              Reset Password
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
                mt: 2,
              }}
              inputProps={{
                keyboardType: "email-address",
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
              Reset Password
            </Button>
          </BoxContainer>
        )}
      </Formik>
      <HStack mt="4">
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.login)}>
          <Text fontSize="17" color="blue.500" ml="2">
            Log In
          </Text>
        </TouchableOpacity>
      </HStack>
    </Layout>
  )
}
