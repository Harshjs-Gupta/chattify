import { create } from "zustand";
import { useUserStore } from "./useStore";

interface ChatUser {
  id: string;
  username: string;
  avatar?: string;
  blocked: string[];
  email: string;
}

interface ChatStore {
  chatId: string | null;
  user: ChatUser | null;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
  changeChat: (chatId: string, user: ChatUser) => void;
  changeBlock: () => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,

  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    // Current user has been blocked by the receiver
    if (user.blocked?.includes(currentUser?.id || "")) {
      set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
      return;
    }

    // Current user has blocked the receiver
    if (currentUser?.blocked?.includes(user.id)) {
      set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
      return;
    }

    set({
      chatId,
      user,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  },

  changeBlock: () => {
    set((state) => ({ isReceiverBlocked: !state.isReceiverBlocked }));
  },

  resetChat: () => {
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  },
}));
