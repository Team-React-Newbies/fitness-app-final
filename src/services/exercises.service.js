import { ref, set, get, update, remove, push } from 'firebase/database';
import { db } from '../config/firebase-config.js';

export const createExercise = (title, ownerHandle, duration, steps) => {
  const exerciseRef = ref(db, 'exercises');
  const newExerciseRef = push(exerciseRef); // Генерира нов уникален ключ за всяко упражнение
  return set(ref(db, `exercises/${title}`), {
    id: newExerciseRef.key, // Използване на генерирания ключ като идентификатор
    title,
    duration,
    steps,
    owner: ownerHandle,
    createdOn: new Date().toISOString()
  });
};

export const getExercises = async () => {
  const exercisesRef = ref(db, 'exercises');
  const snapshot = await get(exercisesRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return {};
  }
};

export const updateExercise = (title, updates) => {
  const exerciseRef = ref(db, `exercises/${title}`);
  return update(exerciseRef, updates);
};

export const deleteExercise = (title) => {
  const exerciseRef = ref(db, `exercises/${title}`);
  return remove(exerciseRef);
};