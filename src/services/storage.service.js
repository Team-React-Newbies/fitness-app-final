import { ref, getDownloadURL } from "firebase/storage";
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

