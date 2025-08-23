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

type Quest = {
  quest_id: string;
  title: string;
  description: string;
  npc_name: string;
  npc_image_url: string;
  npc_dialogue: string;
  user_role: string;
  region: string;
  estimated_time: string;
  image_url: string;
  missions: Mission[];
};

type Mission = {
  mission_id: string;
  title: string;
  description: string;
  place_id: string;
  place_name: string;
  coordinates: { lat: number; lng: number };
  type: string;
  condition: string;
  order: number;
  reward_badge_id: string;
};

const quests = [
  {
    quest_id: "QR-GNG-001",
    title: "바람의 기억을 걷는 자",
    description:
      "박노인의 잃어버린 기억 조각을 찾아 강릉의 숨겨진 이야기를 발견하는 여정입니다.",
    npc_name: "박노인",
    npc_image_url: "/images/npc/oldman.png",
    npc_dialogue:
      "젊은이, 이 바닷가에는 바람이 전하는 수많은 이야기가 숨어 있다네. 내게는 이제 힘이 없어. 자네가 대신 내 기억의 조각들을 찾아다녀 주지 않겠나?",
    user_role: "일상에 지친 도시 여행가",
    region: "강릉",
    estimated_time: "5시간",
    image_url: "https://example.com/images/gangneung_quest_main.jpg",
    missions: [
      {
        mission_id: "MR-GNG-001-01",
        title: "바람의 시작, 첫 조각을 찾아서",
        description:
          "박노인에게 가장 평온했던 순간의 기억을 찾아 경포 해변의 파도 소리를 기록해 주세요.",
        place_id: "PL-GNG-001",
        place_name: "경포 해변",
        coordinates: { lat: 37.8045, lng: 128.8963 },
        type: "GPS_and_Action",
        condition: "경포 해변에서 1시간 이상 머문 후, 파도 소리 15초 녹음",
        order: 1,
        reward_badge_id: "BDG-001",
      },
      {
        mission_id: "MR-GNG-001-02",
        title: "향기 속의 추억",
        description:
          "박노인이 사랑하는 사람과 처음 만난 안목해변에서 따스한 커피 향기를 그에게 전해주세요.",
        place_id: "PL-GNG-002",
        place_name: "안목해변 커피거리",
        coordinates: { lat: 37.7892, lng: 128.8956 },
        type: "GPS_and_Action",
        condition:
          "안목해변 커피거리에서 30분 이상 머문 후, 카페에서 음료 주문하기",
        order: 2,
        reward_badge_id: "BDG-002",
      },
      {
        mission_id: "MR-GNG-001-03",
        title: "잃어버린 맛의 지도",
        description:
          "활기찬 시장에서 사라져가는 정을 느껴보고 그에게 알려주세요. 시장의 맛을 경험하는 것이 중요합니다.",
        place_id: "PL-GNG-003",
        place_name: "강릉중앙시장",
        coordinates: { lat: 37.7519, lng: 128.8765 },
        type: "GPS_and_Action",
        condition: "강릉중앙시장에서 1시간 이상 머문 후, 5,000원 이상 지출",
        order: 3,
        reward_badge_id: "BDG-003",
      },
    ],
  },
  {
    quest_id: "QR-JNJ-001",
    title: "시간의 서신을 전하는 자",
    description:
      "과거로부터 온 편지를 전달하며 전주의 역사와 문화를 직접 체험하는 시간 여행입니다.",
    npc_name: "김한지",
    npc_image_url: "/images/npc/letter.png",
    npc_dialogue:
      "나를 믿어주는 사람이 사라졌어요. 과거의 사람들이 남긴 이 아름다운 '시간의 편지'를, 미래에서 온 당신이 완성해주실 수 있나요?",
    user_role: "도시의 답답함을 벗어난 탐험가",
    region: "전주",
    estimated_time: "4시간",
    image_url: "https://example.com/images/jeonju_quest_main.jpg",
    missions: [
      {
        mission_id: "MR-JNJ-001-01",
        title: "편지의 첫 페이지, 한복",
        description:
          "과거의 서신은 한복을 입은 사람에게만 전달됩니다. 그들과 같은 옷을 입고 이 마을의 기운을 느껴보세요.",
        place_id: "PL-JNJ-001",
        place_name: "전주 한옥마을",
        coordinates: { lat: 35.815, lng: 127.153 },
        type: "GPS_and_Action",
        condition: "한복 대여 후 한복 착용 인증 사진 업로드",
        order: 1,
        reward_badge_id: "BDG-004",
      },
      {
        mission_id: "MR-JNJ-001-02",
        title: "글귀를 담는 한지",
        description:
          "이 편지는 특별한 한지에만 쓸 수 있어요. 당신이 직접 한지를 만들고 그 편지에 당신의 마음을 담아주세요.",
        place_id: "PL-JNJ-002",
        place_name: "전주 한지박물관",
        coordinates: { lat: 35.812, lng: 127.15 },
        type: "GPS_and_Action",
        condition: "한지 공예품 만들기 체험 후 인증",
        order: 2,
        reward_badge_id: "BDG-005",
      },
      {
        mission_id: "MR-JNJ-001-03",
        title: "편지의 완성, 등불",
        description:
          "마지막으로, 당신의 편지를 밤하늘을 밝힐 등불에 띄워 보내야 해요. 밤이 되면 마을의 빛이 될 거예요.",
        place_id: "PL-JNJ-003",
        place_name: "전주 한옥마을",
        coordinates: { lat: 35.815, lng: 127.153 },
        type: "GPS_and_Action",
        condition: "한지 등불 들고 야간 산책 후 인증",
        order: 3,
        reward_badge_id: "BDG-006",
      },
    ],
  },
  {
    quest_id: "QR-JEJ-001",
    title: "섬을 담는 예술가",
    description:
      "바다를 그리는 할머니의 부탁으로 제주의 풍경을 사진에 담으며 잊혀진 예술의 조각을 완성하는 여정입니다.",
    npc_name: "김해녀",
    npc_image_url: "/images/npc/artist.png",
    npc_dialogue:
      "우리 섬의 아름다움은 끝이 없지. 허나 내 눈은 흐려지고 손은 떨려. 젊은이가 대신 이 아름다운 풍경을 담아다 주지 않겠나?",
    user_role: "일상 속 영감을 찾는 예술가",
    region: "제주",
    estimated_time: "7시간",
    image_url: "https://example.com/images/jeju_quest_main.jpg",
    missions: [
      {
        mission_id: "MR-JEJ-001-01",
        title: "빛과 바람의 그림",
        description:
          "섭지코지에서 바다와 성산일출봉이 어우러진 풍경을 카메라에 담아 할머니께 보내주세요.",
        place_id: "PL-JEJ-001",
        place_name: "섭지코지",
        coordinates: { lat: 33.4584, lng: 126.942 },
        type: "GPS_and_Photo",
        condition: "섭지코지에서 1시간 이상 머문 후, 특정 구도에서 사진 촬영",
        order: 1,
        reward_badge_id: "BDG-007",
      },
      {
        mission_id: "MR-JEJ-001-02",
        title: "시간이 빚은 돌의 노래",
        description:
          "돌하르방이 지키고 선 비자림 숲길을 걸으며 고요한 숲의 소리를 녹음해 주세요.",
        place_id: "PL-JEJ-002",
        place_name: "비자림",
        coordinates: { lat: 33.3867, lng: 126.7994 },
        type: "GPS_and_Action",
        condition: "비자림에서 2시간 이상 머문 후, 숲의 소리 30초 녹음",
        order: 2,
        reward_badge_id: "BDG-008",
      },
      {
        mission_id: "MR-JEJ-001-03",
        title: "예술의 영감을 찾아서",
        description:
          "서귀포 이중섭거리에서 화가의 숨결을 느끼고, 거리의 화가에게 그림 한 점을 구매해 주세요.",
        place_id: "PL-JEJ-003",
        place_name: "서귀포 이중섭거리",
        coordinates: { lat: 33.2496, lng: 126.56 },
        type: "GPS_and_Purchase",
        condition: "이중섭거리에서 1시간 이상 머문 후, 예술 작품 1점 구매",
        order: 3,
        reward_badge_id: "BDG-009",
      },
    ],
  },
  {
    quest_id: "QR-GYJ-001",
    title: "천년의 숨결을 쫓는 자",
    description:
      "신라의 비밀을 간직한 노학자의 지도를 따라 경주의 유적들을 탐험하며 잃어버린 '천년의 서판'을 찾는 여정입니다.",
    npc_name: "최경주",
    npc_image_url: "/images/npc/historian.png",
    npc_dialogue:
      "이 지도는 단순한 지도가 아니네. 천년 전 신라의 비밀이 숨겨져 있지. 자네가 이 비밀을 풀어내어 서판을 찾아주게나.",
    user_role: "역사 속 수수께끼를 푸는 탐험가",
    region: "경주",
    estimated_time: "6시간",
    image_url: "https://example.com/images/gyeongju_quest_main.jpg",
    missions: [
      {
        mission_id: "MR-GYJ-001-01",
        title: "비밀의 열쇠, 석굴암",
        description:
          "석굴암의 고요한 불상 앞에서 첫 번째 수수께끼를 찾아내세요.",
        place_id: "PL-GYJ-001",
        place_name: "석굴암",
        coordinates: { lat: 35.79, lng: 129.332 },
        type: "GPS_and_Action",
        condition: "석굴암 앞에서 지정된 퀴즈 정답 맞추기",
        order: 1,
        reward_badge_id: "BDG-010",
      },
      {
        mission_id: "MR-GYJ-001-02",
        title: "밤을 밝히는 등불",
        description:
          "동궁과 월지 연못에 비치는 달빛을 보며 두 번째 단서를 얻으세요.",
        place_id: "PL-GYJ-002",
        place_name: "동궁과 월지",
        coordinates: { lat: 35.834, lng: 129.219 },
        type: "GPS_and_Photo",
        condition: "동궁과 월지 야간 투어 참여 후, 아름다운 야경 사진 업로드",
        order: 2,
        reward_badge_id: "BDG-011",
      },
      {
        mission_id: "MR-GYJ-001-03",
        title: "천년의 종소리",
        description:
          "불국사의 범종 소리를 들으며 마지막 조각을 찾아 '천년의 서판'을 완성하세요.",
        place_id: "PL-GYJ-003",
        place_name: "불국사",
        coordinates: { lat: 35.79, lng: 129.332 },
        type: "GPS_and_Action",
        condition: "불국사에서 2시간 이상 머문 후, 종소리 녹음하기",
        order: 3,
        reward_badge_id: "BDG-012",
      },
    ],
  },
  {
    quest_id: "QR-BUS-001",
    title: "항구의 미로를 걷는 모험가",
    description:
      "부산의 복잡한 골목길에 숨겨진 비밀을 찾아 나서는 모험입니다. 이야기꾼의 단서를 따라 부산의 숨겨진 보물을 찾아보세요.",
    npc_name: "정구길",
    npc_image_url: "/images/npc/adventure.png",
    npc_dialogue:
      "이 골목길은 단순한 길이 아니야. 이야기가 숨겨져 있지. 내 단서를 따라가면 아주 특별한 보물을 찾을 수 있을 거야.",
    user_role: "도시의 미스터리를 해결하는 탐정",
    region: "부산",
    estimated_time: "5시간",
    image_url:
      "https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EC%98%A4%ED%81%B4%EB%9E%9C%EB%93%9C-%EB%B2%A0%EC%9D%B4-%EB%B8%8C%EB%A6%AC%EC%A7%80-%EC%83%8C%ED%94%84%EB%9E%80%EC%8B%9C%EC%8A%A4%EC%BD%94-%EB%82%AE-%EC%8B%9C%EA%B0%84-ZaMyD-31snk",
    missions: [
      {
        mission_id: "MR-BUS-001-01",
        title: "컬러풀한 첫 단서",
        description:
          "감천문화마을의 알록달록한 벽화 속에서 첫 번째 단서의 힌트를 찾아내세요.",
        place_id: "PL-BUS-001",
        place_name: "감천문화마을",
        coordinates: { lat: 35.098, lng: 129.01 },
        type: "GPS_and_Photo",
        condition:
          "감천문화마을에서 1시간 이상 머문 후, 지정된 벽화와 함께 사진 촬영",
        order: 1,
        reward_badge_id: "BDG-013",
      },
      {
        mission_id: "MR-BUS-001-02",
        title: "맛의 미로 속 비밀",
        description:
          "자갈치시장에서 부산의 싱싱한 해산물을 맛보며 숨겨진 두 번째 단서를 찾으세요.",
        place_id: "PL-BUS-002",
        place_name: "자갈치시장",
        coordinates: { lat: 35.098, lng: 129.025 },
        type: "GPS_and_Action",
        condition:
          "자갈치시장에서 1시간 이상 머문 후, 시장 음식점에서 2만 원 이상 지출",
        order: 2,
        reward_badge_id: "BDG-014",
      },
      {
        mission_id: "MR-BUS-001-03",
        title: "바다 위의 신비로운 섬",
        description:
          "태종대의 푸른 바다를 바라보며 마지막 단서를 해독하세요. 모든 퍼즐이 맞춰질 겁니다.",
        place_id: "PL-BUS-003",
        place_name: "태종대",
        coordinates: { lat: 35.058, lng: 129.02 },
        type: "GPS_and_Action",
        condition:
          "태종대에서 2시간 이상 머문 후, 절벽 풍경에 대한 감상평 작성",
        order: 3,
        reward_badge_id: "BDG-015",
      },
    ],
  },
];

const inProgressQuests = [
  {
    quest_id: "QR-BUS-001",
    mission_id: "MR-BUS-001-02",
    progress: 2, // 완료한 미션 수
    total: 3, // 전체 미션 수
    completed_missions: ["MR-BUS-001-01"], // 완료된 미션 ID들
    current_mission: "MR-BUS-001-02", // 현재 진행 중인 미션
  },
  {
    quest_id: "QR-GYJ-001",
    mission_id: "MR-GYJ-001-03",
    progress: 2, // 완료한 미션 수
    total: 3, // 전체 미션 수
    completed_missions: ["MR-GYJ-001-01"], // 완료된 미션 ID들
    current_mission: "MR-GYJ-001-03", // 현재 진행 중인 미션
  },
];

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

        <div className="mt-6 mb-6 bg-blue-500 rounded-lg">
          <h2 className="text-xl font-bold text-center mb-4">배지 현황</h2>
          <div>badge</div>
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
