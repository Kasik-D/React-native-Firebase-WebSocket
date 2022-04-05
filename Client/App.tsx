import React from "react"
import { registerRootComponent } from "expo"
import { NativeBaseProvider } from "native-base"
import { AuthProvider } from "./src/hooks/context/auth-context"
import { NavigationProvider } from "./src/hooks/context/NavigationContext"
import { WebSocketProvider } from "./src/hooks/context/WebSocketContext"

function App() {
  return (
    <NativeBaseProvider>
      <AuthProvider>
        <WebSocketProvider>
          <NavigationProvider />
        </WebSocketProvider>
      </AuthProvider>
    </NativeBaseProvider>
  )
}

export default registerRootComponent(App)
