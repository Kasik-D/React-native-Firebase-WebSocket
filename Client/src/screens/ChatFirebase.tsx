import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from 'firebase/firestore';
import { db, auth } from '../Firebase/firebase-config';
import { Platform } from 'react-native';
import { Box } from 'native-base';

export const ChatFirebase = () => {
  const [massages, setMessages] = React.useState<any>([]);

  React.useEffect(() => {
    const collectionRef = collection(db, 'chats');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        })),
      );
    });

    return () => unsubscribe();
  }, []);

  const onSend = React.useCallback((messages = []) => {
    setMessages((previousMessages: any) =>
      GiftedChat.append(previousMessages, messages),
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(db, 'chats'), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  return (
    <SafeAreaView
      edges={['right', 'top', 'left']}
      style={{
        flex: 1,
        backgroundColor: Platform.OS === 'ios' ? '#000' : '#fff',
      }}
    >
      <Box flex={1} background='#ffffff'>
        <GiftedChat
          messages={massages}
          onSend={(massages) => onSend(massages)}
          user={{
            _id: auth?.currentUser?.email as string | number,
            avatar: auth?.currentUser?.photoURL || 'https://i.pravatar.cc/300',
          }}
          messagesContainerStyle={{
            backgroundColor: '#fff',
          }}
        />
      </Box>
    </SafeAreaView>
  );
};
