"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NaverMap from "@/components/NaverMap";
import { Mission, Quest } from "@/data";

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  quest: Quest | null;
  onRewardClick: () => void;
  onMissionClick: (mission: Mission) => void;
  userMissions?: Array<{
    id: string;
    mission_id: string;
    status: string;
    missions: {
      id: string;
      quest_id: string;
    };
  }>;
}

const QuestModal = ({
  isOpen,
  onClose,
  quest,
  onRewardClick,
  onMissionClick,
  userMissions,
}: QuestModalProps) => {
  if (!isOpen) return null;

  // 진행률 계산 (userMissions 기반)
  const getQuestProgress = (questId: string) => {
    if (!userMissions || !quest?.missions) {
      return { progress: 0, total: 0 };
    }

    // 해당 퀘스트의 미션들만 필터링
    const questMissions = userMissions.filter(
      (m) => m.missions.quest_id === questId
    );

    // 완료된 미션 수 계산
    const completedCount = questMissions.filter(
      (m) => m.status === "completed"
    ).length;

    // 전체 미션 수
    const totalCount = quest.missions.length;

    return {
      progress: completedCount,
      total: totalCount,
    };
  };

  // 미션 상태 확인 (userMissions에서 가져오기)
  const getMissionStatus = (missionId: string) => {
    if (!userMissions) return "waiting";

    const userMission = userMissions.find((m) => m.missions.id === missionId);
    return userMission ? userMission.status : "waiting";
  };

  const { progress, total } = getQuestProgress(quest?.quest_id || "");

  // console.log("@@@@@@@@", quest?.npc_image_url);

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
          <Image
            src={quest?.npc_image_url || "/images/npc/adventure.png"}
            alt={quest?.npc_name || "NPC"}
            width={100}
            height={100}
            className="w-full rounded-lg"
            unoptimized
          />
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
              <div className="space-y-3 ">
                {quest?.missions
                  .sort((a, b) => a.order - b.order)
                  .map((missionItem) => {
                    const status = getMissionStatus(missionItem.mission_id);
                    // console.log(
                    //   "###missionItem",
                    //   missionItem,
                    //   "status:",
                    //   status
                    // );
                    return (
                      <div
                        key={missionItem.mission_id}
                        className="flex items-center gap-3 p-3 border rounded-lg bg-white cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          onMissionClick(missionItem);
                        }}
                      >
                        {/* 미션 상태 아이콘 */}
                        <div className="flex-shrink-0">
                          {status === "completed" && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                          {status === "active" && (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">●</span>
                            </div>
                          )}
                          {status === "waiting" && (
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 text-xs">○</span>
                            </div>
                          )}
                        </div>

                        {/* 미션 정보 */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">
                              {missionItem.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              #{missionItem.order}
                            </span>
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

export default QuestModal;
