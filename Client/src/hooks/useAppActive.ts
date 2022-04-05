import React from "react";
import { AppState, AppStateStatus } from "react-native";

export const useAppActive = () => {
  // получаем Ref на состояние нашего приложения
  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState(appState.current);


  const listener = (nextAppState : AppStateStatus) => {
       if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
  }

  React.useEffect(() => {
  
    // добавляем слушатель
    AppState.addEventListener("change", listener)

    // отписуемся от него при демонтировании компоненты
    return () => {
      AppState.removeEventListener('change', listener);
    };

  }, []);

  // возвращаем наше состояние
  return { appStateVisible }
  
};


