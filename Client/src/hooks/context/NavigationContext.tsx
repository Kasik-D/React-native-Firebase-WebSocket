import { Center, Spinner } from 'native-base';
import React from 'react';

import { RootNavigation } from '../../navigation/RootNavigation';
import { useAuthContext } from '../context/auth-context';

export const NavigationContext = React.createContext<null>(null);

export const NavigationProvider = () => {
  return (
    <NavigationContext.Provider value={null}>
      <RootNavigation>
        <NavigationController />
      </RootNavigation>
    </NavigationContext.Provider>
  );
};

const NavigationController = () => {
  // получаем идентификатор залогинен пользователь и состояния загрузки
  const { loadingApp } = useAuthContext();

  if (loadingApp) {
    return (
      <Center flex={1}>
        <Spinner />
      </Center>
    );
  }

  return null;
};
