"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import QuestModal from "@/components/QuestModal";
import RewardModal from "@/components/RewardModal";
import MissionModal from "@/components/MissionModal";
import { Quest, Mission, quests, inProgressQuests } from "@/data";
import Navigation from "@/components/Navigation";
import { getPhotoPath } from "@/hooks/useSupabase";
import { User } from "./profile/page";
import { UserBadge } from "./profile/page";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
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
            {userBadges.length > 0 ? (
              <div className="flex w-max space-x-4">
                {userBadges.map((userBadge) => {
                  const badge = userBadge.badges;

                  if (!badge) return null;

                  return (
                    <div
                      key={userBadge.id}
                      className="text-center p-3 border rounded-lg w-30"
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
                      <p className="font-semibold text-sm truncate">
                        {badge.title}
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
