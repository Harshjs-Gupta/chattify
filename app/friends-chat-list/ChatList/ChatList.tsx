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
import { EllipsisVertical } from "lucide-react";
import { toast } from "react-toastify";

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
  const [isOpen, setIsOpen] = useState<boolean>(false); // For AddUser modal visibility
  const [deleteChatOption, setDeleteChatOption] = useState<string | null>(null); // For delete chat popup visibility
  const [chats, setChats] = useState<Chat[]>([]); // For storing all chats
  const [input, setInput] = useState<string>(""); // For search input
  const router = useRouter(); // For routing to different pages
  const { currentUser } = useUserStore() as { currentUser: User }; // For getting current user
  const { changeChat } = useChatStore(); // For changing chat

  // UseEffect to fetch all chats
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

  // Handler for selecting a chat
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

  // Handler for deleting a chat
  async function handleDeleteChat(chatId: string) {
    // Confirmation for deleting the chat
    const confirmed = window.confirm(
      "Are you sure you want to delete this chat?",
    );

    if (!confirmed) {
      setDeleteChatOption(null);
      return;
    }
    if (!currentUser) return;

    // Get the user chats reference
    const userChatsRef = doc(database, "userChats", currentUser.id);

    try {
      alert("You wanted to delete this chat");
      // Update the user chats reference with the filtered chats
      await updateDoc(userChatsRef, {
        chats: chats.filter((chat) => chat.chatId !== chatId),
      });
      toast.success("Chat deleted successfully");
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteChatOption(null);
    }
  }

  // Filter the chats based on the search input
  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase()),
  );

  return (
    <div className="w-full">
      <div className="border-b border-white/10 p-3">
        {/* Search user and Add User */}
        <div className="flex items-center justify-center gap-5">
          {/* Search bar for search available user */}
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
          {/* Add user button */}
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
      {/* ChatList of added user */}
      <div>
        {chats.length !== 0 ? (
          filteredChats.map((chat, index) => (
            <div
              className="flex cursor-pointer items-center justify-between gap-5 border-b border-slate-400 px-3 py-4 hover:bg-[rgb(248,185,134)]"
              key={chat.chatId}
              // onDoubleClickCapture={() => handleDeleteChat(chat.chatId)}
              style={{
                backgroundColor: chat.chatId ? "#6935C61f" : "transparent",
              }}
            >
              {/*  */}
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
                  onClick={() => handleSelect(chat.chatId)}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="mr-10 flex flex-col">
                  <span
                    className="text-base font-bold"
                    onClick={() => handleSelect(chat.chatId)}
                  >
                    {chat.user.blocked.includes(currentUser.id)
                      ? "User"
                      : chat.user.username}
                  </span>
                  <span className="text-start text-xs font-medium">
                    {chat.lastMessage.slice(0, 10)}
                    {chat.lastMessage.length > 10 ? <span>...</span> : null}
                  </span>
                </div>
              </div>
              <div className="relative flex gap-2 items-center">
                <span className="text-right text-xs">
                  {new Date(chat.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <EllipsisVertical
                  size={16}
                  onClick={() =>
                    setDeleteChatOption((prev) =>
                      prev === chat.chatId ? null : chat.chatId,
                    )
                  }
                />
                {deleteChatOption === chat.chatId && (
                  <button
                    className="absolute top-5  w-max text-xs font-semibold hover:bg-[#4b2887] z-10 active:bg-[#6935C69f] cursor-pointer py-2 px-1 rounded-sm bg-[#6935C6]"
                    onClick={() => handleDeleteChat(chat.chatId)}
                  >
                    Clear Chat
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-full h-full space-y-2 mt-10 tex-xl flex flex-col items-center justify-center text-xs font-medium">
            <span className="font-bold text-2xl md:text-4xl lg:text-5xl">
              No chats found
            </span>
            <br />
            <span className="text-base md:text-xl lg:text-2xl">
              Search my name "Harsh" or "harsh" to chat with me as a demo chat
            </span>
            <br />
            <span className="text-base md:text-xl lg:text-2xl">
              Click the + button above to add a new chat
            </span>
            <br />
            <span></span>
          </div>
        )}
      </div>
      {isOpen && <AddUser setIsOpen={setIsOpen} />}
    </div>
  );
}

export default ChatList;
