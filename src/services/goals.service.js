import { ref, set, get, update, remove, push } from 'firebase/database';
import { db } from '../config/firebase-config.js';

export const createGoal = (title, ownerHandle, goalIcon, from, to) => {
  const goalRef = ref(db, 'goals');
  const newGoalRef = push(goalRef); // Generate a new unique key for each goal
  return set(newGoalRef, {
    id: newGoalRef.key, // Use the generated key as the identifier
    title,
    goalIcon,
    from,
    to,
    owner: ownerHandle,
    createdOn: new Date().toISOString()
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

export const updateGoal = (title, updates) => {
  const goalRef = ref(db, `goals/${title}`);
  return update(goalRef, updates);
};

export const deleteGoal = (title) => {
  const goalRef = ref(db, `goals/${title}`);
  return remove(goalRef);
};