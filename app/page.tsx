"use client";
import LandingPage from "@/components/landingPage";
import { database } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import FriendsChatList from "./friends-chat-list/page";
import Chats from "./chats/page";
import ChatDetails from "./chatDetails/page";
import { useUserStore } from "@/lib/useStore";

interface User {
  id: string;
  username: string;
  avatar?: string;
  blocked: string[];
}

export default function Home() {
  const { currentUser } = useUserStore();
  // console.log(currentUser);
  return (
    <>
      {currentUser ? (
        <div className="flex h-screen w-screen bg">
          <FriendsChatList />
          <Chats />
          <ChatDetails />
        </div>
      ) : (
        <LandingPage />
      )}
    </>
  );
}
