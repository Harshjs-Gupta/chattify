"use client";
import avatar from "@/assets/images/avatar.png";
import { toast } from "react-toastify";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState, FormEvent } from "react";
import { useUserStore } from "@/lib/useStore";
import { database } from "@/lib/firebase";
import Image from "next/image";
import { X } from "lucide-react";

interface User {
  id: string;
  username: string;
  avatar?: string;
}

function AddUser({ setIsOpen }: { setIsOpen: (prev: boolean) => void }) {
  const [user, setUser] = useState<User | null>(null);
  const { currentUser } = useUserStore() as { currentUser: User };

  // Search user to add in chat list
  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = (formData.get("username") as string).trim().toLowerCase();

    try {
      const userRef = collection(database, "users");
      const q = query(userRef, where("usernameLower", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        const userData = querySnapShot.docs[0].data() as User;
        setUser(userData);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        toast.error(err.message);
      }
    }
  }

  // Add function when click user it get add in this list
  async function handleAdd() {
    if (!user) return;

    const chatRef = collection(database, "chats");
    const userChatsRef = collection(database, "userChats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        message: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsOpen(false);
      setUser(null);
    }
  }

  return (
    <div className="absolute h-screen w-screen z-20 top-0 rounded-[10px] bg-black/80 p-[30px]">
      <form
        onSubmit={handleSearch}
        className="mb-5 w-full flex items-center justify-center gap-5"
      >
        <X
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-[10px] cursor-pointer"
        />
        <input
          type="text"
          placeholder="Username"
          name="username"
          className=" w-full mt-5 rounded-[10px] bg-[#6935C68f] text-base p-2 outline-none"
        />
        <button
          type="submit"
          className="rounded-sm mt-5 bg-[#6935C6] font-semibold p-2 cursor-pointer transition-all hover:bg-[#6935C6]/80 text-base"
        >
          Search
        </button>
      </form>
      {user && (
        <div className="flex flex-1 bg-[#6935C65f] rounded-md items-center justify-between border-b border-white/10 p-[10px]">
          <div className="flex items-center justify-center gap-5">
            <Image
              src={user.avatar || avatar}
              alt="profilePic"
              className="h-[50px] w-[50px] rounded-sm object-cover"
              width={50}
              height={50}
            />
            <span className="text-xl font-normal text-white">
              {user.username}
            </span>
          </div>
          <button
            onClick={handleAdd}
            className="rounded-[10px] bg-[#6935C6] font-semibold p-2 cursor-pointer transition-all hover:bg-[#6935C6]/80 text-sm"
          >
            Add User
          </button>
        </div>
      )}
    </div>
  );
}

export default AddUser;
