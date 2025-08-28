"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { useAuth } from "@/contexts/AuthContext";
import { LoginCredentials } from "@/types/auth";
import { Mail, RefreshCw } from "lucide-react";

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export default function LoginForm({
  onSwitchToSignup,
  onForgotPassword,
}: LoginFormProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const { login, error, resendVerificationEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      return;
    }

    setIsLoading(true);
    try {
      await login(credentials);
    } catch (error) {
      console.error("로그인 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!credentials.email) return;

    setIsResending(true);
    try {
      await resendVerificationEmail(credentials.email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (error) {
      console.error("인증 이메일 재전송 실패:", error);
    } finally {
      setIsResending(false);
    }
  };

  const isEmailNotConfirmed =
    error?.includes("Email not confirmed") ||
    error?.includes("이메일이 확인되지 않았습니다");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <InputField
          id="email"
          label="이메일"
          type="email"
          value={credentials.email}
          onChange={(value) =>
            setCredentials((prev) => ({ ...prev, email: value }))
          }
          placeholder="이메일을 입력하세요"
          required
        />
      </div>

      <div className="space-y-2">
        <InputField
          id="password"
          label="비밀번호"
          type="password"
          value={credentials.password}
          onChange={(value) =>
            setCredentials((prev) => ({ ...prev, password: value }))
          }
          placeholder="비밀번호를 입력하세요"
          required
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}

          {/* 이메일 인증 에러인 경우 재전송 버튼 표시 */}
          {isEmailNotConfirmed && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-sm text-red-700 mb-2 text-center">
                이메일 인증이 필요합니다. <br />
                인증 이메일을 받지 못하셨나요?
              </p>
              <Button
                type="button"
                onClick={handleResendEmail}
                disabled={isResending}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    전송 중...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    인증 이메일 다시 보내기
                  </>
                )}
              </Button>

              {resendSuccess && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded-md mt-2 text-center">
                  인증 이메일을 다시 보냈습니다!
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !credentials.email || !credentials.password}
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </Button>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          비밀번호를 잊으셨나요?
        </button>

        <div className="text-sm text-gray-600">
          계정이 없으신가요?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            회원가입
          </button>
        </div>
      </div>
    </form>
  );
}
