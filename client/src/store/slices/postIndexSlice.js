import { createSlice } from '@reduxjs/toolkit';
import { postIndexThunk } from '../thunks/postIndexThunk.js';

const initialState = {
  list: null,
  page: 0,
  isLasted: false,
}

const slice = createSlice({
  name: 'postIndex',
  initialState, // 위에서 미리 정의해 둠
  reducers: {
    clearPostIndex(state) {
      state.list = null;
      state.page = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postIndexThunk.fulfilled, (state, action) => {
        const { posts, page, count, limit } = action.payload.data;

        // 리스트가 비어있는지 체크
        if(state.list) {
          // state.list = [...state.list, ...action.payload.data.posts];
          state.list = [...state.list, ...posts];
        } else {
          // state.list = action.payload.data.posts;
          state.list = posts;
        }

        // 현재 페이지 저장
        // state.page = action.payload.data.page;
        state.page = page;

        // 마지막 페이지 여부 플래그 저장
        state.isLasted = (page * limit) >= count;
      })
  },
});

// reducers의 action들을 내보내는 처리
export const {
  clearPostIndex,
} = slice.actions;

export default slice.reducer;