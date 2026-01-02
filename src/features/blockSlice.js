import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch the list of blocked sites from the hosts file
export const fetchBlocklist = createAsyncThunk('block/fetch', async (_, { rejectWithValue }) => {
  try {
    // Calls the Electron Backend
    const result = await window.electronAPI.getBlocklist();
    if (result.success) return result.data; // Expecting an array of strings
    return rejectWithValue(result.error);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Add a site
export const addSite = createAsyncThunk('block/add', async (url, { rejectWithValue }) => {
  try {
    const result = await window.electronAPI.blockSite(url);
    if (!result.success) throw new Error(result.error);
    return url;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Remove a site
export const removeSite = createAsyncThunk('block/remove', async (url, { rejectWithValue }) => {
  try {
    const result = await window.electronAPI.unblockSite(url);
    if (!result.success) throw new Error(result.error);
    return url;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const blockSlice = createSlice({
  name: 'blocklist',
  initialState: { list: [], error: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBlocklist.pending, (state) => { state.loading = true; })
      .addCase(fetchBlocklist.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      // Add
      .addCase(addSite.fulfilled, (state, action) => {
        // Prevent duplicates in UI
        if (!state.list.includes(action.payload)) {
          state.list.push(action.payload);
        }
      })
      .addCase(addSite.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove
      .addCase(removeSite.fulfilled, (state, action) => {
        state.list = state.list.filter(site => site !== action.payload);
      });
  }
});

export default blockSlice.reducer;