"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const { clearError } = useAuth();

  // mode가 바뀔 때 error 초기화
  useEffect(() => {
    clearError();
  }, [mode]);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === "login" ? "로그인" : "회원가입"}
            </h1>
            <p className="text-gray-600 mt-2">
              {mode === "login" ? "계정에 로그인하세요" : "새 계정을 만드세요"}
            </p>
          </div>

          {mode === "login" ? (
            <LoginForm
              onSwitchToSignup={() => handleModeChange("signup")}
              onForgotPassword={() => {
                alert("비밀번호 재설정 기능은 준비 중입니다.");
              }}
            />
          ) : (
            <SignupForm onSwitchToLogin={() => handleModeChange("login")} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
