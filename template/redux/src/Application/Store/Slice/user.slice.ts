import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

type userStateType = {
  isLoading: boolean
  error: string | null
  user: any
}

const initialState: userStateType = {
  isLoading: false,
  user: null,
  error: null,
}

type loginRequestType = {
  email: string
  password: string
}

export const loginUser = createAsyncThunk('user/login', (request: loginRequestType) => {
  return axios.post('/api/user/login', { body: request }).then((res) => res.data)
})

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true
      state.error = null
      state.user = null
    }),
      builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<userStateType>) => {
        state.isLoading = false
        state.user = action.payload
        state.error = null
      }),
      builder.addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Something went wrong'
        state.user = null
      })
  },
})

export default userSlice.reducer
