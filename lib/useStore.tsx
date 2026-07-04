import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { database } from "./firebase";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  blocked: string[];
}

interface UserStore {
  currentUser: User | null;
  isLoading: boolean;
  fetchUserInfo: (uid: string | undefined) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  isLoading: true,

  fetchUserInfo: async (uid) => {
    if (!uid) {
      set({ currentUser: null, isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      const docRef = doc(database, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data() as User, isLoading: false });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      set({ currentUser: null, isLoading: false });
    }
  },
}));
