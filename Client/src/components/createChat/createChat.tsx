import { Formik } from "formik"
import "react-native-get-random-values"
import { nanoid } from "nanoid"
import { Box, Button, Icon, IconButton } from "native-base"
import React from "react"
import { Modal } from "react-native"
import { createChatSchema } from "../../validation/schemas/createChat"

import { CloseInput } from "../icons"
import { Layout } from "../layout/layout"
import { TextField } from "../text-field/text-field"

type FormValuesType = {
  roomName: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  createRoom: ({
    roomId,
    roomName,
  }: {
    roomId: string
    roomName: string
  }) => void
}

export const CreateChat = ({ isOpen, onClose, createRoom }: Props) => {
  const initialValues = {
    roomName: "",
  }

  const handleFormSubmit = (values: FormValuesType) => {
    // создаем комнату
    // roomId генирируем через библиотеку nanoid
    createRoom({ roomId: nanoid(), roomName: values.roomName })
    onClose()
  }

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isOpen}
      onRequestClose={() => {
        onClose()
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={createChatSchema}
        onSubmit={handleFormSubmit}
      >
        {({ handleSubmit }) => (
          <Layout isScrollable={false}>
            <Box
              backgroundColor="white"
              flex={1}
              paddingBottom="30"
              overflow="hidden"
            >
              <Box position="relative" pt="20" paddingX="4">
                <IconButton
                  position="absolute"
                  top="4"
                  right="0"
                  marginRight={4}
                  onPress={() => {
                    onClose()
                  }}
                  icon={<Icon as={CloseInput} size={10} />}
                />
              </Box>
              <Box mt="6" px="6" flex={1}>
                <TextField
                  // ❗ name должен совпадать со значением из initialValues
                  name={"roomName"}
                  placeholder="Name"
                  label="Chat Name"
                  wrapperProps={{
                    mb: 7,
                  }}
                  inputProps={{
                    fontSize: 16,
                  }}
                />
                <Button
                  backgroundColor="blue.500"
                  _pressed={{
                    background: "blue.400",
                  }}
                  width="100%"
                  onPress={() => handleSubmit()}
                  _text={{
                    fontSize: 16,
                  }}
                >
                  Create Chat
                </Button>
              </Box>
            </Box>
          </Layout>
        )}
      </Formik>
    </Modal>
  )
}
