"use client";
import avatar from "@/assets/images/avatar.png";
import phone from "@/assets/icons/phone.png";
import video from "@/assets/icons/video.png";
import info from "@/assets/icons/info.png";
import image from "@/assets/icons/img.png";
import camera from "@/assets/icons/camera.png";
import mic from "@/assets/icons/mic.png";
import emoji from "@/assets/icons/emoji.png";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import {
  arrayUnion,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { database } from "@/lib/firebase";
import { useChatStore } from "@/lib/chatStore";
import { useUserStore } from "@/lib/useStore";
import { upload } from "@/lib/upload";
import Image from "next/image";

// Define AvatarState interface
interface AvatarState {
  file: File | null;
  url: string;
}

// Define ChatMessage interface
interface ChatMessage {
  senderId: string;
  text: string;
  img?: string;
  createdAt: Date;
  updatedAt?: number;
}

function Chats() {
  const [chat, setChat] = useState<DocumentData | null>(null);
  const [openEmoji, setOpenEmoji] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<AvatarState>({
    file: null,
    url: "",
  });

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(
        doc(database, "chats", chatId),
        (res: DocumentData) => {
          setChat(res.data());
        },
      );

      return () => {
        unSub();
      };
    }
  }, [chatId]);

  // const handleEmoji = (e: EmojiClickData) => {
  //   setText((prev) => prev + e.emoji);
  // };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      const newAvatarURL = URL.createObjectURL(file);
      setImg({
        file: file,
        url: newAvatarURL,
      });
    }
  }

  async function handleSend(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    e.preventDefault(); // Prevent page reload
    if (!text) return;
    if (!chatId) {
      console.error("Invalid chatId");
      return;
    }
    if (!currentUser) {
      console.error("No current user");
      return;
    }

    let imgUrl: string | null = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      const date = new Date(Date.now());

      await updateDoc(doc(database, "chats", chatId), {
        message: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
          updatedAt: date.toLocaleDateString(),
        }),
      });

      const userIDs = [currentUser.id, user?.id].filter(Boolean);

      userIDs.forEach(async (id) => {
        if (!id) return;
        const userChatsRef = doc(database, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c: { chatId: string }) => c.chatId === chatId,
          );

          if (chatIndex !== -1) {
            userChatsData.chats[chatIndex].lastMessage = text;
            userChatsData.chats[chatIndex].isSeen =
              id === currentUser.id ? true : false;
            userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatsRef, {
              chats: userChatsData.chats,
            });
          } else {
            console.error(
              "Chat not found in userChatsData with chatId:",
              chatId,
            );
          }
        }
      });
    } catch (err) {
      console.log("Error sending message:", err);
    } finally {
      setText("");
      setImg({
        file: null,
        url: "",
      });
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  // No user is signed in yet (AuthProvider hasn't resolved) — render nothing.
  if (!currentUser) {
    return (
      <div className="flex flex-2 h-screen w-screen flex-col items-center justify-center border-l border-r border-white/10 bg-[#06030f] text-muted-foreground">
        Loading...
      </div>
    );
  }

  // No chat has been selected from the sidebar yet.
  if (!chatId || !user) {
    return (
      <div className="flex flex-2 flex-col items-center justify-center gap-2 border-l border-r border-white/10 text-center text-muted-foreground">
        <span className="text-lg font-semibold text-white">
          No chat selected
        </span>
        <span className="text-sm">
          Pick a conversation from the list to start messaging
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-2 flex-col border-l border-r border-white/10  text-white">
      {/* Top bar: receiver info */}
      <div className="flex w-full items-center justify-between border-b border-white/10 p-5">
        <div className="flex flex-1 items-center gap-5">
          <Image
            src={user.avatar || avatar}
            alt="ProfilePic"
            width={60}
            height={60}
            className="h-[60px] w-[60px] rounded-full object-cover ring-1 ring-white/10"
          />
          <div className="flex flex-col">
            <span className="font-bold text-white">{user.username}</span>
            <span className="text-sm text-muted-foreground">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit
            </span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Image
            src={phone}
            alt="Phone Icon"
            width={22}
            height={22}
            className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
          />
          <Image
            src={video}
            alt="Video Icon"
            width={22}
            height={22}
            className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
          />
          <Image
            src={info}
            alt="Info Icon"
            width={22}
            height={22}
            className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
          />
        </div>
      </div>

      {/* Message list */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        {chat?.message?.map((message: ChatMessage, index: number) => {
          const isOwn = message.senderId === currentUser.id;
          return (
            <div
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              key={`${message.senderId}-${index}`}
            >
              <div className="flex max-w-[70%] flex-col gap-2">
                {message.img && (
                  <img
                    src={message.img}
                    alt="Message Image"
                    className="rounded-lg object-cover"
                  />
                )}
                {message.text && (
                  <div
                    className={`max-w-[320px] sm:max-w-[420px] md:max-w-[500px] w-fit rounded-lg wrap-break-word p-3 whitespace-pre-wrap overflow-hidden text-sm ${isOwn ? "bg-[#6935C6] text-white" : "bg-white/5 text-white"}`}
                  >
                    <p>{message.text}</p>
                    {message.updatedAt && (
                      <span className="mt-1 block text-xs text-right text-white/80 font-semibold">
                        {message.updatedAt}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {img.url && (
          <div className="flex justify-end">
            <Image
              src={img.url}
              alt="Selected upload"
              width={200}
              height={200}
              className="max-w-[200px] rounded-lg object-cover"
            />
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      {/* Bottom bar: composer */}
      <div className="flex w-full items-center gap-3 border-t border-white/10 p-4">
        <form onSubmit={handleSend} className="flex w-full items-center gap-3">
          <div className="flex items-center gap-3">
            {/* Sent Image */}
            <label htmlFor="file" className="cursor-pointer">
              <Image
                src={image}
                alt="Image Icon"
                width={20}
                height={20}
                className="opacity-70 transition-opacity hover:opacity-100"
              />
            </label>
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={handleImage}
            />
            <Image
              src={camera}
              alt="Camera Icon"
              width={20}
              height={20}
              className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
            />
            <Image
              src={mic}
              alt="Mic Icon"
              width={20}
              height={20}
              className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
            />
          </div>
          <textarea
            placeholder={
              isCurrentUserBlocked || isReceiverBlocked
                ? "You cannot send any message"
                : "Type a message..."
            }
            value={text}
            onChange={(e) => {
              setText(e.target.value);

              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
            rows={1}
            className="flex-1 hide-scrollbar resize-none overflow-y-auto rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-muted-foreground focus:border-violet-400 max-h-32 min-h-[42px] "
          />
          <div className="relative">
            <Image
              src={emoji}
              alt="Emoji Icon"
              width={22}
              height={22}
              onClick={() => setOpenEmoji((prev) => !prev)}
              className="cursor-pointer opacity-70 transition-opacity hover:opacity-100"
            />
            {openEmoji && (
              <div className="absolute bottom-full right-0 z-10 mb-2">
                <EmojiPicker
                  onEmojiClick={(e) => setText((prev) => prev + e.emoji)}
                  theme={Theme.DARK}
                  emojiStyle={EmojiStyle.NATIVE}
                  autoFocusSearch={true}
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isCurrentUserBlocked || isReceiverBlocked}
            className="cursor-pointer rounded-md bg-[#6935C6] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#6935C6]/70 active:bg-[#6935C6]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chats;
