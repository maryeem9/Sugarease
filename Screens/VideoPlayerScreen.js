import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe'; // Assuming you are using YouTube iframe

const VideoPlayerScreen = ({ route }) => {
  const { videoId, title } = route.params; // Extract the params passed through navigation

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}</Text>
      <YoutubePlayer
        height={300} // You can adjust the height
        play={true} // Automatically start playing
        videoId={videoId} // Pass the videoId to the YouTube player
      />
    </View>
  );
};

export default VideoPlayerScreen;


const styles = StyleSheet.create({
  container:{
    backgroundColor:'#e8e6ff',
    flex: 1
  },
  label: {
    fontSize: 18, // Slightly larger for better visibility
    fontWeight: 'bold',
    color: '#a098fb',
    marginBottom: 8,
    letterSpacing: 0.5, // Improves readability
    marginTop: 15,
    alignItems: 'center',
    margin: 10
  },

});