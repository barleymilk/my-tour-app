"use client";

import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import Image from "next/image";
import QuestModal from "@/components/QuestModal";
import RewardModal from "@/components/RewardModal";
import MissionModal from "@/components/MissionModal";
import { Quest, Mission, quests, inProgressQuests, badges } from "@/data";
import Navigation from "@/components/Navigation";

export default function Home() {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);

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
        <div className="mt-6 mb-16 rounded-lg">
          <h2 className="text-xl font-bold text-center mb-4">
            🎯 진행 중인 퀘스트
          </h2>
          <div className="grid grid-cols-1 gap-4">
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
            <Button
              className="w-full h-12"
              onClick={() => (window.location.href = "/quests")}
            >
              더보기
            </Button>
          </div>
        </div>

        <div className="mt-6 mb-16 rounded-lg">
          <h2 className="text-xl font-bold text-center mb-4">🎯 추천 퀘스트</h2>
          <ScrollArea className="w-full max-w-2xl">
            <div className="flex w-max space-x-4">
              {quests.map((quest) => (
                <Card
                  key={quest.quest_id}
                  className="w-56 h-56 relative"
                  onClick={() => {
                    handleQuestClick(quest);
                  }}
                >
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

        <div className="mt-6 mb-16 bg-white rounded-lg ">
          <h2 className="text-xl font-bold text-center mb-4 text-black">
            🏆 배지 현황
          </h2>
          <ScrollArea className="w-full">
            <div className="flex w-max space-x-4">
              {badges.map((badge) => (
                <div
                  key={badge.badge_id}
                  className="text-center p-3 border rounded-lg"
                >
                  <div className="text-3xl mb-2 w-18 h-18 flex items-center justify-center">
                    <Image
                      src={badge.image_url}
                      alt={badge.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="font-semibold text-sm">{badge.title}</p>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* 친구 기능 섹션 */}
        <div className="mt-6 mb-6 bg-white rounded-lg">
          <h2 className="text-xl font-bold text-center mb-4 text-black">
            👥 친구와 함께
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => (window.location.href = "/friends")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-center">
                  👥 친구 목록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">
                  친구를 추가하고 관리하세요
                </p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => (window.location.href = "/friends/shared-quests")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-center">
                  🎯 공유 퀘스트
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">
                  친구와 함께 퀘스트를 진행하세요
                </p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => (window.location.href = "/friends/chat")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-center">
                  💬 채팅
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">
                  친구와 소통하고 정보를 공유하세요
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <QuestModal
          isOpen={isQuestModalOpen}
          onClose={() => setIsQuestModalOpen(false)}
          quest={selectedQuest}
          onRewardClick={() => {
            setIsRewardModalOpen(true);
            // QuestModal은 열린 상태로 유지
          }}
          onMissionClick={(mission) => {
            setSelectedMission(mission);
            setIsMissionModalOpen(true);
          }}
        />

        <MissionModal
          isOpen={isMissionModalOpen}
          onClose={() => setIsMissionModalOpen(false)}
          mission={selectedMission}
        />

        <RewardModal
          isOpen={isRewardModalOpen}
          onClose={() => setIsRewardModalOpen(false)}
        />

        <Navigation />
      </main>
    </>
  );
}
