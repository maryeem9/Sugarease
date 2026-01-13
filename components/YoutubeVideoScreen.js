import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const YouTubeVideoScreen = ({ route }) => {
  const { videoId, title } = route.params; // Receive title along with videoId
  const navigation = useNavigation(); // Get navigation prop

  // Function to handle back navigation
  const handleBackPress = () => {
    navigation.goBack(); // Navigate back to previous screen (InfoHubScreen)
  };

  return (
    <View style={styles.container}>
      {/* Custom back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* YouTube video embedded in WebView */}
      <WebView
        source={{ uri: `https://www.youtube.com/watch?v=${videoId}` }}
        style={styles.videoPlayer} // Adjusted style for the video player
      />

      {/* Video title displayed below the video */}
      {/* <Text style={styles.videoTitle}>{title}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10, // Added padding to give space for the back button
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
    backgroundColor: '#e7573a',
    padding: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  videoPlayer: {
    flex: 1, // Make the video player take available space
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold', // Make the title bold
    padding: 10,
    textAlign: 'center', // Center the title
    backgroundColor: '#f0f0f0', // Optional background for better readability
  },
});

export default YouTubeVideoScreen;
