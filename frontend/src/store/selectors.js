import { createSelector } from '@reduxjs/toolkit';

export const selectAuth = (state) => state.auth;
export const selectFiles = (state) => state.files;
export const selectUsers = (state) => state.users;

export const selectCurrentUser = createSelector(
  [selectAuth],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated
);

export const selectIsAdmin = createSelector(
  [selectCurrentUser],
  (user) => user?.is_superuser || false
);

export const selectFilteredUsers = createSelector(
  [selectUsers, (_, searchTerm) => searchTerm],
  (users, searchTerm) => {
    if (!searchTerm) return users;
    
    const searchLower = searchTerm.toLowerCase();
    return users.filter(user => (
      user.id.toString().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchLower))
    ));
  }
);

export const selectRegularUsers = createSelector(
  [selectUsers],
  (users) => users.filter(user => !user.is_staff && !user.is_superuser)
);

export const selectStorageUsage = createSelector(
  [selectCurrentUser],
  (user) => {
    if (!user) return { percent: 0, usedGB: '0', maxGB: '1' };
    
    const usage = user.storage_usage || 0;
    const maxStorage = user.max_storage || 1;
    const percent = Math.min(100, (usage / maxStorage) * 100);
    const usedGB = (usage / (1024 * 1024 * 1024)).toFixed(2);
    const maxGB = (maxStorage / (1024 * 1024 * 1024)).toFixed(2);
    
    return { percent, usedGB, maxGB };
  }
);
