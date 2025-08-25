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
import { Quest, quests, inProgressQuests, badges } from "@/data";

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

        <div className="mt-6 mb-16 rounded-lg">
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

        <div className="mt-6 mb-16 rounded-lg">
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

        <div className="mt-6 mb-6 bg-blue-500 rounded-lg p-6">
          <h2 className="text-xl font-bold text-center mb-4 text-white">
            배지 현황
          </h2>
          <ScrollArea className="w-full">
            <div className="flex gap-4 w-max">
              {badges.map((badge) => (
                <div
                  key={badge.badge_id}
                  className="rounded-full border-4 border-red-500 w-18 h-18 p-2 bg-white flex-shrink-0"
                >
                  <Image
                    src={badge.image_url}
                    alt={badge.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

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
