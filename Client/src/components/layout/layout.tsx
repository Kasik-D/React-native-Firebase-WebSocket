import { StatusBar } from "expo-status-bar"
import { Box, KeyboardAvoidingView } from "native-base"
import React from "react"
import { Platform, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { SafeAreaWrapper } from "../safe-area-wrapper/safe-area-wrapper"

type Props = {
  isScrollable?: boolean
  isKeyboardAvoiding?: boolean
  wrapperOptions?: any
  children?: React.ReactNode
}

export const Layout = ({
  isScrollable = true,
  isKeyboardAvoiding,
  wrapperOptions,
  children,
}: Props) => {
  const content = (
    <Box flexGrow={1} {...wrapperOptions}>
      {children}
    </Box>
  )

  return (
    <>
      <SafeAreaView
        // для корекного отображения экрана используем эту библиотеку
        edges={["right", "top", "left"]}
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <StatusBar />
        <Box flex={1} background="#ffffff">
          <KeyboardAvoidingView
            enabled={isKeyboardAvoiding}
            flex={1}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <SafeAreaWrapper>
              {isScrollable ? (
                <ScrollView
                  nestedScrollEnabled={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  {content}
                </ScrollView>
              ) : (
                <Box flex={1}>{content}</Box>
              )}
            </SafeAreaWrapper>
          </KeyboardAvoidingView>
        </Box>
      </SafeAreaView>
    </>
  )
}
