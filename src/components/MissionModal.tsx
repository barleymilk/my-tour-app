"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mission, InputCondition } from "@/data";
import dynamic from "next/dynamic";

// Lottie 컴포넌트를 동적으로 import
const TrophyLottie = dynamic(() => import("@/components/lottie/trophy"), {
  ssr: false,
  loading: () => (
    <div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse" />
  ),
});

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission | null;
  onMissionComplete?: (
    missionId: string,
    inputs: Record<string, unknown>
  ) => void;
}

const MissionModal = ({
  isOpen,
  onClose,
  mission,
  onMissionComplete,
}: MissionModalProps) => {
  const [inputs, setInputs] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTrophy, setShowTrophy] = useState(false);

  console.log("@@@mission", mission);

  if (!isOpen || !mission) return null;

  const handleInputChange = (inputKey: string, value: unknown) => {
    setInputs((prev) => ({
      ...prev,
      [inputKey]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!mission) return;

    setIsSubmitting(true);
    try {
      // 미션 완료 처리
      if (onMissionComplete) {
        await onMissionComplete(mission.mission_id, inputs);
      }

      // 트로피 애니메이션 표시
      setShowTrophy(true);

      // 3초 후 모달 닫기
      setTimeout(() => {
        setShowTrophy(false);
        onClose();
        setInputs({});
      }, 3000);
    } catch (error) {
      console.error("미션 완료 실패:", error);
      setIsSubmitting(false);
    } finally {
      // 성공/실패 상관없이 항상 isSubmitting을 false로 설정
      setIsSubmitting(false);
    }
  };

  // 트로피 화면 렌더링
  if (showTrophy) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-md text-center">
          <div className="py-8">
            <div className="mb-4">
              <TrophyLottie />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              미션 완료!
            </h2>
            <p className="text-gray-600">
              {mission.title}을 성공적으로 완료했습니다!
            </p>
            <div className="mt-4 text-sm text-gray-500">
              잠시 후 자동으로 닫힙니다...
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const renderInputField = (missionType: string, index: number) => {
    const inputKey = `input_${index}`;

    console.log(`renderInputField 호출됨:`, {
      index,
      inputKey,
      missionType,
    });

    switch (missionType) {
      case "text":
        console.log("텍스트 입력 필드 렌더링");
        return (
          <div key={inputKey} className="space-y-2">
            <Label htmlFor={inputKey}>
              텍스트 입력 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id={inputKey}
              placeholder="미션 완료에 대한 텍스트를 입력해주세요"
              value={(inputs[inputKey] as string) || ""}
              onChange={(e) => handleInputChange(inputKey, e.target.value)}
              className="min-h-[100px]"
              required
            />
            <p className="text-sm text-gray-600">
              미션을 완료한 후의 느낌이나 경험을 자유롭게 작성해주세요
            </p>
          </div>
        );

      case "photo":
        console.log("사진 입력 필드 렌더링");
        return (
          <div key={inputKey} className="space-y-2">
            <Label htmlFor={inputKey}>
              사진 촬영 <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                id={inputKey}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // 파일 크기 체크 (10MB)
                    if (file.size > 10 * 1024 * 1024) {
                      alert("파일 크기는 10MB 이하여야 합니다.");
                      return;
                    }
                    handleInputChange(inputKey, file);
                  }
                }}
                className="hidden"
                required
              />
              <label htmlFor={inputKey} className="cursor-pointer">
                <div className="text-gray-600">
                  {inputs[inputKey] ? (
                    <div>
                      <p className="font-medium text-green-600">
                        ✓ 사진이 선택되었습니다
                      </p>
                      <p className="text-sm">
                        {(inputs[inputKey] as File).name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg">📸 사진을 촬영하거나 선택하세요</p>
                      <p className="text-sm text-gray-500">
                        미션과 관련된 사진을 업로드해주세요
                      </p>
                      <p className="text-xs text-gray-400">
                        최대 10MB (JPG, PNG, GIF 등)
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </div>
            <p className="text-sm text-gray-600">
              미션 완료를 증명할 수 있는 사진을 업로드해주세요
            </p>
          </div>
        );

      case "audio":
        console.log("음성 입력 필드 렌더링");
        return (
          <div key={inputKey} className="space-y-2">
            <Label htmlFor={inputKey}>
              음성 녹음 <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                id={inputKey}
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) {
                      alert("파일 크기는 10MB 이하여야 합니다.");
                      return;
                    }
                    handleInputChange(inputKey, file);
                  }
                }}
                className="hidden"
                required
              />
              <label htmlFor={inputKey} className="cursor-pointer">
                <div className="text-gray-600">
                  {inputs[inputKey] ? (
                    <div>
                      <p className="font-medium text-green-600">
                        ✓ 음성이 선택되었습니다
                      </p>
                      <p className="text-sm">
                        {(inputs[inputKey] as File).name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg">🎤 음성을 녹음하거나 선택하세요</p>
                      <p className="text-sm text-gray-500">
                        미션과 관련된 음성을 업로드해주세요
                      </p>
                      <p className="text-xs text-gray-400">
                        최대 10MB (MP3, WAV, M4A 등)
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </div>
            <p className="text-sm text-gray-600">
              미션 완료를 증명할 수 있는 음성을 업로드해주세요
            </p>
          </div>
        );

      case "quiz":
        console.log("퀴즈 입력 필드 렌더링");
        return (
          <div key={inputKey} className="space-y-2">
            <Label htmlFor={inputKey}>
              퀴즈 답변 <span className="text-red-500">*</span>
            </Label>
            <Input
              id={inputKey}
              placeholder="퀴즈 정답을 입력해주세요"
              value={(inputs[inputKey] as string) || ""}
              onChange={(e) => handleInputChange(inputKey, e.target.value)}
              required
            />
            <p className="text-sm text-gray-600">
              미션과 관련된 퀴즈의 정답을 입력해주세요
            </p>
          </div>
        );

      case "purchase":
        console.log("구매 입력 필드 렌더링");
        return (
          <div key={inputKey} className="space-y-2">
            <Label htmlFor={inputKey}>
              구매 증명 <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                id={inputKey}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) {
                      alert("파일 크기는 10MB 이하여야 합니다.");
                      return;
                    }
                    handleInputChange(inputKey, file);
                  }
                }}
                className="hidden"
                required
              />
              <label htmlFor={inputKey} className="cursor-pointer">
                <div className="text-gray-600">
                  {inputs[inputKey] ? (
                    <div>
                      <p className="font-medium text-green-600">
                        ✓ 구매 증명이 선택되었습니다
                      </p>
                      <p className="text-sm">
                        {(inputs[inputKey] as File).name}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg">🛒 구매 증명을 업로드하세요</p>
                      <p className="text-sm text-gray-500">
                        영수증이나 구매 내역을 촬영해주세요
                      </p>
                      <p className="text-xs text-gray-400">
                        최대 10MB (JPG, PNG, PDF 등)
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </div>
            <p className="text-sm text-gray-600">
              미션과 관련된 구매 증명을 업로드해주세요
            </p>
          </div>
        );

      default:
        console.log("알 수 없는 미션 타입:", missionType);
        return (
          <div key={inputKey} className="space-y-2">
            <Label htmlFor={inputKey}>
              미션 완료 확인 <span className="text-red-500">*</span>
            </Label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-800 font-medium">
                이 미션은 특별한 입력이 필요하지 않습니다
              </p>
              <p className="text-blue-600 text-sm mt-1">
                미션을 완료했다고 생각되시면 "미션 완료" 버튼을 클릭하세요
              </p>
            </div>
          </div>
        );
    }
  };

  const isFormValid = () => {
    if (!mission?.type) {
      console.log("미션 타입이 없음 - 폼 유효함");
      return true;
    }

    console.log("폼 유효성 검사 시작:", mission.type);

    // 특정 타입들은 입력이 필수가 아님
    if (["purchase", "time", "action", "multiple"].includes(mission.type)) {
      console.log("이 미션 타입은 입력이 필수가 아님");
      return true;
    }

    const inputKey = `input_0`;
    const value = inputs[inputKey];

    console.log(`입력 필드 검사:`, {
      inputKey,
      value,
      missionType: mission.type,
    });

    if (value === undefined || value === null || value === "") {
      console.log(`입력 필드: 값이 없음`);
      return false;
    }

    // 타입별 유효성 검사
    switch (mission.type) {
      case "text":
        const textValue = value as string;
        if (textValue.trim().length === 0) {
          console.log(`텍스트 입력: 빈 문자열`);
          return false;
        }
        break;
      case "photo":
      case "audio":
      case "purchase":
        if (!(value instanceof File)) {
          console.log(`파일 입력: 파일이 아님`);
          return false;
        }
        break;
    }

    console.log(`입력 필드: 유효함`);
    return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {mission.title}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-gray-600 mb-4 text-center">
          {mission.description}
        </DialogDescription>

        {/* 미션 정보 카드 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>📋 미션 정보</span>
              <div className="flex gap-2">
                <Badge
                  variant={
                    mission.difficulty === "easy"
                      ? "default"
                      : mission.difficulty === "medium"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {mission.difficulty === "easy"
                    ? "쉬움"
                    : mission.difficulty === "medium"
                    ? "보통"
                    : "어려움"}
                </Badge>
                <Badge variant="outline">
                  ⏱️ {mission.estimated_duration}분
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">📍 위치</Label>
                <p className="text-gray-700">{mission.place_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">🎯 조건</Label>
                <p className="text-gray-700">{mission.condition}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 미션 완료 입력 폼 */}
        {mission?.type ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">✅ 미션 완료하기</h3>
            {renderInputField(mission.type, 0)}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg font-medium">입력 필드가 없습니다</p>
            <p className="text-sm">
              이 미션은 추가 입력 없이 완료할 수 있습니다
            </p>
          </div>
        )}

        {/* 미션 완료 팁 */}
        {mission.tips && mission.tips.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">💡 완료 팁</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {mission.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "처리 중..." : "미션 완료"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MissionModal;
