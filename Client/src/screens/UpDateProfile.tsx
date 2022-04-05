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
import { upDateProfileSchema } from "../validation/schemas/upDateProfile"

type FormValuesType = {
  displayName: string
}

// создаем тип для проверки маршрутов и параметров
type NavigationProps = NativeStackNavigationProp<MainStackParamList>

export const UpDateProfile = () => {
  const { handleUpdateProfile, loadingUser, errorUserMessage } = useAuth()

  const navigation = useNavigation<NavigationProps>()

  const initialValues = {
    displayName: "",
  }

  const handleFormSubmit = async (values: FormValuesType) => {
    await handleUpdateProfile(values.displayName)
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
        validationSchema={upDateProfileSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit }) => (
          <BoxContainer>
            <Text fontSize="21" fontWeight="bold">
              Update profile
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
              name={"displayName"}
              placeholder="Name"
              label="Name"
              wrapperProps={{
                mb: 7,
              }}
              inputProps={{
                fontSize: 16,
              }}
            />
            <Button
              isLoading={loadingUser}
              _text={{
                fontSize: 16,
              }}
              backgroundColor="blue.500"
              _pressed={{
                background: "blue.400",
              }}
              width="100%"
              onPress={() => handleSubmit()}
            >
              Update profile
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
