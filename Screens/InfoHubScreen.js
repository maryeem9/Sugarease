import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; //handles HTTP 
import SearchBar from '../components/SearchBar'; // Ensure this is defined in your project

const InfoHubScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);
  const navigation = useNavigation();

  // Expanded list of diabetes-related keywords
  const diabetesKeywords = [
    'diabetes', 'blood sugar', 'insulin', 'type 1 diabetes', 'type 2 diabetes', 'glucose',
    'glucose monitoring', 'diabetic diet', 'gestational diabetes', 'diabetes exercise', 'diabetes management',
    'hypoglycemia', 'hyperglycemia', 'insulin resistance', 'diabetic neuropathy', 'diabetic retinopathy',
    'diabetic foot care', 'glucose levels', 'diabetes care', 'insulin pump', 'diabetes medication', 'HBA1C',
    'metformin', 'diabetic ketoacidosis', 'diabetes complications', 'sugar levels', 'pre-diabetes', 'endocrinology',
    'diabetes symptoms', 'fasting blood sugar', 'postprandial', 'CGM', 'continuous glucose monitor', 'carbohydrates',
    'low-carb diet', 'ketones', 'ketogenic diet', 'exercise and diabetes', 'weight management', 'diabetes control',
    'healthy eating', 'dietary fiber', 'sugar-free diet', 'oral hypoglycemics', 'type 1 treatment', 'type 2 treatment',
    'insulin therapy', 'diabetes self-management', 'blood glucose monitor', 'carb counting', 'insulin sensitivity',
    'diabetes technology', 'diabetic health'
  ];

  // Function to enforce diabetes-related search by checking if input contains any diabetes keywords
  const enforceDiabetesKeywords = (userInput) => {
    const lowerUserInput = userInput.toLowerCase();

    // Check if user input contains any diabetes-related keywords
    const isRelatedToDiabetes = diabetesKeywords.some((keyword) =>
      lowerUserInput.includes(keyword.toLowerCase())
    );

    // If not related to diabetes, append some default diabetes keywords to the query
    if (!isRelatedToDiabetes) {
      return `${userInput} ${diabetesKeywords.slice(0, 5).join(' OR ')}`; // Append first 5 diabetes-related keywords
    }

    return userInput; // Return user input if it is related to diabetes
  };

  // Fetch YouTube videos based on the modified search query
  const fetchYouTubeVideos = async (searchText) => {
    if (!searchText) return;

    try {
      const query = enforceDiabetesKeywords(searchText); // Ensure the query is diabetes-related
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: query, // Use the modified query that ensures diabetes-related keywords
          type: 'video',
          key: 'AIzaSyDFvbdQDIlmuEenIdObI6iuZJX1nFDka5g', 
          maxResults: 10,
        },
      });

      setFilteredVideos(response.data.items); // Update video list
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
    }
  };

  // Handle search button press
  const handleSearch = () => {
    fetchYouTubeVideos(searchText); // Trigger video fetch with the modified search query
  };

  // Handle video selection and navigate to the VideoPlayerScreen
  const handleVideoSelect = (item) => {
    navigation.navigate('VideoPlayer', {
      videoId: item.id.videoId,
      title: item.snippet.title,
    });
  };

  // Render each video item in the FlatList
  const renderVideoItem = ({ item }) => (
    <TouchableOpacity style={styles.videoCard} onPress={() => handleVideoSelect(item)}>
      <Image source={{ uri: item.snippet.thumbnails.high.url }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.snippet.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredVideos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id.videoId || item.id} // Ensures a unique key
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e8e6ff',
  },
  list: {
    paddingBottom: 16,
  },
  videoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 10,
  },
  thumbnail: {
    width: 120,
    height: 90,
    marginRight: 10,
    borderRadius: 8,
    elevation:1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: '#665fb4'
  },
  searchButton: {
    backgroundColor: '#a098fb',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  searchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default InfoHubScreen;
