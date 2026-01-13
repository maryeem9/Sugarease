import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../Database/firebaseConfig'; // Your Firebase configuration

const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password don't match!");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No user is currently logged in.");
      return;
    }

    try {
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
      Alert.alert("Success", "Password changed successfully!");
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Password:</Text>
      <TextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        placeholder="Enter current password"
      />
      
      <Text style={styles.label}>New Password:</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder="Enter new password"
      />

      <Text style={styles.label}>Confirm New Password:</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Confirm new password"
      />

      <Button title="Change Password" onPress={handleChangePassword} color={'#a098fb'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e8e6ff',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
   
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default ChangePasswordScreen;
