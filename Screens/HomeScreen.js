import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform ,
  Modal
} from 'react-native';
import { useStepCounter } from '../components/StepCounter';
import { FontAwesome5 } from '@expo/vector-icons';

import { auth, firestore, app } from '../Database/firebaseConfig'; 
import { getFirestore, collection, doc, updateDoc, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import WorkoutStreak from '../components/WorkoutStreak';

const motivationalQuotes = [
  "Believe in yourself and all that you are.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn’t just find you. You have to go out and get it.",
  "The harder you work for something, the greater you’ll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don’t stop when you’re tired. Stop when you’re done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It’s going to be hard, but hard does not mean impossible.",
  "Don’t wait for opportunity. Create it.",
  "Sometimes you have to create your own sunshine.",
  "Hustle for that muscle.",
  "The key to success is to focus on goals, not obstacles.",
  "Dream it. Believe it. Build it.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "You don’t have to be great to start, but you have to start to be great.",
  "If you want it, work for it.",
  "Success is not for the lazy.",
  "Believe you can and you’re halfway there.",
  "Act as if what you do makes a difference. It does.",
  "Success usually comes to those who are too busy to be looking for it.",
  "Opportunities don’t happen. You create them.",
  "Your life does not get better by chance, it gets better by change.",
  "The only way to do great work is to love what you do.",
  "If you can dream it, you can do it.",
  "The future depends on what you do today.",
  "Success is not how high you have climbed, but how you make a positive difference to the world.",
  "You are never too old to set another goal or to dream a new dream."
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HomeScreen = () => {
  const db = getFirestore(app);
  const [glucose, setGlucose] = useState('');
  const [unitType, setUnitType] = useState('mg/dL');
  const [glucoseError, setGlucoseError] = useState(null);
  const [addedGlucose, setAddedGlucose] = useState(null);
  const [bloodPressure, setBloodPressure] = useState('');
  const [isModalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [isEmptyStomach, setIsEmptyStomach] = useState(null); 
 
 // const [bloodPressureError, setBloodPressureError] = useState(null);
  const [insulin, setInsulin] = useState('');
  const [insulinError, setInsulinError] = useState(null);
  const steps = useStepCounter();
  const [workoutStreak, setWorkoutStreak] = useState(Array(31).fill(false));
  const [quoteIndex] = useState(new Date().getDate() - 1);
  const [popupVisible, setPopupVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [bloodPressureError, setBloodPressureError] = useState('');
  // const [workoutStreak, setWorkoutStreak] = useState(new Array(30).fill(false)); // Default to 30 days, all false initially
  const [workedOut, setWorkedOut] = useState(false);


  const handleWorkoutStatusChange = (status) => {
    setWorkedOut(status); // Update the workout status
  };

const handleAddLog = async () => {
 console.log("reached handleAdd log function!!!");
 
 const user = auth.currentUser;

  if (user){
    const userRef = doc(firestore, 'user', user.uid);
    const logCollectionRef = collection(userRef, 'log');

    try{

      await addDoc(logCollectionRef, {
        date: new Date(),
        steps: parseInt(steps),  // Convert steps to a number
        waterGlasses: parseInt(waterGlasses),  // Convert water glasses to a number
        workout : workedOut
      });
      console.log('Log added successfully');
    }
    catch{
      console.error('Error adding log:', error.message);
    }
  }
  
}

  ////////////////////////////////const//////////////////////////////////////////////////////////////////////////////////////////////////////////
    const handleSystolicChange = (value) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < 50 || numericValue > 300) {
      setBloodPressureError("Systolic value should be between 50 and 300 mmHg");
    } else {
      setBloodPressureError(""); // Clear error if value is valid
    }
    setSystolic(value); // Update systolic value
  };
    ////////////////////////////////const//////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleDiastolicChange = (value) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < 30 || numericValue > 200) {
      setBloodPressureError("Diastolic value should be between 30 and 200 mmHg");
    } else {
      setBloodPressureError(""); // Clear error if value is valid
    }
    setDiastolic(value); // Update diastolic value
  };
    ////////////////////////////////const//////////////////////////////////////////////////////////////////////////////////////////////////////////
    const handleGlucoseChange = (text) => {
      // Convert the entered value based on the selected unit type
      if (unitType === 'mmol/L') {
        // Convert mmol/L to mg/dL and store it
        const convertedValue = parseFloat(text) * 18.015;
        setGlucose(convertedValue.toString()); // store the converted value in mg/dL
      } else {
        // Directly store the entered value if the unit is mg/dL
        setGlucose(text);
      }
      validateGlucose(text); // Call the validation function for any errors
    };
  ////////////////////////////////const//////////////////////////////////////////////////////////////////////////////////////////////////////////
  const validateGlucose = (value) => {
    let error = null;
    const glucoseLevel = parseFloat(value);
    if (isNaN(glucoseLevel)) {
      error = 'Please enter a valid number.';
    } else if (unitType === 'mg/dL' && (glucoseLevel < 20 || glucoseLevel > 600)) {
      error = 'Glucose level should be between 20-600 mg/dL.';
    } else if (unitType === 'mmol/L' && (glucoseLevel < 1.1 || glucoseLevel > 33.3)) {
      error = 'Glucose level should be between 1.1-33.3 mmol/L.';
    }
    setGlucoseError(error);
  };


  ////////////////////////////////const//////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleUnitChange = (newUnitType) => {
    setUnitType(newUnitType);
    setGlucose(''); // Reset glucose value when unit type changes
    setGlucoseError(null); // Reset error message when unit type changes
  };

  const handleAddButtonClick = () => {
    // Trigger the modal when "Add" button is clicked
    if (!glucoseError && glucose !== '') {
      setModalVisible(true); // Show the modal
    } else {
      console.log('Error: Invalid glucose value or no value entered.');
    }
  };

  const handleIsEmptyStomachSelection = (selection) => {
    setIsEmptyStomach(selection);  // 'Yes' or 'No'
    handleModalClose();
  };
  
  const handleModalClose = async () => {
    console.log("Modal closing, handling glucose record...");
  
    const user = auth.currentUser;  // Get the current authenticated user
  
    if (user) {
      const userRef = doc(firestore, 'user', user.uid);  // Get the user document reference
      const logCollectionRef = collection(userRef, 'log');  // Get the 'log' collection reference
  
      try {
        // Query the 'log' collection to get the most recent document, ordered by 'date' field (descending)
        const logSnapshot = await getDocs(query(logCollectionRef, orderBy('date', 'desc')));
        if (logSnapshot.empty) {
          console.log('No logs found');
          return;  // If there are no logs, exit the function
        }
  
        // Get the most recent log document (now guaranteed to be the first one due to ordering by 'date')
        const recentLogDoc = logSnapshot.docs[0];
        console.log('Most recent log document found:', recentLogDoc.id);  // Add a log here to ensure you have the right document
  
        // Create a reference to the 'glucose' subcollection in the most recent log document
        const glucoseCollectionRef = collection(recentLogDoc.ref, 'glucose');
        console.log('Adding glucose data to subcollection...');
  
        // Add a new document to the 'glucose' subcollection
        await addDoc(glucoseCollectionRef, {
          glucoseValue: glucose,            // Store the glucose value entered by the user
          isEmptyStomach: isEmptyStomach,   // Store the modal response (empty stomach or not)
          timestamp: new Date(),            // Store the current timestamp
        });
  
        console.log('Glucose record added successfully');
        
        // Close the modal after the record is added
        setModalVisible(false);  // Close the modal after successful operation
      } catch (error) {
        console.error('Error adding glucose record:', error.message);
      }
    } else {
      console.log("No user logged in");
    }
  };
  
  
  ////////////////////////////////const//////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleBloodPressureChange = (text) => {
    setBloodPressure(text);
    validateBloodPressure(text);
  };
  ////////////////////////////////const//////////////////////////////////////////////////////////////////////////////////////////////////////////
  const validateBloodPressure = (value) => {
    let error = null;
    const [systolic, diastolic] = value.split('/').map(Number);
    if (isNaN(systolic) || isNaN(diastolic)) {
      error = 'Please enter a valid blood pressure (e.g., 120/80).';
    } else if (systolic < 50 || systolic > 300 || diastolic < 30 || diastolic > 200) {
      error = 'Blood pressure should be between 50/30 - 300/200 mmHg.';
    }
    setBloodPressureError(error);
  };



  const handleAddBloodPressure = async () => {
    if (!systolic || !diastolic) {
      setBloodPressureError('Please enter both systolic and diastolic values.');
      return;
    }
  
    const numericSystolic = parseInt(systolic, 10);
    const numericDiastolic = parseInt(diastolic, 10);
  
    if (isNaN(numericSystolic) || numericSystolic < 50 || numericSystolic > 300) {
      setBloodPressureError("Systolic value should be between 50 and 300 mmHg");
      return;
    }
  
    if (isNaN(numericDiastolic) || numericDiastolic < 30 || numericDiastolic > 200) {
      setBloodPressureError("Diastolic value should be between 30 and 200 mmHg");
      return;
    }
  
    setBloodPressureError(""); // Clear any errors if values are valid
  
    console.log("Adding blood pressure record...");
  
    const user = auth.currentUser;  // Get the current authenticated user
  
    if (user) {
      const userRef = doc(firestore, 'user', user.uid);  // Get the user document reference
      const logCollectionRef = collection(userRef, 'log');  // Get the 'log' collection reference
  
      try {
        // Query the 'log' collection to get the most recent document
        const logSnapshot = await getDocs(logCollectionRef);
        if (logSnapshot.empty) {
          console.log('No logs found');
          return;  // If there are no logs, exit the function
        }
  
        // Get the most recent log document
        let recentLogDoc = null;
        logSnapshot.forEach((doc) => {
          if (!recentLogDoc || doc.data().date > recentLogDoc.data().date) {
            recentLogDoc = doc;
          }
        });
  
        if (!recentLogDoc) {
          console.log('No recent log found');
          return;
        }
  
        // Create a reference to the 'bloodPressure' subcollection in the most recent log document
        const bloodPressureCollectionRef = collection(recentLogDoc.ref, 'bloodPressure');
  
        // Add a new document to the 'bloodPressure' subcollection
        await addDoc(bloodPressureCollectionRef, {
          bp_systolic: numericSystolic,        // Store the systolic blood pressure value
          bp_diastolic: numericDiastolic,      // Store the diastolic blood pressure value
          timestamp: new Date(),               // Store the current date and time
        });
  
        console.log('Blood pressure record added successfully');
  
        setSystolic('');   // Reset the systolic field
        setDiastolic('');  // Reset the diastolic field
  
      } catch (error) {
        console.error('Error adding blood pressure record:', error.message);
      }
    }
  };
  
  ////////////////////////////////const//////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleInsulinChange = (text) => {
    setInsulin(text);
    validateInsulin(text);
  };
  ////////////////////////////////const//////////////////////////////////////////////////////////////////////////////////////////////////////////
  const validateInsulin = (value) => {
    let error = null;
    const insulinAmount = parseFloat(value);
    if (isNaN(insulinAmount)) {
      error = 'Please enter a valid number.';
    } else if (insulinAmount < 0 || insulinAmount > 1000) {
      error = 'Insulin intake should be between 0-1000 units.';
    }
    setInsulinError(error);
  };


  const handleAddInsulin = async () => {
    if (!insulin) {
      setInsulinError("Please enter an insulin value.");
      return;
    }
  
    const numericInsulin = parseFloat(insulin);
  
    if (isNaN(numericInsulin) || numericInsulin < 0 || numericInsulin > 1000) {
      setInsulinError("Insulin intake should be between 0 and 1000 units.");
      return;
    }
  
    setInsulinError(""); // Clear any errors if values are valid
  
    console.log("Adding insulin record...");
  
    const user = auth.currentUser; // Get the current authenticated user
  
    if (user) {
      const userRef = doc(firestore, 'user', user.uid); // Get the user document reference
      const logCollectionRef = collection(userRef, 'log'); // Get the 'log' collection reference
  
      try {
        // Query the 'log' collection to get the most recent document
        const logSnapshot = await getDocs(logCollectionRef);
        if (logSnapshot.empty) {
          console.log('No logs found');
          return; // If there are no logs, exit the function
        }
  
        // Get the most recent log document based on the 'date' field
        let recentLogDoc = null;
        logSnapshot.forEach((doc) => {
          if (!recentLogDoc || doc.data().date > recentLogDoc.data().date) {
            recentLogDoc = doc;
          }
        });
  
        if (!recentLogDoc) {
          console.log('No recent log found');
          return;
        }
  
        // Create a reference to the 'insulin' subcollection in the most recent log document
        const insulinCollectionRef = collection(recentLogDoc.ref, 'insulin');
  
        // Add a new document to the 'insulin' subcollection
        await addDoc(insulinCollectionRef, {
          insulin: numericInsulin,  // Store the insulin intake value
          timestamp: new Date(),     // Store the current date and time
        });
  
        console.log('Insulin record added successfully');
  
        setInsulin(''); // Reset the insulin field
  
      } catch (error) {
        console.error('Error adding insulin record:', error.message);
      }
    }
  };
  
  ////////////////////////////////const//////////////////////////////////////////////////////////////////////////////////////////////////////////
 
     const [waterGlasses, setWaterGlasses] = useState(0); // State to track the number of glasses
  
   
    const addGlass = () => {
      setWaterGlasses(waterGlasses + 1); // Increment the glass count
    };
    
    const removeGlass = () => {
      if (waterGlasses > 0) {
        setWaterGlasses(waterGlasses - 1); // Decrement the glass count if greater than 0
      }
    };
    
  ////////////////////////////////const//////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleSaveData = () => {
    // Show the popup by setting it to visible
    setPopupVisible(true);
  
    // Start the spring animation to make the popup visible
    Animated.spring(animation, {
      toValue: 1,
      friction: 2,
      tension: 100,
      useNativeDriver: true,
    }).start();
  
    // After the popup is visible, wait for 3 seconds before hiding it
    setTimeout(() => {
      // Animate the popup back to invisible
      Animated.spring(animation, {
        toValue: 0,
        friction: 2,
        tension: 100,
        useNativeDriver: true,
      }).start(() => {
        // Hide the popup after the animation completes
        setPopupVisible(false);
      });
    }, 3000); // 3-second delay before starting the "disappearing" animation
  };
  
  const glucoseRangeText = unitType === 'mg/dL' ? 'Normal range: 70-130 mg/dL' : 'Normal range: 3.9-7.2 mmol/L';
  const bloodPressureRangeText = 'Normal range: 90/60 mmHg - 120/80 mmHg';
  const insulinRangeText = 'Normal range: 0-25 units (varies by person)';

  return (

     /* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         //////////////////////////////////////////////////////////DATE - DAY - QUOTE   ///////////////////////////////////////////////////////////////////
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
    
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
        <Text style={styles.day}>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</Text>
        <Text style={styles.quote}>{motivationalQuotes[quoteIndex]}</Text>
        <View style={styles.stepsAndWater}>


        <View style={styles.stepsCard}>
        <Text style={styles.headings}>Steps:</Text>
        <Text style={styles.stepsLabel}>{steps}</Text>
        </View>
           
    {/* Water Intake Section */}
    <View style={styles.waterIntakeCard}>
    <Text style={styles.headings}>Water Intake</Text>
<View style={styles.buttonRow}>
  <TouchableOpacity style={styles.addButton} onPress={addGlass}>
    <Text style={styles.waterIntakeButtonText}>Add</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.addButton} onPress={removeGlass}>
    <Text style={styles.waterIntakeButtonText}>Remove</Text>
  </TouchableOpacity>
</View>
<View style={styles.waterContainer}>
  {/* Render water glasses */}
  {[...Array(waterGlasses)].map((_, index) => (
    <FontAwesome5
      key={index}
      name="glass-whiskey"
      size={20}
      color="#9997d7"
      style={styles.glassIcon}
    />
  ))}
</View>
    </View>
        </View>
        <View style={styles.card}>
      <WorkoutStreak 
        workedOut={workedOut} 
        onWorkoutStatusChange={handleWorkoutStatusChange} 
      />
      </View>
        
      <TouchableOpacity style={styles.saveButton} onPress={handleAddLog}>
          <Text style={styles.saveButtonText}>Save Data</Text>
        </TouchableOpacity>



         {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         //////////////////////////////////////////////////////////glucose ///////////////////////////////////////////////////////////////////
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
        <View style={styles.card}>
        <Text style={styles.headings}>Glucose Level</Text>
        <View style={styles.unitSelector}>
  <TouchableOpacity
    style={[styles.unitButton, unitType === 'mg/dL' && styles.selectedUnit]}
    onPress={() => handleUnitChange('mg/dL')}>
    <Text style={styles.unitButtonText}>mg/dL</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.unitButton, unitType === 'mmol/L' && styles.selectedUnit]}
    onPress={() => handleUnitChange('mmol/L')}>
    <Text style={styles.unitButtonText}>mmol/L</Text>
  </TouchableOpacity>
</View>   
      <Text style={styles.rangeText}>{glucoseRangeText}</Text>

      <View style={styles.inputContainer}>
        
        <TextInput
          style={[styles.input, glucoseError && styles.inputError]}
          placeholder={unitType === 'mg/dL' ? 'Enter glucose in mg/dL' : 'Enter glucose in mmol/L'}
          value={glucose}
          onChangeText={handleGlucoseChange}
          keyboardType="numeric"
          textContentType="none"
          placeholderTextColor={'#a098fb'}
          selectionColor={'#a098fb'}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddButtonClick}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {glucoseError && <Text style={styles.errorMessage}>{glucoseError}</Text>}

      {/* Unit selectors */}
    

      {/* Modal for asking empty stomach */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Are you on an empty stomach?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleIsEmptyStomachSelection(true)}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleIsEmptyStomachSelection(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
 {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         //////////////////////////////////////////////////////////unit selectors  ///////////////////////////////////////////////////////////////////
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
           
        </View>
        
         {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         //////////////////////////////////////////////////////////blood pressure ///////////////////////////////////////////////////////////////////
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
<View style={styles.card}>
{/* Blood Pressure Section */}
<Text style={styles.headings}>Blood Pressure (mmHg)</Text>
<Text style={styles.rangeText}>Normal Range: 50/30 - 300/200 mmHg</Text>
<View style={styles.bpInputTextContainer}>
<TextInput
  style={[styles.bpInputField, bloodPressureError && styles.inputError]}
  placeholder="Systolic"
  value={systolic}
  onChangeText={handleSystolicChange}
  keyboardType="numeric"
  placeholderTextColor={'#a098fb'}
  selectionColor={'#a098fb'}
/>
<Text style={styles.bpslash}>/</Text>

{/* Diastolic */}
<TextInput
  style={[styles.bpInputField, bloodPressureError && styles.inputError]}
  placeholder="Diastolic"
  value={diastolic}
  onChangeText={handleDiastolicChange}
  keyboardType="numeric"
  placeholderTextColor={'#a098fb'}
  selectionColor={'#a098fb'}
/>

<TouchableOpacity style={styles.addButton} onPress={handleAddBloodPressure}>
  <Text style={styles.addButtonText}>Add</Text>
</TouchableOpacity>
</View>
{/* Systolic */}

{/* Error message for blood pressure */}
{bloodPressureError && <Text style={styles.errorMessage}>{bloodPressureError}</Text>}
       

</View>

         {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         //////////////////////////////////////////////////////////insulin  ///////////////////////////////////////////////////////////////////
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
        <View style={styles.card}>
        <Text style={styles.headings}>Insulin Intake</Text>
        <Text style={styles.rangeText}>{insulinRangeText}</Text>
        <View style={styles.insulinInputcontainer}>
        <TextInput
          style={[styles.input, insulinError && styles.inputError]}
          placeholder="Enter Insulin Intake"
          value={insulin}
          onChangeText={handleInsulinChange}
          keyboardType="numeric"
          selectionColor={'#a098fb'}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddInsulin}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
        </View>
        
        {insulinError && <Text style={styles.errorMessage}>{insulinError}</Text>}

        </View>
       
         {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         //////////////////////////////////////////////////////////workout streak ///////////////////////////////////////////////////////////////////
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
     
      
 {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         //////////////////////////////////////////////////////////steps  ///////////////////////////////////////////////////////////////////
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}
  
  
    
    
      
        {popupVisible && (
          <Animated.View style={[styles.popup, { opacity: animation }]}>
            <Text style={styles.popupText}>Well done!</Text>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // General Container Styles
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#e8e6ff', 
  },
  scrollView: {
    padding: 20,
  },

  // Typography Styles
  date: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5d4489', // Pastel red-orange
    
  },
  day: {
    fontSize: 18,
    color: '#5d4489',
  },
  quote: {
    fontSize: 16,
    color: '#bcb6fd', // Pastel blue
    marginVertical: 10,
    fontStyle: 'italic'
  },
  label: {
    fontSize: 18, // Slightly larger for better visibility
    fontWeight: 'bold',
    color: '#a098fb',
    marginBottom: 8,
    letterSpacing: 0.5, // Improves readability
    marginTop: 15,
    alignItems: 'center'
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
  rangeText: {
    fontSize: 12,
    color: '#a098fb',
    marginBottom: 5,
  },
  errorMessage: {
    color: '#a098fb',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalButton: {
    backgroundColor: '#e392ec',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },

  // Input Styles
  input: {
    flex:2,
    height: 40,
    borderColor: '#a098fb', // Pastel pink
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 12,
    fontSize: 12,
    marginBottom: 10,
    
  },
  inputError: {
    borderColor: 'red',
  },

  // Button Styles
  saveButton: {
    backgroundColor: '#9997d7', // Pastel red-orange
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    
  },
  saveButtonText: {
    color: '#FFFFFF', // White
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#9997d7', // Pastel red-orange
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    margin: 5,
    marginBottom: 15,
    marginTop: 2,
    justifyContent: 'center'
  },
  addButtonText: {
    color: '#FFFFFF', // White
    fontSize: 15,
    fontWeight: 'bold',
    padding:2
  },
  removeButton: {
    flex: 1,
    backgroundColor: '#9997d7', 
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF', // White
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Checkbox Styles
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#5e2863', // Pastel pink
    backgroundColor: '#E7F6F2', // Pastel greenish-blue
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCheckbox: {
    backgroundColor: '#5e2863', // Completed box color
  },
  checkmark: {
    color: '#FFFFFF', // White checkmark
    fontSize: 18,
  },

  // Streak Styles
  streak: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  streakBox: {
    width: 30,
    height: 30,
    borderColor: '#5e2863', // Pastel pink
    borderWidth: 1,
    borderRadius: 5,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBox: {
    backgroundColor: '#5e2863',
  },
  streakText: {
    fontSize: 14,
    color: '#ffffff',
  },

  // Popup Styles
  popup: {
    position: 'absolute',
    top: '90%',
    left: '80%',
    transform: [{ translateX: -100 }, { translateY: -50 }],
    backgroundColor: '#830089', // Pastel blue
    padding: 20,
    borderRadius: 10,
    zIndex: 1000,
  },
  popupText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Miscellaneous Styles
  unitSelector: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  unitButton: {
    flex: 1,
    padding: 5,
    borderWidth: 1,
    borderColor: '#9997d7', // Pastel pink
    borderRadius: 10,
    alignItems: 'center',
    margin: 2
  },
  selectedUnit: {
    backgroundColor: '#8d8ada',
  },
  
  unitButtonText: {
    fontSize: 16,
    color: '#b4b3d8',
    fontWeight: 'bold'
  },

  // Water Intake Styles
  waterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 5,
  },
  glassIcon: {
    margin: 2,
  },

  // Button Row Styles
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  inputContainer:{
    flexDirection:'row'
  },
  card:{
    backgroundColor: '#f3f2fb',
    padding: 8,
    borderRadius: 10,
    elevation:10,
    margin: 8,
  },
  bpInputTextContainer:{
    flexDirection:'row'
  },
  bpInputField:{
    flex: 1,
    height: 40,
    borderColor: '#a098fb', // Pastel pink
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 12,
    margin: 2,
  },
  bpslash:{
    color:'#a098fb',
    paddingTop: 10,
    fontWeight:'bold',
    fontSize: 15
  },
  stepsCard:{
    backgroundColor: '#f3f2fb',
    borderRadius: 10,
    elevation:10,
    margin: 8,
    alignItems: 'center',
    width: 100,
    height:200,
    justifyContent: 'center'
    
  },
  stepsAndWater:{
    flexDirection: 'row'
  },
  stepsLabel:{
    fontSize: 18, // Slightly larger for better visibility
    fontWeight: 'bold',
    color: '#a098fb',
    margin: 8,
    letterSpacing: 0.5,
    alignItems: 'center'
  },
  waterIntakeCard:{
    flex:1,
    backgroundColor: '#f3f2fb',
    padding: 8,
    borderRadius: 10,
    elevation:10,
    margin: 8,
  },
  waterIntakeButtonText:{
    color: '#FFFFFF', // White
    fontSize: 10,
    fontWeight: 'bold',
    padding:2
  },
  insulinInputcontainer:{
    flexDirection:'row'
  }
 
});
export default HomeScreen;