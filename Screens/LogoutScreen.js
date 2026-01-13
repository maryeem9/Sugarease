import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LogoutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Logout Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e6ff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default LogoutScreen;
