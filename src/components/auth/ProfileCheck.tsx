"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import UserProfileSetup from "./UserProfileSetup";

interface ProfileCheckProps {
  children: React.ReactNode;
}

export default function ProfileCheck({ children }: ProfileCheckProps) {
  const { user, getUserProfile } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        router.push("/auth");
        return;
      }

      try {
        const profile = await getUserProfile();
        if (profile) {
        } else {
          setShowProfileSetup(true);
        }
      } catch (error) {
        console.error("프로필 확인 실패:", error);
        setShowProfileSetup(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkProfile();
  }, [user, getUserProfile, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>프로필 확인 중...</p>
        </div>
      </div>
    );
  }

  if (showProfileSetup) {
    return <UserProfileSetup />;
  }

  return <>{children}</>;
}
