import { ref, set, get, update, remove, push } from 'firebase/database';
import { db } from '../config/firebase-config.js';

export const createGoal = (goalName, ownerHandle, from, to) => {
  const goalRef = ref(db, 'goals');
  const newGoalRef = push(goalRef); // Генерира нов уникален ключ за всяка цел
  return set(ref(db, `goals/${goalName}`), {
    goalName,
    gid: newGoalRef.key, // Използване на генерирания ключ като идентификатор
    owner: ownerHandle,
    createdOn: new Date().toISOString(),
    from,
    to
  });
};

export const getGoals = async () => {
  const goalsRef = ref(db, 'goals');
  const snapshot = await get(goalsRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return {};
  }
};

export const updateGoal = (goalName, updates) => {
  const goalRef = ref(db, `goals/${goalName}`);
  return update(goalRef, updates);
};

export const deleteGoal = (goalName) => {
  const goalRef = ref(db, `goals/${goalName}`);
  return remove(goalRef);
};