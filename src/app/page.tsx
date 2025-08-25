"use client";
import Image from "next/image";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "tw-animate-css";
import TrophyLottie from "@/components/lottie/trophy";
import NaverMap from "@/components/NaverMap";
import { Quest, quests, inProgressQuests, badges } from "@/data";

const QuestModal = ({
  isOpen,
  onClose,
  quest,
  onRewardClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  quest: Quest | null;
  onRewardClick: () => void;
}) => {
  if (!isOpen) return null;

  // 진행률 계산
  const getQuestProgress = (questId: string) => {
    const progressQuest = inProgressQuests.find((q) => q.quest_id === questId);
    return progressQuest
      ? { progress: progressQuest.progress, total: progressQuest.total }
      : { progress: 0, total: quest?.missions.length || 0 };
  };

  // 미션 상태 확인
  const getMissionStatus = (missionId: string, questId: string) => {
    const progressQuest = inProgressQuests.find((q) => q.quest_id === questId);
    if (!progressQuest) return "waiting";

    if (progressQuest.completed_missions.includes(missionId))
      return "completed";
    if (missionId === progressQuest.current_mission) return "current";
    return "waiting";
  };

  const { progress, total } = getQuestProgress(quest?.quest_id || "");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {quest?.title}
          </DialogTitle>
        </DialogHeader>

        {/* 진행률 표시 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">진행률</span>
            <span className="text-sm font-bold text-blue-600">
              {progress}/{total} 완료
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(progress / total) * 100}%` }}
            ></div>
          </div>
        </div>

        <DialogDescription className="text-gray-600 mb-4">
          {quest?.description}
        </DialogDescription>

        <div className="flex flex-col gap-4">
          {/* NPC 정보 */}
          {quest?.npc_image_url && (
            <Image
              src={quest.npc_image_url}
              alt={quest.npc_name || ""}
              width={100}
              height={100}
              className="w-full rounded-lg"
            />
          )}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg">👤 NPC</span>
                <span className="text-blue-600">{quest?.npc_name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 italic">
              &ldquo;{quest?.npc_dialogue}&rdquo;
            </CardContent>
          </Card>

          <div
            className="w-full h-64 bg-gray-50 rounded-lg overflow-hidden border"
            style={{
              position: "relative",
              minHeight: "256px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <NaverMap
              center={(() => {
                if (!quest?.missions || quest.missions.length === 0) {
                  return { lat: 37.5665, lng: 126.978 }; // 서울 시청 (기본값)
                }

                // 모든 미션의 좌표 평균 계산
                const totalLat = quest.missions.reduce(
                  (sum, mission) => sum + mission.coordinates.lat,
                  0
                );
                const totalLng = quest.missions.reduce(
                  (sum, mission) => sum + mission.coordinates.lng,
                  0
                );

                return {
                  lat: totalLat / quest.missions.length,
                  lng: totalLng / quest.missions.length,
                };
              })()}
              zoom={12}
              className="w-full h-full"
              markers={quest?.missions.map((mission) => ({
                position: mission.coordinates,
                title: mission.place_name,
                order: mission.order,
              }))}
            />
          </div>

          {/* 미션 목록 */}
          <div>
            <h3 className="text-xl mb-2 font-semibold">📋 미션 목록</h3>
            <div>
              <div className="space-y-3">
                {quest?.missions.map((missionItem) => {
                  const status = getMissionStatus(
                    missionItem.mission_id,
                    quest.quest_id
                  );
                  return (
                    <div
                      key={missionItem.mission_id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      {/* 미션 정보 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {status === "completed" && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                          {status === "current" && (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">●</span>
                            </div>
                          )}
                          {status === "waiting" && (
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 text-xs">○</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">
                              {missionItem.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              #{missionItem.order}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {missionItem.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>📍 {missionItem.place_name}</span>
                          <span>⏱️ {missionItem.type}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <Button onClick={onRewardClick}>🏆 보상 받기</Button>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RewardModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-yellow-600">
            🎉 축하합니다!
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-8">
          <div className="w-32 h-32">
            <TrophyLottie />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              퀘스트 완료!
            </h3>
            <p className="text-gray-600">
              정말 대단합니다! <br />
              새로운 모험을 시작해보세요.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function Home() {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  const handleQuestClick = (quest: Quest | null) => {
    if (quest) {
      setSelectedQuest(quest);
      setIsQuestModalOpen(true);
    }
  };

  return (
    <>
      <Header title="My Tour App" />
      <main className="mx-6 pb-24 pt-6">
        <div className="flex items-center gap-2">
          <Input placeholder="Search..." className="rounded-full h-12" />
          <Button className="h-12">Search</Button>
        </div>

        <div className="mt-6 mb-12 rounded-lg">
          <h2 className="text-xl font-bold text-center mb-4">
            진행 중인 퀘스트
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {inProgressQuests.map((quest) => (
              <Card
                key={quest.quest_id}
                onClick={() => {
                  handleQuestClick(
                    quests.find((q) => q.quest_id === quest.quest_id) || null
                  );
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <p className="w-[80%]">
                      {quests.find((q) => q.quest_id === quest.quest_id)?.title}
                    </p>
                    <p className="w-[20%] text-sm text-gray-500">
                      ({quest.progress} / {quest.total})
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold">
                      {quests
                        .flatMap((q) => q.missions)
                        .find((m) => m.mission_id === quest.mission_id)
                        ?.title || "미션 정보 없음"}
                    </p>
                    <p className="text-sm">
                      {quests
                        .flatMap((q) => q.missions)
                        .find((m) => m.mission_id === quest.mission_id)
                        ?.condition || "조건 정보 없음"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button className="w-full h-12">더보기</Button>
          </div>
        </div>

        <div className="mt-6 mb-12 rounded-lg">
          <h2 className="text-xl font-bold text-center mb-4">추천 퀘스트</h2>
          <ScrollArea className="w-full max-w-2xl">
            <div className="flex w-max space-x-4">
              {quests.map((quest) => (
                <Card key={quest.quest_id} className="w-56 h-56 relative">
                  <CardHeader>
                    <CardTitle className="text-center">{quest.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="text-sm text-gray-500 overflow-hidden">
                        {quest.description}
                      </p>
                      <Button className="w-44 absolute bottom-6">
                        수락하기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <Card className="mt-6 mb-6 p-4">
          <h2 className="text-xl font-bold text-center mb-4">배지 현황</h2>
          <ScrollArea className="w-full">
            <div className="flex gap-2 w-max">
              {badges.map((badge) => (
                <div
                  key={badge.badge_id}
                  className="rounded-full border-4 border-blue-500 w-20 h-20 p-2 bg-white"
                >
                  <Image
                    src={badge.image_url}
                    alt={badge.title}
                    width={100}
                    height={100}
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Card>

        <QuestModal
          isOpen={isQuestModalOpen}
          onClose={() => setIsQuestModalOpen(false)}
          quest={selectedQuest}
          onRewardClick={() => setIsRewardModalOpen(true)}
        />

        <RewardModal
          isOpen={isRewardModalOpen}
          onClose={() => setIsRewardModalOpen(false)}
        />
      </main>
    </>
  );
}
