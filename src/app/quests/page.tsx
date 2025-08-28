"use client";
import Header from "@/components/Header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { inProgressQuests, quests, Mission, Quest } from "@/data";
import QuestModal from "@/components/QuestModal";
import MissionModal from "@/components/MissionModal";
import RewardModal from "@/components/RewardModal";
import { useState } from "react";
import Navigation from "@/components/Navigation";

export default function QuestsPage() {
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  const handleQuestClick = (quest: Quest | null) => {
    setSelectedQuest(quest);
    setIsQuestModalOpen(true);
  };

  return (
    <>
      <Header title="My Tour App" />
      <main className="mx-6 pb-24 pt-6">
        <div className="mb-16 rounded-lg">
          <h2 className="text-xl font-bold text-center mb-4">
            진행 중인 퀘스트
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
          </div>
        </div>

        <div className="mt-6 mb-16 rounded-lg">
          <h2 className="text-xl font-bold text-center mb-4">추천 퀘스트</h2>
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
      </main>
      <Navigation />
    </>
  );
}
