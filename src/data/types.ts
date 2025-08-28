export type Quest = {
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

// 미션 타입 정의
export type MissionType =
  | "GPS_AND_PHOTO" // GPS + 사진 촬영
  | "GPS_AND_AUDIO" // GPS + 음성 녹음
  | "GPS_AND_TEXT" // GPS + 텍스트 입력
  | "GPS_AND_PURCHASE" // GPS + 구매 인증
  | "GPS_AND_QUIZ" // GPS + 퀴즈 풀기
  | "GPS_AND_TIME" // GPS + 시간 체류
  | "GPS_AND_ACTION" // GPS + 특정 행동
  | "GPS_AND_MULTIPLE"; // GPS + 복합 조건

// 입력 타입 정의
export type InputType =
  | "text" // 텍스트 입력
  | "number" // 숫자 입력
  | "photo" // 사진 촬영
  | "audio" // 음성 녹음
  | "purchase" // 구매 인증
  | "quiz" // 퀴즈 풀기
  | "time" // 시간 체류
  | "multiple_choice"; // 객관식 선택

// 퀴즈 문제 타입
export type QuizQuestion = {
  type: "multiple_choice" | "text" | "number";
  question: string;
  options?: string[]; // 객관식인 경우
  correct_answer: string | number;
  hint?: string;
  explanation?: string;
};

// 입력 조건 타입
export type InputCondition = {
  type: InputType;
  required: boolean;
  min_length?: number; // 텍스트 최소 길이
  max_length?: number; // 텍스트 최대 길이
  min_value?: number; // 숫자 최소값
  max_value?: number; // 숫자 최대값
  min_duration?: number; // 음성/시간 최소 길이 (초)
  max_duration?: number; // 음성/시간 최대 길이 (초)
  file_types?: string[]; // 허용 파일 타입 (사진/음성)
  max_file_size?: number; // 최대 파일 크기 (MB)
  quiz?: QuizQuestion; // 퀴즈인 경우
  purchase_min_amount?: number; // 최소 구매 금액
  purchase_categories?: string[]; // 구매 카테고리
  hint?: string; // 사용자에게 보여줄 힌트
};

// 미션 달성 조건 타입
export type MissionCompletion = {
  gps_required: boolean; // GPS 위치 확인 필요 여부
  min_stay_time?: number; // 최소 체류 시간 (분)
  inputs: InputCondition[]; // 필요한 입력들
  additional_conditions?: string[]; // 추가 조건들
};

// 친구 관련 타입들
export type FriendStatus = "pending" | "accepted" | "blocked";

export type Friend = {
  friend_id: string;
  user_id: string;
  friend_user_id: string;
  friend_username: string;
  friend_avatar_url?: string;
  friend_level: number;
  status: FriendStatus;
  created_at: string;
  updated_at: string;
};

export type FriendRequest = {
  request_id: string;
  from_user_id: string;
  to_user_id: string;
  from_username: string;
  from_avatar_url?: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
};

export type SharedQuest = {
  shared_quest_id: string;
  quest_id: string;
  quest_title: string;
  shared_by_user_id: string;
  shared_with_user_id: string;
  status: "active" | "completed" | "abandoned";
  progress: number; // 0-100
  created_at: string;
  completed_at?: string;
};

export type ChatMessage = {
  message_id: string;
  chat_room_id: string;
  sender_id: string;
  sender_username: string;
  sender_avatar_url?: string;
  content: string;
  message_type: "text" | "image" | "location" | "quest_invite";
  metadata?: {
    image_url?: string;
    location?: { lat: number; lng: number; place_name?: string };
    quest_id?: string;
  };
  created_at: string;
  read_at?: string;
};

export type ChatRoom = {
  chat_room_id: string;
  participants: string[]; // user_id 배열
  last_message?: ChatMessage;
  unread_count: number;
  created_at: string;
  updated_at: string;
};

export type Mission = {
  mission_id: string;
  title: string;
  description: string;
  place_id: string;
  place_name: string;
  coordinates: { lat: number; lng: number };
  type: MissionType;
  condition: string; // 사용자에게 보여줄 조건 설명
  order: number;
  reward_badge_id: string;
  completion: MissionCompletion; // 미션 달성 조건
  difficulty: "easy" | "medium" | "hard"; // 난이도
  estimated_duration: number; // 예상 소요 시간 (분)
  tips?: string[]; // 미션 완료 팁
};

export type InProgressQuest = {
  quest_id: string;
  mission_id: string;
  progress: number;
  total: number;
  completed_missions: string[];
  current_mission: string;
};

export type Badge = {
  badge_id: string;
  title: string;
  description: string;
  image_url: string;
};
