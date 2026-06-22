"use client";

import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function userGetMe(enabled: boolean) {
  const disptch = useDispatch();
  useEffect(() => {
    if (!enabled) return;

    const getMe = async () => {
      try {
        const { data } = await axios.get("/api/user/me");
        disptch(setUserData(data.user));
      } catch (error) {
        console.log(error);
      }
    };
    getMe();
  }, [enabled, disptch]);
}

export default userGetMe;
