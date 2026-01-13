import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native';

import axios from 'axios';

const FoodScanningScreen = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Request camera permissions
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required to take photos.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      sendImageToAPI(result.assets[0].uri);
    }
  };

  const sendImageToAPI = async (imageUri) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post('http://localhost:8000/predict/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data.prediction);  // Save the prediction object
    } catch (error) {
      console.error('Error calling API:', error);
      setError('Failed to predict food. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
  <Text style={styles.buttonText}>Take a Photo</Text>
</TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {prediction && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>
            Predicted Food: {prediction.name}
          </Text>
          <Text style={styles.predictionText}>
            Glycemic Index: {prediction.gi}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e8e6ff',
  },
  button: {
    backgroundColor: '#a098fb', // Change this to any color you like
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  predictionContainer: {
    marginTop: 20,
  },
  predictionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default FoodScanningScreen;