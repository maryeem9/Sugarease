from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow.lite as tflite
import numpy as np
from PIL import Image
import io
import os

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development only)
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Construct the absolute path to the model file
model_path = os.path.join(os.path.dirname(__file__), "finalModel.tflite")
print(f"Model path: {model_path}")
print(f"File exists: {os.path.exists(model_path)}")

# Load the TFLite model
interpreter = tflite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

# Get input and output tensor details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Define class labels in the correct order
class_labels = [
    {"name": "apple", "gi": "low"},
    {"name": "banana", "gi": "medium"},
    {"name": "beetroot", "gi": "low"},
    {"name": "bell pepper", "gi": "low"},
    {"name": "cabbage", "gi": "low"},
    {"name": "capsicum", "gi": "low"},
    {"name": "carrot", "gi": "medium"},
    {"name": "cauliflower", "gi": "low"},
    {"name": "chilli pepper", "gi": "low"},
    {"name": "corn", "gi": "high"},
    {"name": "cucumber", "gi": "low"},
    {"name": "eggplant", "gi": "low"},
    {"name": "garlic", "gi": "low"},
    {"name": "ginger", "gi": "low"},
    {"name": "grapes", "gi": "medium"},
    {"name": "jalepeno", "gi": "low"},
    {"name": "kiwi", "gi": "low"},
    {"name": "lemon", "gi": "low"},
    {"name": "lettuce", "gi": "low"},
    {"name": "mango", "gi": "medium"},
    {"name": "onion", "gi": "low"},
    {"name": "orange", "gi": "low"},
    {"name": "paprika", "gi": "low"},
    {"name": "pear", "gi": "low"},
    {"name": "peas", "gi": "low"},
    {"name": "pineapple", "gi": "medium"},
    {"name": "pomegranate", "gi": "low"},
    {"name": "potato", "gi": "high"},
    {"name": "raddish", "gi": "low"},
    {"name": "soy beans", "gi": "low"},
    {"name": "spinach", "gi": "low"},
    {"name": "sweetcorn", "gi": "high"},
    {"name": "sweetpotato", "gi": "medium"},
    {"name": "tomato", "gi": "low"},
    {"name": "turnip", "gi": "low"},
    {"name": "watermelon", "gi": "high"}
]
def preprocess_image(image_bytes):
    """ Preprocess the image for TFLite model """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))  # Resize to match model input size
    image_array = np.array(image, dtype=np.float32)
    image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    return image_array

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    """ API endpoint to accept image and return prediction """
    image_bytes = await file.read()
    image_array = preprocess_image(image_bytes)

    # Set input tensor
    interpreter.set_tensor(input_details[0]['index'], image_array)

    # Run inference
    interpreter.invoke()

    # Get output predictions
    output_data = interpreter.get_tensor(output_details[0]['index'])
    max_confidence = np.max(output_data)  # Get the highest confidence value
    prediction_index = np.argmax(output_data)  # Get the index of the highest probability

    # Check confidence threshold
    if max_confidence > 0.4:  # Adjust the threshold as needed
        # Ensure the index is within bounds
        if 0 <= prediction_index < len(class_labels):
            predicted_fruit = class_labels[prediction_index]
            response = {
                "name": predicted_fruit["name"],
                "gi": predicted_fruit["gi"]  # Add GI information
            }
        else:
            response = {"name": "Unknown", "gi": "Unknown"}  # Fallback in case of an invalid index
    else:
        response = {"name": "It is not a Fruit", "gi": "N/A"}  # Low confidence response

    return {"prediction": response}
# Add a root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Food Prediction API!"}