import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { ROUTES } from '../constants/constants';
import { Login } from '../screens/Login';
import { ResetPasswordOnEmail } from '../screens/ResetPasswordOnEmail';
import { SingUp } from '../screens/SingUp';

// создаем ParamList для AuthNavigator
export type AuthStackParamList = {
  // если наш экран не принемает параметров передаем undefined
  [ROUTES.login]: undefined;
  [ROUTES.singUp]: undefined;
  [ROUTES.resetPasswordOnEmail]: undefined;
};

// создаем нашу навигацию
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName={ROUTES.login}>
      <AuthStack.Group
        screenOptions={{
          // убираем header
          headerShown: false,
          contentStyle: {
            backgroundColor: '#fff',
          },
        }}
      >
        <AuthStack.Screen name={ROUTES.login} component={Login} />
        <AuthStack.Screen name={ROUTES.singUp} component={SingUp} />
        <AuthStack.Screen
          name={ROUTES.resetPasswordOnEmail}
          component={ResetPasswordOnEmail}
        />
      </AuthStack.Group>
    </AuthStack.Navigator>
  );
};
