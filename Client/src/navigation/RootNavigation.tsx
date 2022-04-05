import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { useAuthContext } from "../hooks/context/auth-context"
// навигация не залолиненого пользователя
import { AuthNavigator } from "./AuthNavigator"
// навигация залолиненого пользователя
import { MainNavigator } from "./MainNavigator"
import { navigationRef } from "../utils/rootNavigation"

export const RootNavigation = ({ children }: { children: React.ReactNode }) => {
  // получаем идентификатор залогинен пользователь
  const { isAuth } = useAuthContext()

  return (
    // В зависимости залогинен пользоватль показываем эму группу экранов
    <NavigationContainer ref={navigationRef}>
      {isAuth ? <MainNavigator /> : <AuthNavigator />}
      {children}
    </NavigationContainer>
  )
}
