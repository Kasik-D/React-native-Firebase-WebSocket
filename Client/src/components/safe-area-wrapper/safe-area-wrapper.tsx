import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

type Props = {
  children?: React.ReactNode;
};

export const SafeAreaWrapper = ({ children }: Props) => {
  return <SafeAreaView style={styles.wrapper}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: -8,
    overflow: 'hidden',
  },
});
