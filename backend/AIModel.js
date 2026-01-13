import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";

const AIModel = () => {
  const [modelLoaded, setModelLoaded] = useState(false);

  // ✅ Replace with your Google Drive direct link
  const modelUrl = "https://drive.google.com/uc?export=download&id=13bx8IkH2G1K1vT9zuq_irrI4g_dtrIKL";

  useEffect(() => {
    const loadModel = async () => {
      try {
        // Initialize TensorFlow.js
        await tf.ready();

        // Fetch the model file from Google Drive
        const response = await fetch(modelUrl);
        const modelArrayBuffer = await response.arrayBuffer();

        // Load the model from the fetched file
        const model = await tf.loadLayersModel(tf.io.browserFiles([new Blob([modelArrayBuffer])]));

        setModelLoaded(true);
        console.log("✅ Model Loaded Successfully!");
      } catch (error) {
        console.error("❌ Error loading model:", error);
      }
    };

    loadModel();
  }, []);

  return (
    <View>
      <Text>TensorFlow Lite Model</Text>
      {modelLoaded ? <Text>✅ Model Loaded Successfully!</Text> : <ActivityIndicator size="large" />}
    </View>
  );
};

export default AIModel;
