"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { friends, friendRequests, searchUsers } from "@/data/friends";
import { Friend, FriendRequest } from "@/data/types";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    ReturnType<typeof searchUsers>
  >([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchResults(searchUsers(query));
    } else {
      setSearchResults([]);
    }
  };

  const handleAddFriend = (userId: string) => {
    // 친구 추가 로직
    console.log("친구 추가:", userId);
  };

  const handleAcceptRequest = (requestId: string) => {
    // 친구 요청 수락 로직
    console.log("친구 요청 수락:", requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    // 친구 요청 거절 로직
    console.log("친구 요청 거절:", requestId);
  };

  const handleRemoveFriend = (friendId: string) => {
    // 친구 삭제 로직
    console.log("친구 삭제:", friendId);
  };

  return (
    <>
      <Header title="My Tour App" />
      <main className="mx-6 pb-24 pt-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">👥 친구</h1>
            <p className="text-gray-600">
              친구와 함께 퀘스트를 진행하고 소통해보세요!
            </p>
          </div>

          <Tabs defaultValue="friends" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="friends">친구 목록</TabsTrigger>
              <TabsTrigger value="requests">친구 요청</TabsTrigger>
              <TabsTrigger value="add">친구 추가</TabsTrigger>
            </TabsList>

            {/* 친구 목록 탭 */}
            <TabsContent value="friends" className="space-y-4">
              <div className="grid gap-4">
                {friends.map((friend) => (
                  <Card
                    key={friend.friend_id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={friend.friend_avatar_url} />
                            <AvatarFallback>
                              {friend.friend_username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {friend.friend_username}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                레벨 {friend.friend_level}
                              </Badge>
                              <Badge
                                variant={
                                  friend.status === "accepted"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {friend.status === "accepted"
                                  ? "친구"
                                  : "대기중"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            💬
                          </Button>

                          {friend.status === "accepted" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleRemoveFriend(friend.friend_id)
                              }
                            >
                              삭제
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* 친구 요청 탭 */}
            <TabsContent value="requests" className="space-y-4">
              {friendRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    새로운 친구 요청이 없습니다.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {friendRequests.map((request) => (
                    <Card
                      key={request.request_id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={request.from_avatar_url} />
                              <AvatarFallback>
                                {request.from_username.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">
                                {request.from_username}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {request.message}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {new Date(
                                  request.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleAcceptRequest(request.request_id)
                              }
                            >
                              수락
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleRejectRequest(request.request_id)
                              }
                            >
                              거절
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* 친구 추가 탭 */}
            <TabsContent value="add" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="사용자 이름으로 검색..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="max-w-md"
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className="grid gap-4">
                    {searchResults.map((user) => (
                      <Card
                        key={user.user_id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar_url} />
                                <AvatarFallback>
                                  {user.username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {user.username}
                                </h3>
                                <Badge variant="outline">
                                  레벨 {user.level}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {user.isFriend ? (
                                <Badge variant="default">이미 친구</Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleAddFriend(user.user_id)}
                                >
                                  친구 추가
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      검색 결과가 없습니다.
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Navigation />
    </>
  );
}
