import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig"; 
import { fetch } from "react-native-fetch-blob";

const uploadImage = async (imageUri) => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const filename = `images/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Upload failed", error);
    return null;
  }
};

export default uploadImage;
