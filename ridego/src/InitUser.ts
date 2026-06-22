"use client";
import { useSession } from "next-auth/react";
import userGetMe from "./hooks/userGetMe";

function InitUser() {
  const { status } = useSession();
  userGetMe(status === "authenticated");
  return null;
}

export default InitUser;
