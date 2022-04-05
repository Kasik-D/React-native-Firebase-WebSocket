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
import { MainStackParamList } from "../navigation/MainNavigator"
// схема проверки значений форми на валидность
import { resetPasswordSchema } from "../validation/schemas/resetPassword"

// тип для значений форми
type FormValuesType = {
  password: string
}

type NavigationProps = NativeStackNavigationProp<MainStackParamList>

export const ResetPassword = () => {
  const { resetPassword, loadingUser, errorUserMessage } = useAuth()

  const navigation = useNavigation<NavigationProps>()

  // начальные значения
  const initialValues = {
    password: "",
  }

  const handleFormSubmit = async (values: FormValuesType) => {
    await resetPassword(values.password)
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
        validationSchema={resetPasswordSchema}
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
              name={"password"}
              placeholder="New password"
              label="New password"
              wrapperProps={{
                mb: 7,
              }}
              inputProps={{
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
              Reset Password
            </Button>
          </BoxContainer>
        )}
      </Formik>
      <HStack mt="4">
        <TouchableOpacity onPress={() => navigation.navigate(ROUTES.profile)}>
          <Text fontSize="17" color="blue.500" ml="2">
            Profile
          </Text>
        </TouchableOpacity>
      </HStack>
    </Layout>
  )
}
