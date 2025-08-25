import { InProgressQuest } from "./types";

export const inProgressQuests: InProgressQuest[] = [
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
