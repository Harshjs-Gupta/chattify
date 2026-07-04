"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUserStore } from "@/lib/useStore";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchUserInfo = useUserStore((state: any) => state.fetchUserInfo);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => unSub();
  }, [fetchUserInfo]);

  return <>{children}</>;
}

export default AuthProvider;
