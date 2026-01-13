import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../Database/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { firestore } from '../Database/firebaseConfig'; // Import Firestore
import { setDoc, doc } from 'firebase/firestore'; // Import Firestore methods
import { Ionicons } from '@expo/vector-icons'; // Import an icon library (Expo example)

export default function UserAuthentication({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false); // New state for password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Visibility for confirm password

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        navigation.replace('Tabs', { screen: 'Home' });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const handleAuthentication = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Invalid Input', 'Please fill in all the fields');
      return;
    }

    if (!passwordMatch) {
      Alert.alert('Password Error', 'Passwords do not match');
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRef = doc(firestore, 'user', user.uid);
        await setDoc(userRef, {
          email: user.email,
          name: name
        });

        console.log('User signed up with name:', name);
      }
    } catch (error) {
      Alert.alert('Authentication Error', error.message);
      console.error('Authentication error:', error.message);
    }
  };

  const handlePasswordConfirm = (confirmPasswordValue) => {
    setConfirmPassword(confirmPasswordValue);
    setPasswordMatch(confirmPasswordValue === password);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Logout Error', error.message);
      console.error('Logout error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View>
          <Text>Welcome, {user.email}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        <View style={styles.authContainer}>
          <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>
          {!isLogin && (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
              autoCapitalize="words"
            />
          )}
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInputField}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={!passwordVisible} // Toggle visibility here
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {!isLogin && (
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInputField}
                value={confirmPassword}
                onChangeText={handlePasswordConfirm}
                placeholder="Confirm Password"
                secureTextEntry={!confirmPasswordVisible}
              />
              <TouchableOpacity style={styles.icon} onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                <Ionicons
                  name={confirmPasswordVisible ? 'eye-off' : 'eye'}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          )}
          {!passwordMatch && <Text style={styles.errorText}>Passwords do not match</Text>}
          <Button title={isLogin ? 'Login' : 'Sign Up'} onPress={handleAuthentication} color={'#a098fb'} />
          <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor:'#e8e6ff'
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color:'#5d4489',
    fontWeight:'bold'
  },
  input: {
    height: 40,
    borderColor: '#a098fb', 
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 12,
    fontSize: 12,
    margin: 10,
  },
  passwordContainer: {
    flexDirection: 'row', 
    marginBottom: 16,
  },
  toggleText: {
    color: '#a098fb',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
  passwordInputField: {
    height: 40,
    borderColor: '#a098fb', 
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 12,
    fontSize: 12,
    marginLeft: 10,
    marginRight: 3,
    width: 300
  },
  icon: {
    margin: 5,
    paddingTop: 10
  }
});
