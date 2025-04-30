import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    receiverId: null,
  },
  reducers: {
    setReceiverId: (state, action) => {
      state.receiverId = action.payload;
    },
  },
});

export const { setReceiverId } = chatSlice.actions;
export default chatSlice.reducer;
