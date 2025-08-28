"use client";

import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, MapPin, Users, Settings, LogOut } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function ProfilePage() {
  const userProfile = {
    username: "여행자123",
    level: 15,
    experience: 1250,
    nextLevelExp: 1500,
    avatar: "/api/placeholder/100/100",
    totalQuests: 42,
    completedQuests: 38,
    totalPlaces: 28,
    visitedPlaces: 25,
    friends: 12,
    badges: 8,
  };

  const badges = [
    {
      id: 1,
      name: "첫 퀘스트",
      icon: "🎯",
      description: "첫 번째 퀘스트 완료",
    },
    { id: 2, name: "탐험가", icon: "🗺️", description: "10개 장소 방문" },
    { id: 3, name: "친구 사랑", icon: "👥", description: "5명의 친구 추가" },
    {
      id: 4,
      name: "퀘스트 마스터",
      icon: "🏆",
      description: "20개 퀘스트 완료",
    },
  ];

  const recentActivities = [
    { id: 1, type: "quest", text: "남산타워 퀘스트 완료", time: "2시간 전" },
    { id: 2, type: "place", text: "경복궁 방문", time: "1일 전" },
    { id: 3, type: "friend", text: "새 친구 추가", time: "2일 전" },
    { id: 4, type: "badge", text: "탐험가 배지 획득", time: "3일 전" },
  ];

  const experienceProgress =
    (userProfile.experience / userProfile.nextLevelExp) * 100;

  return (
    <>
      <Header title="My Tour App" />
      <main className="mx-6 pb-24 pt-6">
        {/* 프로필 헤더 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile.avatar} />
                <AvatarFallback className="text-2xl">
                  {userProfile.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{userProfile.username}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default">레벨 {userProfile.level}</Badge>
                  <span className="text-sm text-gray-600">
                    {userProfile.experience} / {userProfile.nextLevelExp} EXP
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
                {userProfile.completedQuests}
              </p>
              <p className="text-sm text-gray-600">완료된 퀘스트</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{userProfile.visitedPlaces}</p>
              <p className="text-sm text-gray-600">방문한 장소</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{userProfile.friends}</p>
              <p className="text-sm text-gray-600">친구</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-2xl font-bold">{userProfile.badges}</p>
              <p className="text-sm text-gray-600">배지</p>
            </CardContent>
          </Card>
        </div>

        {/* 배지 섹션 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              획득한 배지
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="text-center p-3 border rounded-lg"
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <p className="font-semibold text-sm">{badge.name}</p>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                </div>
              ))}
            </div>
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
