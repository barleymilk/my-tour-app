"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { SignupCredentials } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [credentials, setCredentials] = useState<SignupCredentials>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signup, error } = useAuth();

  const validateForm = () => {
    if (credentials.password !== confirmPassword) {
      setValidationError("비밀번호가 일치하지 않습니다.");
      return false;
    }
    if (credentials.password.length < 6) {
      setValidationError("비밀번호는 최소 6자 이상이어야 합니다.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await signup(credentials);
      setSignupSuccess(true);
    } catch (error) {
      console.error("회원가입 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 성공 시 인증 안내 화면
  if (signupSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-xl">회원가입 완료!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            <strong>{credentials.email}</strong>로 인증 이메일을 보냈습니다.
            <br />
            이메일을 확인하고 링크를 클릭해주세요.
          </p>

          <div className="space-y-3">
            <Button onClick={() => onSwitchToLogin()} className="w-full">
              로그인으로 이동
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <p>• 스팸 폴더도 확인해보세요</p>
            <p>• 인증 완료 후 로그인할 수 있습니다</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">이름 *</Label>
        <Input
          id="name"
          type="text"
          value={credentials.name}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="이름을 입력하세요"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">이메일 *</Label>
        <Input
          id="email"
          type="email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="이메일을 입력하세요"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호 *</Label>
        <Input
          id="password"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, password: e.target.value }))
          }
          placeholder="비밀번호를 입력하세요 (최소 6자)"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setCredentials((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }));
          }}
          placeholder="비밀번호를 다시 입력하세요"
          required
        />
      </div>

      {(error || validationError) && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {validationError || error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={
          isLoading ||
          !credentials.email ||
          !credentials.password ||
          !credentials.name ||
          !confirmPassword
        }
      >
        {isLoading ? "회원가입 중..." : "회원가입"}
      </Button>

      <div className="text-center">
        <div className="text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            로그인
          </button>
        </div>
      </div>
    </form>
  );
}
