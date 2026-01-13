import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

const SearchBar = ({ searchText, setSearchText }) => {
  const handleSearchChange = (text) => {
    setSearchText(text); // Update the search text in the parent component
  };

  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.input}
        placeholder="Search something about diabetes..."
        value={searchText}
        onChangeText={handleSearchChange}
        placeholderTextColor={'#a098fb'} 
        selectionColor={'#a098fb'}// This will call the parent function
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
    flex: 2,
    padding:5,
    paddingTop:10
  },
  input: {
    height: 40,
    borderColor: '#a098fb',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 14,
  },
});

export default SearchBar;
