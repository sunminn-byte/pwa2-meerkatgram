import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const postIndexThunk = createAsyncThunk(
  'postIndex/postIndexThunk', // Thunk 고유명
  async (page, { rejectWithValue }) => {
    try {
      const url = 'api/posts';
      const params = { page };

      const response = await axiosInstance.get(url, { params });

      // return response; // data는 선택사항
      return response.data; // 값 전체
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);