"use client";
import { useState } from "react";
import { auth, database } from "@/lib/firebase";
import avatar from "@/assets/images/avatar.png";
import upArrow from "@/assets/icons/arrowUp.png";
import downArrow from "@/assets/icons/arrowDown.png";
import download from "@/assets/icons/download.png";
import home from "@/assets/images/home.png";
import { useChatStore } from "@/lib/chatStore";
import { useUserStore } from "@/lib/useStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import Image from "next/image";

function UserDetail() {
  const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();

  const { currentUser } = useUserStore();

  const [isOpenArray, setIsOpenArray] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [openShareImg, setOpenShareImg] = useState<boolean>(false);

  // Function to toggle the state of a specific item based on its index
  function handleIconClick(index: number): void {
    setIsOpenArray((prev) => {
      const updatedState = [...prev];
      updatedState[index] = !updatedState[index];
      return updatedState;
    });
  }

  async function handleBlock(): Promise<void> {
    if (!user || !currentUser) return;

    const userDocRef = doc(database, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  }

  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-5 text-center text-sm text-muted-foreground">
        Select a chat to see details
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 border-b border-white/10 p-5 text-center">
        <Image
          src={user.avatar || avatar}
          alt="User Avatar"
          width={100}
          height={100}
          className="h-30 w-30 rounded-full object-cover ring-1 ring-white/10"
        />
        <span className="text-lg font-bold text-white">{user.username}</span>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur.
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Chat Setting</span>
            <Image
              src={isOpenArray[0] ? downArrow : upArrow}
              alt="Chat Setting Icon"
              onClick={() => handleIconClick(0)}
              width={16}
              height={16}
              className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">
              Privacy &amp; Help
            </span>
            <Image
              src={isOpenArray[1] ? downArrow : upArrow}
              alt="Privacy & Help Icon"
              onClick={() => handleIconClick(1)}
              width={16}
              height={16}
              className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Shared File</span>
            <Image
              src={isOpenArray[2] ? downArrow : upArrow}
              alt="Shared File Icon"
              onClick={() => handleIconClick(2)}
              width={16}
              height={16}
              className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Shared Photo</span>
            <Image
              src={isOpenArray[3] ? upArrow : downArrow}
              alt="Shared Photo Icon"
              onClick={() => {
                handleIconClick(3);
                setOpenShareImg((prev) => !prev);
              }}
              width={16}
              height={16}
              className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
            />
          </div>
        </div>

        {openShareImg && (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 rounded-md bg-white/5 p-2"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Image
                    src={home}
                    alt="Shared Pic"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                  <span className="truncate text-xs text-muted-foreground">
                    home_image.png
                  </span>
                </div>
                <Image
                  src={download}
                  alt="Download Icon"
                  width={16}
                  height={16}
                  className="shrink-0 cursor-pointer opacity-70 transition-opacity hover:opacity-100"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={handleBlock}
            className="cursor-pointer rounded-md bg-red-600/80 p-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600"
          >
            {isCurrentUserBlocked
              ? "You are Blocked!"
              : isReceiverBlocked
                ? "User Blocked"
                : "Block User"}
          </button>
          <button
            onClick={() => auth.signOut()}
            className="cursor-pointer rounded-md border border-white/10 p-2.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );
}

export default UserDetail;
