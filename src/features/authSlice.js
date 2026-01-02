import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 1. Thunk: Check if app is already set up
export const checkSetup = createAsyncThunk('auth/checkSetup', async () => {
  return await window.electronAPI.checkAuthStatus();
});

// 2. Thunk: Login
export const loginUser = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const result = await window.electronAPI.verifyUser(creds);
    if (result.success) return result.username;
    return rejectWithValue(result.error);
  } catch (err) {
    return rejectWithValue("Login failed");
  }
});

// 3. Thunk: Create Account
export const signupUser = createAsyncThunk('auth/signup', async (creds, { rejectWithValue }) => {
  try {
    const result = await window.electronAPI.createAccount(creds);
    if (result.success) return result.username;
    return rejectWithValue(result.error);
  } catch (err) {
    return rejectWithValue("Signup failed");
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: null, 
    isAuthenticated: false, 
    isSetupComplete: false, // Tracks if an account exists
    loading: true,
    error: null 
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check Setup
      .addCase(checkSetup.fulfilled, (state, action) => {
        state.isSetupComplete = action.payload; // true if file exists
        state.loading = false;
      })
      // Login Success
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      // Login Fail
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Signup Success
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isSetupComplete = true; // Now it's set up!
        state.user = action.payload;
        state.error = null;
      })
      // Signup Fail
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;