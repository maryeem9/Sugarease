import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// Import your screens
import HomeScreen from './Screens/HomeScreen';
import InfoHubScreen from './Screens/InfoHubScreen';
import AnalyticsScreen from './Screens/AnalyticsScreen';
import FoodScanningScreen from './Screens/FoodScanningScreen';
import BMIScreen from './Screens/BMIScreen';
import ChangePasswordScreen from './Screens/ChangePasswordScreen';
import UserAuthentication from './Screens/UserAthentication';
import VideoPlayerScreen from './Screens/VideoPlayerScreen';

import { signOut } from 'firebase/auth'; // Import signOut from Firebase Authentication
import { auth } from './Database/firebaseConfig';

// Create the Tab navigator and Stack navigator
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Define the Bottom Tab navigator
function Tabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Info Hub') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Food Scanning') {
            iconName = focused ? 'camera' : 'camera-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#a098fb',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Menu')}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen name="Info Hub" component={InfoHubScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Food Scanning" component={FoodScanningScreen} />
    </Tab.Navigator>
  );
}

// Define the Stack navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Authentication screens */}
        <Stack.Screen name="Login" component={UserAuthentication} options={{ headerShown: false }} />
        
        {/* Main app screens */}
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }} // Remove the default header for the tabs
        />
        <Stack.Screen name="BMI" component={BMIScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: 'Menu' }}
        />
        <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MenuScreen({ navigation }) {
  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Logs the user out from Firebase Authentication
      Alert.alert("Success", "You have been logged out."); // Display a success message
      navigation.replace('Login'); // Redirects to the Login screen
    } catch (error) {
      console.error('Logout error:', error.message); // Logs any errors that occur
      Alert.alert("Error", "Failed to log out. Please try again."); // Display an error message
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e8e6ff',
    }}>
      <TouchableOpacity onPress={() => navigation.navigate('BMI')} style={styles.optionContainer}>
        <Text style={styles.menuOptions}>BMI</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')} style={styles.optionContainer}>
        <Text style={styles.menuOptions}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.optionContainer}>
        <Text style={styles.menuOptions}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuOptions: {
    color: '#fbf9ff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  optionContainer: {
    backgroundColor: '#a098fb',
    margin: 10,
    elevation: 10,
    borderRadius: 10,
    padding: 10,
  },
});
