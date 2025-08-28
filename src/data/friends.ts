import {
  Friend,
  FriendRequest,
  SharedQuest,
  ChatMessage,
  ChatRoom,
} from "./types";

// 더미 친구 데이터
export const friends: Friend[] = [
  {
    friend_id: "FR-001",
    user_id: "USER-001", // 현재 사용자
    friend_user_id: "USER-002",
    friend_username: "김여행",
    friend_avatar_url: "/images/avatars/user2.jpg",
    friend_level: 15,
    status: "accepted",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    friend_id: "FR-002",
    user_id: "USER-001",
    friend_user_id: "USER-003",
    friend_username: "박탐험",
    friend_avatar_url: "/images/avatars/user3.jpg",
    friend_level: 8,
    status: "accepted",
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-10T14:30:00Z",
  },
  {
    friend_id: "FR-003",
    user_id: "USER-001",
    friend_user_id: "USER-004",
    friend_username: "이모험",
    friend_avatar_url: "/images/avatars/user4.jpg",
    friend_level: 22,
    status: "pending",
    created_at: "2024-01-20T09:15:00Z",
    updated_at: "2024-01-20T09:15:00Z",
  },
];

// 더미 친구 요청 데이터
export const friendRequests: FriendRequest[] = [
  {
    request_id: "REQ-001",
    from_user_id: "USER-005",
    to_user_id: "USER-001",
    from_username: "최여행러",
    from_avatar_url: "/images/avatars/user5.jpg",
    message: "함께 여행하고 싶어요!",
    status: "pending",
    created_at: "2024-01-22T16:45:00Z",
    updated_at: "2024-01-22T16:45:00Z",
  },
  {
    request_id: "REQ-002",
    from_user_id: "USER-006",
    to_user_id: "USER-001",
    from_username: "정탐험가",
    from_avatar_url: "/images/avatars/user6.jpg",
    message: "퀘스트 같이 깨요!",
    status: "pending",
    created_at: "2024-01-21T11:20:00Z",
    updated_at: "2024-01-21T11:20:00Z",
  },
];

// 더미 공유 퀘스트 데이터
export const sharedQuests: SharedQuest[] = [
  {
    shared_quest_id: "SQ-001",
    quest_id: "QR-GNG-001",
    quest_title: "바람의 기억을 걷는 자",
    shared_by_user_id: "USER-001",
    shared_with_user_id: "USER-002",
    status: "active",
    progress: 60,
    created_at: "2024-01-18T13:00:00Z",
  },
  {
    shared_quest_id: "SQ-002",
    quest_id: "QR-JNJ-001",
    quest_title: "시간의 서신을 전하는 자",
    shared_by_user_id: "USER-002",
    shared_with_user_id: "USER-001",
    status: "active",
    progress: 30,
    created_at: "2024-01-19T15:30:00Z",
  },
  {
    shared_quest_id: "SQ-003",
    quest_id: "QR-JEJ-001",
    quest_title: "섬을 담는 예술가",
    shared_by_user_id: "USER-001",
    shared_with_user_id: "USER-003",
    status: "completed",
    progress: 100,
    created_at: "2024-01-12T10:00:00Z",
    completed_at: "2024-01-15T18:00:00Z",
  },
];

// 더미 채팅방 데이터
export const chatRooms: ChatRoom[] = [
  {
    chat_room_id: "CHAT-001",
    participants: ["USER-001", "USER-002"],
    unread_count: 2,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-22T14:30:00Z",
  },
  {
    chat_room_id: "CHAT-002",
    participants: ["USER-001", "USER-003"],
    unread_count: 0,
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-20T09:15:00Z",
  },
];

// 더미 채팅 메시지 데이터
export const chatMessages: ChatMessage[] = [
  {
    message_id: "MSG-001",
    chat_room_id: "CHAT-001",
    sender_id: "USER-002",
    sender_username: "김여행",
    sender_avatar_url: "/images/avatars/user2.jpg",
    content: "안녕하세요! 퀘스트 같이 진행할까요?",
    message_type: "text",
    created_at: "2024-01-22T14:30:00Z",
  },
  {
    message_id: "MSG-002",
    chat_room_id: "CHAT-001",
    sender_id: "USER-001",
    sender_username: "나",
    sender_avatar_url: "/images/avatars/user1.jpg",
    content: "좋아요! 어떤 퀘스트를 진행하고 싶으세요?",
    message_type: "text",
    created_at: "2024-01-22T14:32:00Z",
  },
  {
    message_id: "MSG-003",
    chat_room_id: "CHAT-001",
    sender_id: "USER-002",
    sender_username: "김여행",
    sender_avatar_url: "/images/avatars/user2.jpg",
    content: "강릉 퀘스트 어떠세요? 경포 해변에서 파도 소리 녹음하는 거예요!",
    message_type: "text",
    created_at: "2024-01-22T14:35:00Z",
  },
  {
    message_id: "MSG-004",
    chat_room_id: "CHAT-002",
    sender_id: "USER-003",
    sender_username: "박탐험",
    sender_avatar_url: "/images/avatars/user3.jpg",
    content:
      "전주 한옥마을 퀘스트 완료했어요! 한복 입고 사진 찍는 거 재미있었어요 😊",
    message_type: "text",
    created_at: "2024-01-20T09:15:00Z",
  },
  {
    message_id: "MSG-005",
    chat_room_id: "CHAT-002",
    sender_id: "USER-001",
    sender_username: "나",
    sender_avatar_url: "/images/avatars/user1.jpg",
    content: "와! 축하해요! 다음에 같이 가요 🎉",
    message_type: "text",
    created_at: "2024-01-20T09:20:00Z",
  },
];

// 채팅방별 메시지 그룹화 함수
export const getMessagesByChatRoom = (chatRoomId: string): ChatMessage[] => {
  return chatMessages.filter((msg) => msg.chat_room_id === chatRoomId);
};

// 친구 검색 함수
export const searchUsers = (
  query: string
): Array<{
  user_id: string;
  username: string;
  avatar_url?: string;
  level: number;
  isFriend: boolean;
}> => {
  const allUsers = [
    {
      user_id: "USER-002",
      username: "김여행",
      avatar_url: "/images/avatars/user2.jpg",
      level: 15,
    },
    {
      user_id: "USER-003",
      username: "박탐험",
      avatar_url: "/images/avatars/user3.jpg",
      level: 8,
    },
    {
      user_id: "USER-004",
      username: "이모험",
      avatar_url: "/images/avatars/user4.jpg",
      level: 22,
    },
    {
      user_id: "USER-005",
      username: "최여행러",
      avatar_url: "/images/avatars/user5.jpg",
      level: 12,
    },
    {
      user_id: "USER-006",
      username: "정탐험가",
      avatar_url: "/images/avatars/user6.jpg",
      level: 18,
    },
    {
      user_id: "USER-007",
      username: "한여행자",
      avatar_url: "/images/avatars/user7.jpg",
      level: 5,
    },
    {
      user_id: "USER-008",
      username: "강모험가",
      avatar_url: "/images/avatars/user8.jpg",
      level: 25,
    },
  ];

  return allUsers
    .filter(
      (user) =>
        user.username.toLowerCase().includes(query.toLowerCase()) &&
        user.user_id !== "USER-001" // 현재 사용자 제외
    )
    .map((user) => ({
      ...user,
      isFriend: friends.some(
        (friend) =>
          friend.friend_user_id === user.user_id && friend.status === "accepted"
      ),
    }));
};
