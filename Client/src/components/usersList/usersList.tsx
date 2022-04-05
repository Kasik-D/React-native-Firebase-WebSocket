import {
  Box,
  Center,
  Divider,
  HStack,
  Icon,
  IconButton,
  Image,
  Text,
} from "native-base"
import React from "react"
import { FlatList, Modal } from "react-native"
import { usersType } from "../../constants/types"
import { CloseInput } from "../icons"
import { Layout } from "../layout/layout"

type Props = {
  isOpen: boolean
  onClose: () => void
  users: usersType | []
}

export const UsersList = ({ isOpen, onClose, users }: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isOpen}
      onRequestClose={() => {
        onClose()
      }}
    >
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
            <FlatList
              data={users}
              renderItem={({ item, index }) => {
                return (
                  <>
                    <HStack justifyContent="space-between">
                      {console.log("ffff", item.avatar)}
                      <HStack alignItems="center">
                        {item?.avatar && (
                          <Image
                            source={{ uri: item.avatar }}
                            size="10"
                            borderRadius="full"
                          />
                        )}
                        <Box ml="2">
                          <Text fontSize="16" fontWeight="bold">
                            {item.userName}
                          </Text>
                          <Text
                            fontSize="16"
                            color={item.online ? "blue.500" : "gray.500"}
                          >
                            {item.online ? "online" : "offline"}
                          </Text>
                        </Box>
                      </HStack>
                    </HStack>
                    {index !== users.length - 1 ? <Divider my="2" /> : null}
                  </>
                )
              }}
              keyExtractor={(item) => `${item.userName}${item.online}`}
              ListEmptyComponent={() => (
                // если список пустой
                <Center height="200px">
                  <Text fontSize="21">Empty data</Text>
                </Center>
              )}
            />
          </Box>
        </Box>
      </Layout>
    </Modal>
  )
}
