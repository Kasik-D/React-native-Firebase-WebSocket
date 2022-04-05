import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { ROUTES } from '../constants/constants';
import { ResetPassword } from '../screens/ResetPassword';

import { Profile } from '../screens/Profile';
import { ChatFirebase } from '../screens/ChatFirebase';
import { Chat } from '../screens/Chat';
import { SelectChat } from '../screens/SelectChat';
import { UpDateProfile } from '../screens/UpDateProfile';

// создаем ParamList для MainNavigator
export type MainStackParamList = {
  // если наш экран не принемает параметров передаем undefined
  [ROUTES.home]: undefined;
  [ROUTES.profile]: undefined;
  [ROUTES.resetPassword]: undefined;
  [ROUTES.chatFirebase]: undefined;
  [ROUTES.chat]: { roomId: string; roomName: string };
  [ROUTES.selectChat]: undefined;
  [ROUTES.upDateProfile]: undefined;
};

// создаем нашу навигацию
const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTES.profile}>
      <Stack.Group
        screenOptions={{
          // убираем header
          headerShown: false,
          contentStyle: {
            backgroundColor: '#fff',
          },
        }}
      >
        <Stack.Screen name={ROUTES.profile} component={Profile} />
        <Stack.Screen name={ROUTES.resetPassword} component={ResetPassword} />
        <Stack.Screen name={ROUTES.chatFirebase} component={ChatFirebase} />
        <Stack.Screen name={ROUTES.selectChat} component={SelectChat} />
        <Stack.Screen name={ROUTES.chat} component={Chat} />
        <Stack.Screen name={ROUTES.upDateProfile} component={UpDateProfile} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
