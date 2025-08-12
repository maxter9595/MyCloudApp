import authReducer, {
  login,
  logout,
  register,
  fetchCurrentUser,
  setUser,
  clearError
} from 'store/slices/authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  };

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    is_superuser: false
  };

  const mockToken = 'mock-token-123';

  // Мокаем security utils
  jest.mock('utils/security', () => ({
    secureStoreToken: jest.fn(),
    removeSecureToken: jest.fn()
  }));

  // Мокаем API
  jest.mock('api/auth', () => ({
    login: jest.fn(),
    register: jest.fn(),
    getMe: jest.fn()
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('reducers', () => {
    it('should handle setUser', () => {
      const actual = authReducer(initialState, setUser(mockUser));
      expect(actual.user).toEqual(mockUser);
      expect(actual.isAuthenticated).toBe(true);
    });

    it('should handle setUser with null', () => {
      const stateWithUser = { ...initialState, user: mockUser, isAuthenticated: true };
      const actual = authReducer(stateWithUser, setUser(null));
      expect(actual.user).toBeNull();
      expect(actual.isAuthenticated).toBe(false);
    });

    it('should handle logout', () => {
      const stateWithUser = { ...initialState, user: mockUser, isAuthenticated: true };
      const actual = authReducer(stateWithUser, logout());
      expect(actual.user).toBeNull();
      expect(actual.isAuthenticated).toBe(false);
      // Можно добавить проверку вызова removeSecureToken если нужно
    });

    it('should handle clearError', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const actual = authReducer(stateWithError, clearError());
      expect(actual.error).toBeNull();
    });
  });

  describe('async thunks', () => {
    describe('login', () => {
      it('should handle login.pending', () => {
        const action = { type: login.pending.type };
        const state = authReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('should handle login.fulfilled', () => {
        const payload = { user: mockUser, token: mockToken };
        const action = { type: login.fulfilled.type, payload };
        const state = authReducer(initialState, action);
        
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthenticated).toBe(true);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        // Можно добавить проверку вызова secureStoreToken если нужно
      });

      it('should handle login.rejected', () => {
        const error = 'Login failed';
        const action = { type: login.rejected.type, payload: error };
        const state = authReducer(initialState, action);
        
        expect(state.error).toEqual(error);
        expect(state.loading).toBe(false);
        expect(state.isAuthenticated).toBe(false);
      });
    });

    describe('register', () => {
      it('should handle register.pending', () => {
        const action = { type: register.pending.type };
        const state = authReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('should handle register.fulfilled', () => {
        const payload = { user: mockUser, token: mockToken };
        const action = { type: register.fulfilled.type, payload };
        const state = authReducer(initialState, action);
        
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthenticated).toBe(true);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
      });

      it('should handle register.rejected', () => {
        const error = 'Registration failed';
        const action = { type: register.rejected.type, payload: error };
        const state = authReducer(initialState, action);
        
        expect(state.error).toEqual(error);
        expect(state.loading).toBe(false);
      });
    });

    describe('fetchCurrentUser', () => {
      it('should handle fetchCurrentUser.fulfilled', () => {
        const action = { type: fetchCurrentUser.fulfilled.type, payload: mockUser };
        const state = authReducer(initialState, action);
        
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthenticated).toBe(true);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
      });

      it('should handle fetchCurrentUser.rejected', () => {
        const error = 'Failed to fetch user';
        const action = { type: fetchCurrentUser.rejected.type, payload: error };
        const state = authReducer(initialState, action);
        
        expect(state.error).toEqual(error);
        expect(state.loading).toBe(false);
        expect(state.isAuthenticated).toBe(false);
      });
    });
  });

  describe('integration tests', () => {
    it('should handle full login/logout flow', () => {
      // Начальное состояние
      let state = authReducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);

      // Логин pending
      state = authReducer(state, { type: login.pending.type });
      expect(state.loading).toBe(true);

      // Логин успешен
      const loginPayload = { user: mockUser, token: mockToken };
      state = authReducer(state, { type: login.fulfilled.type, payload: loginPayload });
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);

      // Выход
      state = authReducer(state, logout());
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});