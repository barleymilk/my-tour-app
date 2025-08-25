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
import { Mission, InputType, InputCondition } from "@/data";

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

      // 성공 후 모달 닫기
      onClose();
      setInputs({});
    } catch (error) {
      console.error("미션 완료 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInputField = (input: InputCondition, index: number) => {
    const inputKey = `input_${index}`;

    switch (input.type) {
      case "text":
        return (
          <div key={inputKey} className="space-y-2">
            <Label htmlFor={inputKey}>
              텍스트 입력{" "}
              {input.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={inputKey}
              placeholder={input.hint || "텍스트를 입력해주세요"}
              value={inputs[inputKey] || ""}
              onChange={(e) => handleInputChange(inputKey, e.target.value)}
              minLength={input.min_length}
              maxLength={input.max_length}
              className="min-h-[100px]"
            />
            {input.hint && (
              <p className="text-sm text-gray-600">{input.hint}</p>
            )}
            {input.min_length && input.max_length && (
              <p className="text-xs text-gray-500">
                {inputs[inputKey]?.length || 0} / {input.max_length} 글자
              </p>
            )}
          </div>
        );

      case "number":
        return (
          <div key={inputKey} className="space-y-2">
            <Label htmlFor={inputKey}>
              숫자 입력{" "}
              {input.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={inputKey}
              type="number"
              placeholder={input.hint || "숫자를 입력해주세요"}
              value={inputs[inputKey] || ""}
              onChange={(e) =>
                handleInputChange(inputKey, Number(e.target.value))
              }
              min={input.min_value}
              max={input.max_value}
            />
            {input.hint && (
              <p className="text-sm text-gray-600">{input.hint}</p>
            )}
          </div>
        );

      case "photo":
        return (
          <div key={inputKey} className="space-y-2">
            <Label htmlFor={inputKey}>
              사진 촬영{" "}
              {input.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                id={inputKey}
                type="file"
                accept={input.file_types?.join(",") || "image/*"}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // 파일 크기 체크 (MB)
                    if (
                      input.max_file_size &&
                      file.size > input.max_file_size * 1024 * 1024
                    ) {
                      alert(
                        `파일 크기는 ${input.max_file_size}MB 이하여야 합니다.`
                      );
                      return;
                    }
                    handleInputChange(inputKey, file);
                  }
                }}
                className="hidden"
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
                      <p className="text-lg">📷 사진을 촬영하거나 선택하세요</p>
                      <p className="text-sm text-gray-500">
                        {input.file_types?.join(", ") || "이미지 파일"}
                      </p>
                      {input.max_file_size && (
                        <p className="text-xs text-gray-400">
                          최대 {input.max_file_size}MB
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </label>
            </div>
            {input.hint && (
              <p className="text-sm text-gray-600">{input.hint}</p>
            )}
          </div>
        );

      case "audio":
        return (
          <div key={inputKey} className="space-y-2">
            <Label htmlFor={inputKey}>
              음성 녹음{" "}
              {input.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                id={inputKey}
                type="file"
                accept={input.file_types?.join(",") || "audio/*"}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (
                      input.max_file_size &&
                      file.size > input.max_file_size * 1024 * 1024
                    ) {
                      alert(
                        `파일 크기는 ${input.max_file_size}MB 이하여야 합니다.`
                      );
                      return;
                    }
                    handleInputChange(inputKey, file);
                  }
                }}
                className="hidden"
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
                        {input.file_types?.join(", ") || "오디오 파일"}
                      </p>
                      {input.max_file_size && (
                        <p className="text-xs text-gray-400">
                          최대 {input.max_file_size}MB
                        </p>
                      )}
                      {input.min_duration && input.max_duration && (
                        <p className="text-xs text-gray-400">
                          {input.min_duration}초 ~ {input.max_duration}초
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </label>
            </div>
            {input.hint && (
              <p className="text-sm text-gray-600">{input.hint}</p>
            )}
          </div>
        );

      case "quiz":
        if (!input.quiz) return null;

        return (
          <div key={inputKey} className="space-y-2">
            <Label htmlFor={inputKey}>
              퀴즈 {input.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="space-y-3">
              <p className="font-medium">{input.quiz.question}</p>

              {input.quiz.type === "multiple_choice" && input.quiz.options ? (
                <div className="space-y-2">
                  {input.quiz.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={inputKey}
                        value={option}
                        checked={inputs[inputKey] === option}
                        onChange={(e) =>
                          handleInputChange(inputKey, e.target.value)
                        }
                        className="text-blue-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <Input
                  placeholder={input.quiz.hint || "정답을 입력하세요"}
                  value={inputs[inputKey] || ""}
                  onChange={(e) => handleInputChange(inputKey, e.target.value)}
                />
              )}

              {input.quiz.hint && (
                <p className="text-sm text-gray-600">💡 {input.quiz.hint}</p>
              )}
            </div>
          </div>
        );

      case "purchase":
        return (
          <div key={inputKey} className="space-y-2">
            <Label htmlFor={inputKey}>
              구매 인증{" "}
              {input.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="space-y-3">
              <Input
                type="number"
                placeholder="구매 금액을 입력하세요"
                value={inputs[inputKey] || ""}
                onChange={(e) =>
                  handleInputChange(inputKey, Number(e.target.value))
                }
                min={input.purchase_min_amount}
              />
              {input.purchase_min_amount && (
                <p className="text-sm text-gray-600">
                  최소 {input.purchase_min_amount.toLocaleString()}원 이상
                  구매해야 합니다
                </p>
              )}
              {input.purchase_categories && (
                <div className="flex flex-wrap gap-2">
                  {input.purchase_categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isFormValid = () => {
    if (!mission.completion.inputs) return true;

    return mission.completion.inputs.every((input, index) => {
      if (!input.required) return true;

      const inputKey = `input_${index}`;
      const value = inputs[inputKey];

      if (value === undefined || value === null || value === "") return false;

      // 타입별 유효성 검사
      switch (input.type) {
        case "text":
          if (input.min_length && value.length < input.min_length) return false;
          if (input.max_length && value.length > input.max_length) return false;
          break;
        case "number":
          if (input.min_value && value < input.min_value) return false;
          if (input.max_value && value > input.max_value) return false;
          break;
        case "purchase":
          if (input.purchase_min_amount && value < input.purchase_min_amount)
            return false;
          break;
      }

      return true;
    });
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
        {mission.completion.inputs && mission.completion.inputs.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">✅ 미션 완료하기</h3>

            {mission.completion.inputs.map((input, index) =>
              renderInputField(input, index)
            )}
          </div>
        )}

        {/* 추가 조건 */}
        {mission.completion.additional_conditions &&
          mission.completion.additional_conditions.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">📝 추가 조건</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {mission.completion.additional_conditions.map(
                    (condition, index) => (
                      <li key={index}>{condition}</li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
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
