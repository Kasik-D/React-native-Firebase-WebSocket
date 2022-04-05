import React from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  UserCredential,
  signInWithCredential,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  updateProfile,
  User as FirebaseUser,
  User,
  OAuthCredential,
} from "firebase/auth"
import { auth as Auth } from "../../Firebase/firebase-config"
import { navigationRef } from "../../utils/rootNavigation"
import { ROUTES } from "../../constants/constants"
import { AsyncStore } from "../../services/async-store"
import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"
import { AuthRequestPromptOptions, AuthSessionResult } from "expo-auth-session"

// чтобы закрыть всплывающее окно. Если вы забудете добавить это, всплывающее окно не закроется.
WebBrowser.maybeCompleteAuthSession()

export const AuthProvider = ({ children }: Props) => {
  // наш пользователь
  const [currentUser, setCurrentUser] = React.useState<FirebaseUser | null>(
    null
  )
  // флаг для крутилки
  const [loadingUser, setLoadingUser] = React.useState<boolean>(false)
  // флаг для крутилки нашего приложения
  const [loadingApp, setLoadingApp] = React.useState<boolean>(false)
  // сообщения об ошибки
  const [errorUserMessage, setErrorUserMessage] = React.useState<string | null>(
    null
  )
  // сообщения об успешности
  const [successUserMessage, setSuccessUserMessage] = React.useState<
    string | null
  >(null)

  // идентификаторы
  const [requst, response, promtAsunc] = Google.useAuthRequest({
    expoClientId:
      "expoClientId",
  })

  React.useEffect(() => {
    ;(async () => {
      // если ответ успешный
      if (response?.type === "success") {
        // получаем полномочия на вход пользователя в наш firebase
        const credential = GoogleAuthProvider.credential(
          response.authentication?.idToken,
          response.authentication?.accessToken
        )
        try {
          // записуем в наше локальное хранилище данные пользователя
          await AsyncStore.setValue(
            "google",
            JSON.stringify({
              idToken: response.authentication?.idToken,
              accessToken: response.authentication?.accessToken,
            })
          )
        } catch (error) {}
        handleSignInWithCredential(credential)
      }
    })()
  }, [response])

  const [isAuth, setIsAuth] = React.useState<boolean>(false)

  // функция сброса пароля
  const resetPassword = (password: string) => {
    setLoadingUser(true)
    return updatePassword(Auth.currentUser as User, password)
      .then(() => {
        setErrorUserMessage("")
        setSuccessUserMessage("Password reset successful")
        navigationRef.current.navigate(ROUTES.profile)
      })
      .catch(() => {
        setErrorUserMessage("Failed to reset password")
      })
      .finally(() => {
        setLoadingUser(false)
        setTimeout(() => {
          setSuccessUserMessage(null)
        }, 5000)
      })
  }

  // функция обновления профиля пользователя
  const handleUpdateProfile = (displayName: string) => {
    setLoadingUser(true)
    console.log("displayName", displayName)
    return updateProfile(Auth.currentUser as User, {
      displayName,
    })
      .then(() => {
        console.log("YES")
        setErrorUserMessage("")
        setSuccessUserMessage("Profile update successful")
        navigationRef.current.navigate(ROUTES.profile)
      })
      .catch(() => {
        setErrorUserMessage("Failed to profile update")
      })
      .finally(() => {
        setLoadingUser(false)
        setTimeout(() => {
          setSuccessUserMessage(null)
        }, 5000)
      })
  }

  // функция сброса почты
  const resetPasswordOnEmail = (email: string) => {
    setLoadingUser(true)
    return sendPasswordResetEmail(Auth, email)
      .then(() => {
        setErrorUserMessage(null)
        setSuccessUserMessage("Check your email address")
        navigationRef.current.navigate(ROUTES.login)
      })
      .catch((error) => {
        setErrorUserMessage("Failed to reset password on email")
        console.log("error", error)
      })
      .finally(() => {
        setLoadingUser(false)
        setTimeout(() => {
          setSuccessUserMessage(null)
        }, 5000)
      })
  }

  // функция выхода
  const logout = async () => {
    setLoadingUser(true)
    try {
      // удаляем состояния нашего локального хранилищя
      await AsyncStore.deleteValue("user")
      await AsyncStore.deleteValue("google")
    } catch (error) {
      setErrorUserMessage("AsyncStore error")
    }
    return Auth.signOut()
      .then(() => {
        setErrorUserMessage(null)
        setIsAuth(false)
      })
      .catch(() => {
        setErrorUserMessage("Failed to log out")
      })
      .finally(() => {
        setLoadingUser(false)
      })
  }

  // функция входа в firebase через google
  const handleSignInWithCredential = (credential: OAuthCredential) => {
    signInWithCredential(Auth, credential)
      .then(() => {
        Auth?.onAuthStateChanged((user) => {
          setCurrentUser(user)
        })
        setIsAuth(true)
        setErrorUserMessage(null)
        setSuccessUserMessage("Success")
      })
      .catch((error) => {
        console.log("error", error)
        setErrorUserMessage("Failed to log in with Google")
      })
      .finally(() => {
        setTimeout(() => {
          setSuccessUserMessage(null)
        }, 5000)
      })
  }

  // функция входа в firebase через email и password
  const login = async (email: string, password: string) => {
    setLoadingUser(true)
    try {
      // записуем в наше локальное хранилище данные пользователя
      await AsyncStore.setValue(
        "user",
        JSON.stringify({
          email,
          password,
        })
      )
    } catch (error) {
      setErrorUserMessage("AsyncStore error")
    }
    // делаем вход в наш firebase
    return signInWithEmailAndPassword(Auth, email, password)
      .then(() => {
        setErrorUserMessage(null)
        setIsAuth(true)
      })
      .catch((error) => {
        setErrorUserMessage("Incorrect login or password")
        console.log("error", error)
      })
      .finally(() => {
        setLoadingUser(false)
      })
  }

  // функция регистраци польвателя firebase
  const singUp = (email: string, password: string) => {
    setLoadingUser(true)
    return createUserWithEmailAndPassword(Auth, email, password)
      .catch(() => {
        setErrorUserMessage("Failed to sing up")
      })
      .then(() => {
        setErrorUserMessage("")
        setIsAuth(true)
      })
      .finally(() => {
        setLoadingUser(false)
      })
  }

  React.useEffect(() => {
    // когда меняется состояние AuthState записуем нашего пользователя
    const unSubscribe = Auth?.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
    return unSubscribe
  }, [])

  // при входе в приложения проверяем есть ли пользователь в локальном хранилище
  React.useEffect(() => {
    ;(async () => {
      setLoadingApp(true)
      try {
        let user: { email: string; password: string } | null | string

        await AsyncStore.getValue("user")
        user = user != null ? JSON.parse(user) : null
        console.log("user", user)
        if (user) {
          await login(user.email, user.password)
        } else {
          let google: { idToken: string; accessToken: string } | null | string =
            await AsyncStore.getValue("google")
          google = google != null ? JSON.parse(google) : null
          if (google) {
            const credential = GoogleAuthProvider.credential(
              google.idToken,
              google.accessToken
            )
            handleSignInWithCredential(credential)
          }
        }
      } catch (error) {
        setErrorUserMessage("AsyncStore error")
      } finally {
        setLoadingApp(false)
      }
    })()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        singUp,
        login,
        logout,
        resetPassword,
        resetPasswordOnEmail,
        handleUpdateProfile,
        loadingUser,
        loadingApp,
        errorUserMessage,
        successUserMessage,
        isAuth,
        promtAsunc,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

type Props = {
  children: React.ReactNode
}

// прописуем типы для наших value
type ContextProps = {
  currentUser: FirebaseUser | null
  singUp: (email: string, password: string) => Promise<void> | void
  login: (
    email: string,
    password: string
  ) => Promise<UserCredential | void> | void
  logout: () => Promise<UserCredential | void> | void
  resetPassword: (password: string) => Promise<void> | void
  resetPasswordOnEmail: (email: string) => Promise<void> | void
  handleUpdateProfile: (displayName: string) => Promise<void> | void
  promtAsunc: (
    options?: AuthRequestPromptOptions | undefined
  ) => Promise<AuthSessionResult> | void
  loadingUser: boolean
  loadingApp: boolean
  errorUserMessage: string | null
  successUserMessage: string | null
  isAuth: boolean
}

export const AuthContext = React.createContext<ContextProps>({
  currentUser: null,
  promtAsunc: () => {},
  singUp: () => {},
  login: () => {},
  logout: () => {},
  resetPassword: () => {},
  resetPasswordOnEmail: () => {},
  handleUpdateProfile: () => {},
  loadingUser: false,
  loadingApp: false,
  errorUserMessage: null,
  successUserMessage: null,
  isAuth: false,
})

export const useAuthContext = () => {
  const authContext = React.useContext(AuthContext)
  if (!authContext) {
    throw new Error("useAuthContext must be used within a AuthProvider")
  }
  return authContext
}
