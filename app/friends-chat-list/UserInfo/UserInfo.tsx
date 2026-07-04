"use client";
import more from "@/assets/icons/more.png";
import video from "@/assets/icons/video.png";
import edit from "@/assets/icons/edit.png";
import Image from "next/image";
import { useUserStore } from "@/lib/useStore";
import dummyProfile from "@/assets/images/avatar.png";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

function UserInfo() {
  const { currentUser } = useUserStore();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const router = useRouter();
  // console.log(currentUser);

  function handleLogout() {
    auth.signOut();
    router.push("/");
  }

  return (
    <div className="relative flex items-center justify-between gap-5 border-b border-white/10 p-5">
      <div className="flex flex-1 items-center gap-5">
        <Image
          src={currentUser?.avatar || dummyProfile}
          alt="ProfilePic"
          className="h-[50px] w-[50px] rounded-[10px] object-cover"
          width={100}
          height={100}
        />
        <span className="text-lg font-bold text-white">
          {currentUser?.username}
        </span>
      </div>
      <div className="flex items-center gap-5">
        <Image
          src={more}
          alt="MoreIcon"
          width={100}
          height={100}
          onClick={() => setOpenMenu((prev) => !prev)}
          className="h-5 w-5 cursor-pointer opacity-70 transition-opacity hover:opacity-100"
        />
        <Image
          src={edit}
          alt="EditIcon"
          width={100}
          height={100}
          className="h-5 w-5 cursor-pointer opacity-70 transition-opacity hover:opacity-100"
        />
      </div>
      {openMenu && (
        <div className="absolute right-5 top-16 z-50 flex flex-col gap-2">
          <button
            onClick={handleLogout}
            className="cursor-pointer rounded-xl bg-[#ff00004f] font-semibold p-3 text-white"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
export default UserInfo;
