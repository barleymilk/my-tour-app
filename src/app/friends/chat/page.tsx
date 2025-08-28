"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { chatRooms, friends, getMessagesByChatRoom } from "@/data/friends";
import { ChatRoom } from "@/data/types";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";

export default function ChatPage() {
  const [selectedChatRoom, setSelectedChatRoom] = useState<ChatRoom | null>(
    null
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredChatRooms = chatRooms.filter((room) => {
    if (!searchQuery) return true;
    const friend = friends.find(
      (f) =>
        room.participants.includes(f.friend_user_id) &&
        f.friend_user_id !== "USER-001"
    );
    return friend?.friend_username
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const getMessagesByChatRoomCallback = useCallback(
    (chatRoomId: string) => getMessagesByChatRoom(chatRoomId),
    []
  );

  const currentMessages = useMemo(() => {
    return selectedChatRoom
      ? getMessagesByChatRoomCallback(selectedChatRoom.chat_room_id)
      : [];
  }, [selectedChatRoom, getMessagesByChatRoomCallback]);

  const getFriendFromChatRoom = useCallback((chatRoom: ChatRoom) => {
    return friends.find(
      (friend) =>
        chatRoom.participants.includes(friend.friend_user_id) &&
        friend.friend_user_id !== "USER-001"
    );
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, scrollToBottom]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChatRoom) return;

    // 새 메시지 전송 로직
    // console.log("메시지 전송:", newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <>
      <Header title="My Tour App" />
      <main>
        <div className="flex">
          {/* 채팅방 목록 사이드바 */}
          {!selectedChatRoom ? (
            <div className="w-full p-6 flex flex-col">
              <Input
                placeholder="친구 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white "
              />

              <div className="flex-1 overflow-y-auto">
                {filteredChatRooms.map((chatRoom) => {
                  const friend = getFriendFromChatRoom(chatRoom);
                  const isSelected =
                    selectedChatRoom &&
                    (selectedChatRoom as ChatRoom).chat_room_id ===
                      chatRoom.chat_room_id;

                  return (
                    <div
                      key={chatRoom.chat_room_id}
                      className={`py-4 cursor-pointer border-b border-gray-100 ${
                        isSelected ? "bg-blue-50 border-blue-200" : ""
                      }`}
                      onClick={() => setSelectedChatRoom(chatRoom)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={friend?.friend_avatar_url} />
                            <AvatarFallback>
                              {friend?.friend_username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {chatRoom.unread_count > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                              {chatRoom.unread_count}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">
                              {friend?.friend_username}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {chatRoom.last_message
                                ? formatTime(chatRoom.last_message.created_at)
                                : formatTime(chatRoom.updated_at)}
                            </span>
                          </div>
                          {chatRoom.last_message && (
                            <p className="text-sm text-gray-600 truncate">
                              {chatRoom.last_message.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <></>
          )}

          {/* 채팅 메인 영역 */}
          <div className="flex-1 flex flex-col">
            {selectedChatRoom && (
              <>
                {/* 채팅 헤더 */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* 뒤로가기 버튼 추가 */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedChatRoom(null)}
                        className="p-2 h-8 w-8"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            getFriendFromChatRoom(selectedChatRoom)
                              ?.friend_avatar_url
                          }
                        />
                        <AvatarFallback>
                          {getFriendFromChatRoom(
                            selectedChatRoom
                          )?.friend_username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-semibold">
                          {
                            getFriendFromChatRoom(selectedChatRoom)
                              ?.friend_username
                          }
                        </h2>
                        <p className="text-sm text-gray-600">온라인</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        🎯 퀘스트 공유
                      </Button>
                      <Button variant="outline" size="sm">
                        📍 위치 공유
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {currentMessages.map((message) => {
                    const isMyMessage = message.sender_id === "USER-001";
                    const friend = getFriendFromChatRoom(selectedChatRoom);

                    return (
                      <div
                        key={message.message_id}
                        className={`flex ${
                          isMyMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                            isMyMessage
                              ? "flex-row-reverse space-x-reverse"
                              : ""
                          }`}
                        >
                          {!isMyMessage && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={friend?.friend_avatar_url} />
                              <AvatarFallback>
                                {friend?.friend_username.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              isMyMessage
                                ? "bg-blue-500 text-white"
                                : "bg-white border border-gray-200"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isMyMessage ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* 메시지 입력 */}
                {/* <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white"> */}
                <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 border-t border-gray-200 bg-white">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="메시지를 입력하세요..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      전송
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {!selectedChatRoom && <Navigation />}
      </main>
    </>
  );
}
