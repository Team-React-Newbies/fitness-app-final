import { ref, set, get, update, remove, push } from 'firebase/database';
import { db } from '../config/firebase-config.js';

export const createGoal = (goalName, ownerHandle, goalIcon, from, to) => {
  const goalRef = ref(db, 'goals');
  const newGoalRef = push(goalRef); 
    return set(ref(db, `goals/${goalName}`), {
    id: newGoalRef.key, 
    goalName,
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

export const updateGoal = (goalName, updates) => {
  const goalRef = ref(db, `goals/${goalName}`);
  return update(goalRef, updates);
};

export const deleteGoal = (goalName) => {
  const goalRef = ref(db, `goals/${goalName}`);
  return remove(goalRef);
};