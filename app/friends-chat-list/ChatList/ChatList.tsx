"use client";
import search from "@/assets/icons/search.png";
import add from "@/assets/icons/plus.png";
import minus from "@/assets/icons/minus.png";
import { useEffect, useState } from "react";
import avatar from "@/assets/images/avatar.png";
import {
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import AddUser from "./AddUser/addUser";
import { useUserStore } from "@/lib/useStore";
import { useChatStore } from "@/lib/chatStore";
import { database } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  blocked: string[];
}

interface Chat {
  chatId: string;
  lastMessage: string;
  receiverId: string;
  updatedAt: number;
  user: User; // Ensure user has the complete User type
  isSeen?: boolean;
}

function ChatList() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const { currentUser } = useUserStore() as { currentUser: User };
  const { changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      return;
    }

    const unSub = onSnapshot(
      doc(database, "userChats", currentUser.id),
      async (res: DocumentData) => {
        const items = res.data()?.chats || [];

        const promises = items.map(async (item: DocumentData) => {
          const userDocRef = doc(database, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as User; // Type assertion to User
            return { ...item, user: userData };
          } else {
            return {
              ...item,
              user: { id: "unknown", username: "Unknown User", blocked: [] },
            };
          }
        });

        const chatData: Chat[] = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      },
    );

    return () => {
      unSub();
    };
  }, [currentUser]);

  async function handleSelect(chatId: string) {
    if (!currentUser) return;

    const selectedChat = chats.find((chat) => chat.chatId === chatId);
    if (!selectedChat) return;

    // IMPORTANT: strip the joined `user` object before writing back to
    // Firestore. It was attached client-side in the onSnapshot handler and
    // can contain `undefined` fields (e.g. no avatar), which makes
    // updateDoc throw and silently kills the whole select flow below.
    const userChats = chats.map(({ user, ...rest }) => {
      if (rest.chatId === chatId) {
        return { ...rest, isSeen: true };
      }
      return rest;
    });

    const userChatsRef = doc(database, "userChats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });

      const userToPass: User = {
        id: selectedChat.user.id,
        username: selectedChat.user.username,
        avatar: selectedChat.user.avatar,
        blocked: selectedChat.user.blocked || [],
        email: selectedChat.user.email,
      };
      changeChat(chatId, userToPass);
    } catch (err) {
      console.log(err);
    } finally {
      router.push("/");
    }
  }

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase()),
  );

  return (
    <div className="w-full">
      <div className="border-b border-white/10 p-3">
        <div className="flex items-center justify-center gap-5">
          <div className="flex flex-1 p-2 items-center justify-around gap-5 rounded-[10px] bg-[rgba(17,25,37,0.5)]">
            <Image
              src={search}
              alt="Search Icon"
              width={24}
              height={24}
              className="h-[18px] w-auto"
            />
            <input
              type="text"
              placeholder="Search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none"
            />
          </div>
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-[10px] cursor-pointer hover:bg-white/20 bg-[rgba(17,25,37,0.5)] p-[10px]"
          >
            <Image
              src={isOpen ? minus : add}
              alt="Add"
              width={24}
              height={24}
              className="h-5 w-auto"
            />
          </div>
        </div>
      </div>
      <div>
        {filteredChats.map((chat) => (
          <div
            className="flex cursor-pointer items-center justify-between gap-5 border-b border-slate-400 p-5 hover:bg-[rgb(248,185,134)]"
            key={chat.chatId}
            onClick={() => handleSelect(chat.chatId)}
            style={{
              backgroundColor: chat.chatId ? "#6935C61f" : "transparent",
            }}
          >
            <div className="flex items-center justify-center gap-5">
              <Image
                src={
                  chat.user.blocked.includes(currentUser.id)
                    ? avatar
                    : chat.user.avatar || avatar
                }
                alt="DP"
                width={100}
                height={100}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="mr-10 flex flex-col">
                <span className="text-base font-bold">
                  {chat.user.blocked.includes(currentUser.id)
                    ? "User"
                    : chat.user.username}
                </span>
                <span className="text-start text-xs font-medium">
                  {chat.lastMessage.slice(0, 10)}...
                </span>
              </div>
            </div>
            <span className="text-right text-xs">
              {new Date(chat.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>
      {isOpen && <AddUser setIsOpen={setIsOpen} />}
    </div>
  );
}

export default ChatList;
