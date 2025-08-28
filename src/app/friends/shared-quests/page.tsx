"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { sharedQuests, friends } from "@/data/friends";
import { SharedQuest } from "@/data/types";
import Navigation from "@/components/Navigation";
import Header from "@/components/Header";

export default function SharedQuestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "active" | "completed"
  >("all");

  const filteredQuests = sharedQuests.filter((quest) => {
    if (selectedStatus === "all") return true;
    return quest.status === selectedStatus;
  });

  const getFriendInfo = (userId: string) => {
    return friends.find((friend) => friend.friend_user_id === userId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "abandoned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "진행중";
      case "completed":
        return "완료";
      case "abandoned":
        return "포기";
      default:
        return status;
    }
  };

  return (
    <>
      <Header title="My Tour App" />
      <main className="mx-6 pb-24 pt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 공유 퀘스트
          </h1>
          <p className="text-gray-600">
            친구와 함께 진행하는 퀘스트를 확인하고 관리하세요!
          </p>
        </div>

        {/* 상태 필터 */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <Button
              variant={selectedStatus === "all" ? "default" : "outline"}
              onClick={() => setSelectedStatus("all")}
            >
              전체 ({sharedQuests.length})
            </Button>
            <Button
              variant={selectedStatus === "active" ? "default" : "outline"}
              onClick={() => setSelectedStatus("active")}
            >
              진행중 ({sharedQuests.filter((q) => q.status === "active").length}
              )
            </Button>
            <Button
              variant={selectedStatus === "completed" ? "default" : "outline"}
              onClick={() => setSelectedStatus("completed")}
            >
              완료 (
              {sharedQuests.filter((q) => q.status === "completed").length})
            </Button>
          </div>
        </div>

        {/* 공유 퀘스트 목록 */}
        <div className="space-y-4">
          {filteredQuests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                {selectedStatus === "all"
                  ? "공유된 퀘스트가 없습니다."
                  : `${getStatusText(selectedStatus)}된 퀘스트가 없습니다.`}
              </CardContent>
            </Card>
          ) : (
            filteredQuests.map((quest) => {
              const friend = getFriendInfo(
                quest.shared_by_user_id === "USER-001"
                  ? quest.shared_with_user_id
                  : quest.shared_by_user_id
              );
              const isSharedByMe = quest.shared_by_user_id === "USER-001";

              return (
                <Card
                  key={quest.shared_quest_id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{quest.quest_title}</span>
                      <Badge className={getStatusColor(quest.status)}>
                        {getStatusText(quest.status)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 친구 정보 */}
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={friend?.friend_avatar_url} />
                        <AvatarFallback>
                          {friend?.friend_username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {isSharedByMe ? "나 → " : ""}
                          {friend?.friend_username}
                          {!isSharedByMe ? " → 나" : ""}
                        </p>
                        <p className="text-sm text-gray-600">
                          {isSharedByMe
                            ? "내가 공유한 퀘스트"
                            : "친구가 공유한 퀘스트"}
                        </p>
                      </div>
                    </div>

                    {/* 진행률 */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>진행률</span>
                        <span>{quest.progress}%</span>
                      </div>
                      <Progress value={quest.progress} className="h-2" />
                    </div>

                    {/* 날짜 정보 */}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        공유일:{" "}
                        {new Date(quest.created_at).toLocaleDateString()}
                      </span>
                      {quest.completed_at && (
                        <span>
                          완료일:{" "}
                          {new Date(quest.completed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex space-x-2">
                      {quest.status === "active" && (
                        <>
                          <Button size="sm">🎯 퀘스트 진행</Button>
                          <Button variant="outline" size="sm">
                            💬 채팅하기
                          </Button>
                        </>
                      )}
                      {quest.status === "completed" && (
                        <Button variant="outline" size="sm">
                          🏆 완료 축하하기
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        📊 상세보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* 새 퀘스트 공유 버튼 */}
        <div className="mt-8 text-center">
          <Button size="lg" className="px-8">
            🎯 새 퀘스트 공유하기
          </Button>
        </div>

        <Navigation />
      </main>
    </>
  );
}
