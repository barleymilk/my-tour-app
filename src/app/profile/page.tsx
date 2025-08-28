"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, MapPin, Users, Settings, LogOut } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getPhotoPath } from "@/hooks/useSupabase";

export interface User {
  id: string;
  nickname: string;
  level: number;
  exp: number;
  age?: number;
  gender?: string;
  is_single: boolean;
  has_child: boolean;
  tags: string[];
  completed_quests_cnt: number;
  visited_attractions_cnt: number;
  friends_cnt: number;
  badges_cnt: number;
}

export interface UserBadge {
  id: string;
  badge_id: string;
  created_at: string;
  badges: {
    id: string;
    title: string;
    description: string;
    image_url: string;
  }[];
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<User>({
    id: "",
    nickname: "",
    level: 1,
    exp: 0,
    age: 0,
    gender: "",
    is_single: false,
    has_child: false,
    tags: [],
    completed_quests_cnt: 0,
    visited_attractions_cnt: 0,
    friends_cnt: 0,
    badges_cnt: 0,
  });
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);

  useEffect(() => {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!user) {
      router.push("/auth");
      return;
    }

    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) {
        console.error("유저 정보 조회 실패:", error);
      } else {
        setUserProfile(data as unknown as User);
      }
    };

    const fetchBadges = async () => {
      const { data: userBadges, error: userBadgesError } = await supabase
        .from("user_badges")
        .select(
          `
            id,
            badge_id,
            created_at,
            badges:badges(
              id,
              title,
              description,
              image_url
            )
          `
        )
        .eq("user_id", user.id);

      // console.log("🎯 배지 조회 결과:", userBadges);
      // console.log("🎯 배지 조회 에러:", userBadgesError);

      if (userBadgesError) {
        console.error("사용자 뱃지 조회 실패:", userBadgesError);
        return;
      }
      // 각 배지의 이미지 URL을 public URL로 변환
      const badgesWithPublicUrls = await Promise.all(
        userBadges.map(async (badge) => {
          if (badge.badges.image_url) {
            const publicUrl = await getPhotoPath(
              badge.badges.image_url,
              "badges"
            );
            return {
              ...badge,
              badges: {
                ...badge.badges,
                image_url: publicUrl,
              },
            };
          }
          return badge;
        })
      );
      setUserBadges(badgesWithPublicUrls as unknown as UserBadge[]);
    };

    fetchUsers();
    fetchBadges();
  }, []);
  // console.log("data", userProfile);
  // console.log("badges", userBadges);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 로그인하지 않은 경우 로딩 표시
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  const recentActivities = [
    { id: 1, type: "quest", text: "남산타워 퀘스트 완료", time: "2시간 전" },
    { id: 2, type: "place", text: "경복궁 방문", time: "1일 전" },
    { id: 3, type: "friend", text: "새 친구 추가", time: "2일 전" },
    { id: 4, type: "badge", text: "탐험가 배지 획득", time: "3일 전" },
  ];

  const experienceProgress = (userProfile.exp / 100) * 100;

  return (
    <>
      <Header title="My Tour App" />
      <main className="mx-6 pb-24 pt-6">
        {/* 프로필 헤더 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {userProfile.nickname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{userProfile.nickname}</h1>
                <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default">레벨 {userProfile.level}</Badge>
                  <span className="text-sm text-gray-600">
                    {userProfile.exp} / 100 EXP
                  </span>
                </div>
                <Progress value={experienceProgress} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 통계 카드들 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold">
                {userProfile.completed_quests_cnt}{" "}
              </p>
              <p className="text-sm text-gray-600">완료된 퀘스트</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">
                {userProfile.visited_attractions_cnt}
              </p>
              <p className="text-sm text-gray-600">방문한 장소</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{userProfile.friends_cnt}</p>
              <p className="text-sm text-gray-600">친구</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-2xl font-bold">{userProfile.badges_cnt}</p>
              <p className="text-sm text-gray-600">배지</p>
            </CardContent>
          </Card>
        </div>

        {/* 배지 섹션 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              획득한 배지 ({userBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userBadges.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {userBadges.map((userBadge) => {
                  const badge = userBadge.badges;

                  if (!badge) return null;

                  return (
                    <div
                      key={userBadge.id}
                      className="text-center p-3 border rounded-lg"
                    >
                      <div className="text-3xl mb-2">
                        {badge.image_url ? (
                          <img
                            src={badge.image_url}
                            alt={badge.title}
                            className="w-12 h-12 mx-auto object-cover rounded-full"
                          />
                        ) : (
                          "🏆"
                        )}
                      </div>
                      <p className="font-semibold text-sm">{badge.title}</p>
                      <p className="text-xs text-gray-600">
                        {badge.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(userBadge.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">
                  아직 획득한 배지가 없습니다
                </p>
                <p className="text-sm">
                  퀘스트를 완료하고 배지를 획득해보세요!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 최근 활동 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">{activity.text}</span>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 설정 버튼들 */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            설정
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full justify-start text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            로그아웃
          </Button>
        </div>
      </main>
      <Navigation />
    </>
  );
}
