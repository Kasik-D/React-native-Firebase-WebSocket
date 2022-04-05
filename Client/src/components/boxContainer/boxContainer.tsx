import { Box } from "native-base"
import React from "react"

type Props = {
  children?: React.ReactNode
}

export const BoxContainer = ({ children }: Props) => {
  return (
    <Box
      alignItems="center"
      width="100%"
      mt="4"
      shadow="1"
      height="auto"
      background="#fff"
      padding="8"
    >
      {children}
    </Box>
  )
}
