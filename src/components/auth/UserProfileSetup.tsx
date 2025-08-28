"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  User,
  Heart,
  Users,
  Mountain,
  Camera,
  BookOpen,
  Utensils,
  Plane,
  Car,
  ShoppingBag,
  Hotel,
  TreePine,
  Waves,
  Building2,
} from "lucide-react";

const ageOptions = [
  { value: 0, label: "10세 미만" },
  { value: 10, label: "10~19세" },
  { value: 20, label: "20~29세" },
  { value: 30, label: "30~39세" },
  { value: 40, label: "40~49세" },
  { value: 50, label: "50~59세" },
  { value: 60, label: "60세 이상" },
];

const genderOptions = [
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
  { value: "none", label: "기타" },
];

const isSingleOptions = [
  { value: true, label: "싱글" },
  { value: false, label: "커플" },
];

const hasChildOptions = [
  { value: false, label: "없음" },
  { value: true, label: "있음" },
];

const tagCategories = [
  {
    title: "활동 유형",
    options: [
      { value: "sightseeing", label: "관광", icon: Camera },
      { value: "hiking", label: "등산/하이킹", icon: Mountain },
      { value: "water_sports", label: "해양 스포츠", icon: Waves },
      { value: "skiing", label: "스키/스노보드", icon: TreePine },
      { value: "camping", label: "캠핑", icon: TreePine },
      { value: "cycling", label: "자전거 여행", icon: Car },
    ],
  },
  {
    title: "여행 테마",
    options: [
      { value: "culture_history", label: "문화/역사", icon: BookOpen },
      { value: "food_delicacy", label: "음식/미식", icon: Utensils },
      { value: "nature_scenery", label: "자연/풍경", icon: Mountain },
      { value: "shopping", label: "쇼핑", icon: ShoppingBag },
      { value: "relaxation_resort", label: "휴양/리조트", icon: Hotel },
    ],
  },
  {
    title: "여행 스타일",
    options: [
      { value: "solo", label: "혼자 여행", icon: User },
      { value: "couple", label: "커플 여행", icon: Heart },
      { value: "family", label: "가족 여행", icon: Users },
      { value: "friends", label: "친구 여행", icon: Users },
      { value: "luxury", label: "럭셔리 여행", icon: Hotel },
      { value: "backpacking", label: "배낭여행", icon: Plane },
    ],
  },
  {
    title: "지역/환경 선호",
    options: [
      { value: "urban", label: "도시 중심", icon: Building2 },
      { value: "rural_nature", label: "시골/자연", icon: TreePine },
      { value: "beach", label: "해변", icon: Waves },
      { value: "mountain", label: "산/산악 지역", icon: Mountain },
    ],
  },
];

export default function UserProfileSetup() {
  const { createUserProfile } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    age: 20,
    gender: "none",
    is_single: true,
    has_child: false,
    tags: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createUserProfile(formData);
      router.push("/"); // 메인 페이지로 이동
    } catch (error) {
      console.error("프로필 생성 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">프로필 설정</CardTitle>
          <p className="text-gray-600">
            더 나은 서비스 이용을 위해 추가 정보를 입력해주세요
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 닉네임 */}
            <div className="space-y-3">
              <Label className="text-base font-medium">닉네임 *</Label>
              <Input
                type="text"
                value={formData.nickname}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nickname: e.target.value }))
                }
                placeholder="닉네임을 입력해주세요"
                className="w-full"
                required
              />
            </div>

            {/* 나이 선택 */}
            <div className="space-y-3">
              <Label className="text-base font-medium">나이대 (만나이)</Label>
              <RadioGroup
                value={formData.age.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, age: parseInt(value) }))
                }
                className="grid grid-cols-2 gap-3"
              >
                {ageOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value.toString()}
                      id={`age-${option.value}`}
                    />
                    <Label
                      htmlFor={`age-${option.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* 성별 선택 */}
            <div className="space-y-3">
              <Label className="text-base font-medium">성별</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
                className="flex space-x-6"
              >
                {genderOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`gender-${option.value}`}
                    />
                    <Label
                      htmlFor={`gender-${option.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* 싱글 여부 */}
            <div className="space-y-3">
              <Label className="text-base font-medium">싱글 여부</Label>
              <RadioGroup
                value={formData.is_single.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_single: value === "true",
                  }))
                }
                className="flex space-x-6"
              >
                {isSingleOptions.map((option) => (
                  <div
                    key={option.value.toString()}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value.toString()}
                      id={`is_single-${option.value}`}
                    />
                    <Label
                      htmlFor={`is_single-${option.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* 자녀 여부 */}
            <div className="space-y-3">
              <Label className="text-base font-medium">자녀 여부</Label>
              <RadioGroup
                value={formData.has_child.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    has_child: value === "true",
                  }))
                }
                className="flex space-x-6"
              >
                {hasChildOptions.map((option) => (
                  <div
                    key={option.value.toString()}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value.toString()}
                      id={`has_child-${option.value}`}
                    />
                    <Label
                      htmlFor={`has_child-${option.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* 관심사 태그 - 카테고리별로 그룹화 */}
            <div className="space-y-6">
              <Label className="text-base font-medium">
                관심사 (다중 선택 가능)
              </Label>

              {tagCategories.map((category) => (
                <div key={category.title} className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                    {category.title}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {category.options.map((tag) => {
                      const IconComponent = tag.icon;
                      return (
                        <div
                          key={tag.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`tag-${tag.value}`}
                            checked={formData.tags.includes(tag.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleTagToggle(tag.value);
                              } else {
                                handleTagToggle(tag.value);
                              }
                            }}
                          />
                          <Label
                            htmlFor={`tag-${tag.value}`}
                            className="text-sm cursor-pointer flex items-center gap-2"
                          >
                            <IconComponent className="w-4 h-4" />
                            {tag.label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formData.nickname.trim()}
            >
              {isLoading ? "저장 중..." : "프로필 저장"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
