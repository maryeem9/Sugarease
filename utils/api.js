// utils/api.js
import axios from "axios";

export async function sendImageToFastAPI(imageUri) {
  const formData = new FormData();
  const uriParts = imageUri.split(".");
  const fileType = uriParts[uriParts.length - 1];

  const imageData = {
    uri: imageUri,
    type: `image/${fileType}`,
    name: `food_image.${fileType}`,
  };

  formData.append("file", imageData);

  try {
    const response = await axios.post("http://192.168.0.118:8000/predict/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
