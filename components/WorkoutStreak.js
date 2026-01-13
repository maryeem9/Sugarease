import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';


const WorkoutStreak = ({ workedOut, onWorkoutStatusChange }) => {
  const [workoutStreak, setWorkoutStreak] = useState(Array(31).fill(false)); // Array for 31 days
  const [currentDay, setCurrentDay] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  // Set the current day
  useEffect(() => {
    const today = new Date();
    const dayOfMonth = today.getDate();
    setCurrentDay(dayOfMonth);
  }, []);

  const toggleWorkout = (status) => {
    const updatedStreak = [...workoutStreak];
    updatedStreak[currentDay - 1] = status; // Update workout streak for the current day
    setWorkoutStreak(updatedStreak); // Update the streak state
   
    onWorkoutStatusChange(status); // Pass status back to HomeScreen
  };


  const handleWorkoutToggle = (workedOut) => {
    toggleWorkout(workedOut); // Use the toggleWorkout function to update the streak and save
    setShowDialog(false); // Close the dialog
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headings}>Workout Streak</Text>

      {/* Add/Edit Streak Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setShowDialog(true)}>
        <Text style={styles.buttonText}>
          {workoutStreak[currentDay - 1] ? 'Edit Streak' : 'Add to Streak'}
        </Text>
      </TouchableOpacity>

      {/* Modal for Yes/No Dialog */}
      <Modal visible={showDialog} transparent={true} animationType="slide" onRequestClose={() => setShowDialog(false)}>
        <View style={styles.dialogContainer}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogText}>Did you work out today?</Text>
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={[styles.dialogButton, { backgroundColor: '#a098fb' }]}
                onPress={() => handleWorkoutToggle(true)}
              >
                <Text style={styles.dialogButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogButton, { backgroundColor: '#a098fb' }]}
                onPress={() => handleWorkoutToggle(false)}
              >
                <Text style={styles.dialogButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Render the circles with date numbers */}
      <View style={styles.circleContainer}>
        {workoutStreak.map((workedOut, index) => (
          <View key={index} style={[styles.circle, workedOut && { backgroundColor: '#a098fb' }]}>
            <Text style={[styles.dateText, workedOut && { color: 'white' }]}>
              {index + 1}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  header: {
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#a098fb',
    marginBottom: 8,
    letterSpacing: 0.5, // Improves readability
    marginTop: 15,
    alignItems: 'center'
  },
  addButton: {
    flex: 1,
    backgroundColor: '#9997d7', 
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    margin: 5,
    marginBottom: 15,
    marginTop: 2,
    justifyContent: 'center'
  },
  buttonText: {
    color: '#FFFFFF', // White
    fontSize: 15,
    fontWeight: 'bold',
    padding:2
  },
  dialogContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogBox: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  dialogText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  dialogButtons: {
    flexDirection: 'row',
  },
  dialogButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    color: '#a098fb'
  },
  dialogButtonText: {
    color: 'white',
    fontSize: 16,
  },
  circleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  circle: {
    width: 40,
    height: 20,
    borderRadius: 10,
    margin: 5,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 10,
    color: '#5d4489',
    fontWeight: 'bold'
  },
  headings:{
    fontSize: 18, // Slightly larger for better visibility
    fontWeight: 'bold',
    color: '#5d4489',
    marginBottom: 8,
    letterSpacing: 0.5, // Improves readability
    marginTop: 15,
    alignItems: 'center'
  },
  
});

export default WorkoutStreak;
