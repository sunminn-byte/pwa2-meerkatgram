import { createSlice } from '@reduxjs/toolkit';
import { postShowThunk } from '../thunks/postShowThunk.js';

const initialState = {
  show: null,
}

const slice = createSlice({
  name: 'postShow',
  initialState,
  reducers: {
    clearPostShow(state) {
      state.show = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postShowThunk.fulfilled, (state, action) => {
        state.show = action.payload.data;
        // 위에 무슨 값이 오는지 모르겠으면 breakpoint 걸거나 아래에 console 찍어보기
      })
  },
});

// reducers의 action들을 내보내는 처리
export const {
  clearPostShow,
} = slice.actions;

export default slice.reducer;