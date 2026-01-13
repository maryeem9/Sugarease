import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStepCounter = () => {
  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString()); // Store the current date



  useEffect(() => {
    const checkDateAndResetSteps = async () => {
      const today = new Date().toLocaleDateString();

      // Retrieve the last saved date from AsyncStorage
      const lastDate = await AsyncStorage.getItem('lastDate');

      if (lastDate !== today) {
        setSteps(0); // Reset steps
        setCurrentDate(today); // Update to the new date
        await AsyncStorage.setItem('lastDate', today); // Save the new date
      }
    };

    checkDateAndResetSteps();
  }, []);



  useEffect(() => {
    let subscription;

    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener((accelerometerData) => {
          const { y } = accelerometerData;
          const threshold = 0.1; // Adjust sensitivity for movement detection
          const timestamp = new Date().getTime();

          if (
            Math.abs(y - lastY) > threshold &&
            !isCounting &&
            (timestamp - lastTimestamp > 800) // Prevent rapid counting
          ) {
            setIsCounting(true);
            setLastY(y);
            setLastTimestamp(timestamp);
            setSteps((prevSteps) => prevSteps + 1);

            // Debounce step counting to simulate human walking intervals
            setTimeout(() => {
              setIsCounting(false);
            }, 1200);
          }
        });
      } else {
        console.log('Accelerometer not available on this device');
      }
    });

    // Clean up the subscription on component unmount
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isCounting, lastY, lastTimestamp]);

  return steps;
};
