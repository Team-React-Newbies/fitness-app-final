import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config.js';
import { auth } from '../config/firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateEmail, updatePassword } from 'firebase/auth';

export const getUserByHandle = (handle) => {
  try {
    return get(ref(db, `users/${handle}`));
  } catch (error) {
    return null;
  };
}

export const createUserHandle = (handle, uid, email, phone, photoUrl, name, age, weight, height) => {
  return set(ref(db, `users/${handle}`), {
    handle,
    uid,
    email,
    phone,
    photoUrl,
    name,
    age,
    weight,
    height,
    createdOn: new Date().toISOString(),
    isAdmin: false,
    isBlocked: false
  });
};

export const getUserData = (uid) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const updateUserHandle = (handle, updates) => {
  const { email, handle: userHandle, ...allowedUpdates } = updates;
  return update(ref(db, `users/${handle}`), allowedUpdates);
};

export const checkAdminStatus = (uid) => {
  return get(ref(db, `users/${uid}/isAdmin`));
};

export const toggleUserBlockStatus = async (handle, isCurrentlyBlocked) => {
  try {
    await update(ref(db, `users/${handle}`), { isBlocked: !isCurrentlyBlocked });
    console.log('Block status updated successfully:', !isCurrentlyBlocked);
  } catch (error) {
    console.error('Error updating block status:', error);
    throw error;
  }
};

export const fetchAllUsers = async () => {
  const snapshot = await get(ref(db, 'users'));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return {};
  }
};

export const makeAdmin = async (handle) => {
  await update(ref(db, `users/${handle}`), { isAdmin: true });
};

export const reauthenticateUser = async (email, currentPassword) => {
  const user = auth.currentUser;
  if (user) {
    const credential = await signInWithEmailAndPassword(auth, email, currentPassword);
    return user.reauthenticateWithCredential(credential);
  }
  throw new Error('User not authenticated');
};

export const updateUserEmail = async (newEmail) => {
  const user = auth.currentUser;
  if (user) {
    await updateEmail(user, newEmail);
    await update(ref(db, `users/${user.uid}`), { email: newEmail });
  } else {
    throw new Error('User not authenticated');
  }
};

export const updateUserPassword = async (newPassword) => {
  const user = auth.currentUser;
  if (user) {
    await updatePassword(user, newPassword);
  } else {
    throw new Error('User not authenticated');
  }
};

export const registerUser = async (email, password, handle, phone, photoUrl) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  await createUserHandle(handle, uid, email, phone, photoUrl);
};