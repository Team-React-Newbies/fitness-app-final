import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from '../config/firebase-config';

export const getMusicUrl = async (filePath) => {
  const storageRef = ref(storage, filePath);
  try {
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
};

export const uploadPhoto = async (file, uid) => {
  const storageRef = ref(storage, `photos/${uid}/${file.name}`);
  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};