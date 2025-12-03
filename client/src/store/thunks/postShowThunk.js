import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance.js";

export const postShowThunk = createAsyncThunk(
  'postShow/postShowThunk', // Thunk 고유명
  async (id, { rejectWithValue }) => {  // id는 외부에서 받아서
    try {
      const url = `/api/posts/${id}`;
      // axiosInstance에서 authorization 받아오기 때문에 여기서 설정 안함

      const response = await axiosInstance.get(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);