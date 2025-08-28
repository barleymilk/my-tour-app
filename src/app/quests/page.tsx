"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mission, Quest } from "@/data";
import QuestModal from "@/components/QuestModal";
import MissionModal from "@/components/MissionModal";
import RewardModal from "@/components/RewardModal";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  status: string;
  progress: number;
  quests: {
    id: string;
    title: string;
    description: string;
    npc_name: string;
    npc_dialogue: string;
    estimated_time: string;
  };
}

interface UserMission {
  id: string;
  user_id: string;
  mission_id: string;
  status: string;
  missions: {
    id: string;
    quest_id: string;
    title: string;
    description: string;
    order: number;
    condition: string;
    type: string;
    difficulty: string;
    attraction_id: string;
    quiz_id: string;
    attractions: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    };
    quiz: {
      id: string;
      type: "multiple_choice" | "short_answer";
      question: string;
      options: string[];
      answer: string;
      hint: string;
      explanation: string;
    };
  };
}

interface RecommendedQuest {
  id: string;
  title: string;
  description: string;
  npc_name: string;
  npc_dialogue: string;
  estimated_time: string;
}

export default function QuestsPage() {
  const { user } = useAuth();
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  // 진행 중인 퀘스트 상태
  const [userQuests, setUserQuests] = useState<UserQuest[]>([]);
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);

  // 추천 퀘스트 상태
  const [recommendedQuests, setRecommendedQuests] = useState<
    RecommendedQuest[]
  >([]);

  // 퀴즈 관련 상태
  // const [selectedQuizMission, setSelectedQuizMission] =
  //   useState<UserMission | null>(null);
  // const [quizAnswer, setQuizAnswer] = useState("");
  // const [selectedOption, setSelectedOption] = useState("");

  // 추천 퀘스트 클릭 처리
  const handleRecommendedQuestClick = (recommendedQuest: RecommendedQuest) => {
    // 추천 퀘스트를 Quest 타입으로 변환
    const questData: Quest = {
      quest_id: recommendedQuest.id,
      title: recommendedQuest.title,
      description: recommendedQuest.description,
      npc_name: recommendedQuest.npc_name,
      npc_image_url: "", // 필요시 추가
      npc_dialogue: recommendedQuest.npc_dialogue,
      user_role: "", // 필요시 추가
      region: "", // 필요시 추가
      estimated_time: recommendedQuest.estimated_time,
      image_url: "", // 필요시 추가
      missions: [], // 추천 퀘스트는 아직 미션이 없음
    };

    setSelectedQuest(questData);
    setIsQuestModalOpen(true);
  };

  useEffect(() => {
    const getUserQuests = async () => {
      if (!user) return; // user가 null인 경우 early return

      // 1. 사용자의 퀘스트 조회
      const { data: userQuestsData, error: userQuestsError } = await supabase
        .from("user_quests")
        .select(
          `
          id,
          user_id,
          quest_id,
          status,
          progress,
          quests (
            id,
            title,
            description,
            npc_name,
            npc_dialogue,
            estimated_time
          )
          `
        )
        .eq("user_id", user.id);

      // console.log("🔍 user_quests 조회 결과:", {
      //   userQuestsData,
      //   userQuestsError,
      // });

      if (userQuestsError) {
        console.error("사용자 퀘스트 조회 실패:", userQuestsError);
      }

      // 2. 사용자의 미션 조회 (attractions, quiz 테이블과 조인)
      const { data: userMissionsData, error: userMissionsError } =
        await supabase
          .from("user_missions")
          .select(
            `
             id,
             user_id,
             mission_id,
             status,
             missions (
               id,
               quest_id,
               title,
               description,
               order,
               condition,
               type,
               difficulty,
               attraction_id,
               quiz_id,
               attractions (
                 id,
                 name,
                 latitude,
                 longitude
               ),
               quiz!quiz_id (
                 id,
                 type,
                 question,
                 options,
                 answer,
                 hint,
                 explanation
               )
             )
             `
          )
          .eq("user_id", user.id);

      // console.log("🔍 user_missions 조회 결과:", {
      //   userMissionsData,
      //   userMissionsError,
      // });

      if (userMissionsError) {
        console.error("사용자 미션 조회 실패:", userMissionsError);
      }

      // 3. 데이터 구조 분석
      if (userQuestsData) {
        // console.log("📋 사용자 퀘스트 데이터:", userQuestsData);
        setUserQuests(userQuestsData as unknown as UserQuest[]);
        // userQuestsData.forEach((userQuest, index) => {
        // console.log(`🎯 퀘스트 ${index + 1}:`, {
        //   id: userQuest.id,
        //   quest_id: userQuest.quest_id,
        //   status: userQuest.status,
        //   progress: userQuest.progress,
        //   quest: userQuest.quests,
        // });
        // });
      }

      if (userMissionsData) {
        // console.log("📋 사용자 미션 데이터:", userMissionsData);
        setUserMissions(userMissionsData as unknown as UserMission[]);
        // userMissionsData.forEach((userMission, index) => {
        //   console.log(`🎯 미션 ${index + 1}:`, {
        //     id: userMission.id,
        //     mission_id: userMission.mission_id,
        //     status: userMission.status,
        //     mission: userMission.missions,
        //   });
        // });
      }

      // 4. 추천 퀘스트 조회 (진행 중인 퀘스트 제외)
      const { data: allQuestsData, error: allQuestsError } = await supabase
        .from("quests")
        .select("*");

      if (allQuestsError) {
        console.error("전체 퀘스트 조회 실패:", allQuestsError);
      } else if (allQuestsData && userQuestsData) {
        // 진행 중인 퀘스트 ID 목록
        const inProgressQuestIds = userQuestsData.map((q) => q.quest_id);

        // 진행 중인 퀘스트를 제외한 추천 퀘스트
        const recommended = allQuestsData.filter(
          (quest) => !inProgressQuestIds.includes(quest.id)
        );

        // console.log("📋 추천 퀘스트 데이터:", recommended);
        setRecommendedQuests(recommended);
      }
    };

    getUserQuests();
  }, [user]);

  return (
    <>
      <Header title="My Tour App" />
      <main className="mx-6 pb-24 pt-6">
        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="in-progress">진행 중인 퀘스트</TabsTrigger>
            <TabsTrigger value="recommended">추천 퀘스트</TabsTrigger>
          </TabsList>

          {/* 진행 중인 퀘스트 탭 */}
          <TabsContent value="in-progress" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {userQuests && userQuests.length > 0 ? (
                userQuests.map((userQuest) => (
                  <Card
                    key={userQuest.id}
                    onClick={() => {
                      // 데이터베이스에서 가져온 퀘스트 데이터를 Quest 타입으로 변환
                      const questData: Quest = {
                        quest_id: userQuest.quest_id,
                        title: userQuest.quests?.title || "퀘스트 제목 없음",
                        description:
                          userQuest.quests?.description || "설명 없음",
                        npc_name: userQuest.quests?.npc_name || "NPC 없음",
                        npc_image_url: "", // 필요시 추가
                        npc_dialogue:
                          userQuest.quests?.npc_dialogue || "대화 내용 없음",
                        user_role: "", // 필요시 추가
                        region: "", // 필요시 추가
                        estimated_time:
                          userQuest.quests?.estimated_time || "미정",
                        image_url: "", // 필요시 추가
                        missions: userMissions
                          .filter(
                            (m) => m.missions.quest_id === userQuest.quest_id
                          )
                          .map((m) => ({
                            mission_id: m.missions.id,
                            title: m.missions.title,
                            description: m.missions.description,
                            place_id: m.missions.attraction_id || "",
                            place_name:
                              m.missions.attractions?.name || "장소명 없음",
                            coordinates: {
                              lat: m.missions.attractions?.latitude || 0,
                              lng: m.missions.attractions?.longitude || 0,
                            },
                            type: m.missions.type,
                            condition: m.missions.condition,
                            order: m.missions.order,
                            reward_badge_id: "", // 필요시 추가
                            completion: {
                              gps_required: true,
                              inputs: [],
                            },
                            difficulty: m.missions.difficulty as
                              | "easy"
                              | "medium"
                              | "hard",
                            estimated_duration: 0, // 필요시 추가
                            // 퀴즈 데이터 추가
                            quiz: m.missions.quiz
                              ? {
                                  id: m.missions.quiz.id,
                                  type: m.missions.quiz.type,
                                  question: m.missions.quiz.question,
                                  options: m.missions.quiz.options,
                                  answer: m.missions.quiz.answer,
                                  hint: m.missions.quiz.hint,
                                  explanation: m.missions.quiz.explanation,
                                }
                              : undefined,
                          })),
                      };

                      // 실제 데이터베이스 데이터를 selectedQuest에 설정
                      setSelectedQuest(questData);
                      setIsQuestModalOpen(true);
                    }}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <p className="w-[80%] text-lg truncate">
                          {userQuest.quests?.title || "퀘스트 제목 없음"}
                        </p>
                        <p className="w-[20%] text-sm text-gray-500 text-right">
                          {
                            userMissions.filter(
                              (m) =>
                                m.missions.quest_id === userQuest.quest_id &&
                                m.status === "completed"
                            ).length
                          }{" "}
                          /{" "}
                          {
                            userMissions.filter(
                              (m) => m.missions.quest_id === userQuest.quest_id
                            ).length
                          }
                        </p>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        {/* 진행 중인 미션 중 순서가 앞선 미션 */}
                        <p className="text-md font-bold">
                          {userMissions
                            .filter(
                              (m) =>
                                m.missions.quest_id === userQuest.quest_id &&
                                m.status === "active"
                            )
                            .sort(
                              (a, b) => a.missions.order - b.missions.order
                            )[0]?.missions?.title || "진행 중인 미션 없음"}
                        </p>
                        <p className="text-sm text-gray-500 pt-2">
                          {userMissions
                            .filter(
                              (m) =>
                                m.missions.quest_id === userQuest.quest_id &&
                                m.status === "active"
                            )
                            .sort(
                              (a, b) => a.missions.order - b.missions.order
                            )[0]?.missions?.condition || "미션 설명 없음"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg font-medium">
                    진행 중인 퀘스트가 없습니다
                  </p>
                  <p className="text-sm">새로운 퀘스트를 시작해보세요!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 추천 퀘스트 탭 */}
          <TabsContent value="recommended" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {recommendedQuests && recommendedQuests.length > 0 ? (
                recommendedQuests.map((quest) => (
                  <Card
                    key={quest.id}
                    onClick={() => handleRecommendedQuestClick(quest)}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{quest.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                          {quest.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>👤 {quest.npc_name}</span>
                          <span>⏱️ {quest.estimated_time}</span>
                        </div>
                        <Button className="w-full mt-3">퀘스트 시작하기</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg font-medium">
                    추천할 퀘스트가 없습니다
                  </p>
                  <p className="text-sm">모든 퀘스트를 진행 중입니다!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* <div className="mt-6 mb-16 rounded-lg">
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
        </div> */}

        <QuestModal
          isOpen={isQuestModalOpen}
          onClose={() => setIsQuestModalOpen(false)}
          quest={selectedQuest}
          onRewardClick={() => {
            setIsRewardModalOpen(true);
            // QuestModal은 열린 상태로 유지
          }}
          onMissionClick={(mission) => {
            // 해당 미션의 user_missions 상태 확인
            const userMission = userMissions.find(
              (m) => m.missions.id === mission.mission_id
            );

            // 미션이 완료된 경우 모달을 열지 않음
            if (userMission?.status === "completed") {
              // console.log("이미 완료된 미션입니다:", mission.title);
              return;
            }

            setSelectedMission(mission);
            setIsMissionModalOpen(true);
          }}
          userMissions={userMissions}
        />

        <MissionModal
          isOpen={isMissionModalOpen}
          onClose={() => {
            // console.log("MissionModal 닫기 - QuestModal 상태 유지");
            setIsMissionModalOpen(false);
            setIsQuestModalOpen(true);
            // QuestModal은 열린 상태로 유지
          }}
          mission={selectedMission}
          onMissionComplete={async () => {
            // 여기에 미션 완료 로직 추가
          }}
          onMissionStatusUpdate={async (missionId, status) => {
            // console.log("미션 상태 업데이트:", { missionId, status });

            try {
              // Supabase에서 user_missions 테이블 업데이트
              const { error } = await supabase
                .from("user_missions")
                .update({ status: status })
                .eq("mission_id", missionId)
                .eq("user_id", user?.id);

              if (error) {
                console.error("미션 상태 업데이트 실패:", error);
                throw error;
              }

              // 로컬 상태 업데이트
              setUserMissions((prev) =>
                prev.map((m) =>
                  m.missions.id === missionId ? { ...m, status: status } : m
                )
              );

              // console.log("미션 상태 업데이트 성공:", { missionId, status });
            } catch (error) {
              console.error("미션 상태 업데이트 중 오류:", error);
              throw error;
            }
          }}
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
