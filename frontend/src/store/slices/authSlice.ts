import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.data.token);
      console.log("response", response.data.data.token);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (userData: Omit<User, "id">, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", userData); // Bdelnaha hna
      console.log("response", response);

      localStorage.setItem("token", response.data.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
});

export const currentUser = createAsyncThunk(
  "auth/current-user",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }
    try {
      const response = await api.get("/auth/current-user");
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{ data: { user: User; token: string } }>
        ) => {
          state.loading = false;
          state.user = action.payload.data.user;
          state.token = action.payload.data.token;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signup.fulfilled,
        (
          state,
          action: PayloadAction<{ data: { user: User; token: string } }>
        ) => {
          state.loading = false;
          state.user = action.payload.data.user;
          state.token = action.payload.data.token;
        }
      )
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(currentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(currentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(currentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      });
  },
});

export default authSlice.reducer;
