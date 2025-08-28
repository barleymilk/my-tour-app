"use client";

import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pin, MapPin, Star, Clock, Users } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function PlacesPage() {
  const places = [
    {
      id: 1,
      name: "남산타워",
      description: "서울의 상징적인 랜드마크",
      rating: 4.5,
      visitTime: "2-3시간",
      visitors: "많음",
      location: "용산구 남산공원길 105",
      image: "/api/placeholder/300/200",
    },
    {
      id: 2,
      name: "경복궁",
      description: "조선왕조의 정궁",
      rating: 4.7,
      visitTime: "3-4시간",
      visitors: "보통",
      location: "종로구 사직로 161",
      image: "/api/placeholder/300/200",
    },
    {
      id: 3,
      name: "홍대거리",
      description: "젊음의 문화가 살아있는 거리",
      rating: 4.3,
      visitTime: "2-4시간",
      visitors: "많음",
      location: "마포구 홍대로",
      image: "/api/placeholder/300/200",
    },
  ];

  return (
    <>
      <Header title="My Tour App" />
      <main className="mx-6 pb-24 pt-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📍 장소</h1>
          <p className="text-gray-600">방문할 장소를 찾고 계획을 세워보세요!</p>
        </div>

        {/* 검색 */}
        <div className="flex items-center gap-2 mb-6">
          <Input
            placeholder="장소 검색..."
            className="rounded-full h-12 bg-white"
          />
          <Button className="h-12">Search</Button>
        </div>

        {/* 장소 목록 */}
        <div className="space-y-4">
          {places.map((place) => (
            <Card key={place.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pin className="w-5 h-5 text-red-500" />
                  {place.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{place.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{place.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{place.visitTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{place.visitors}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{place.location}</span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm">🎯 퀘스트 보기</Button>
                  <Button variant="outline" size="sm">
                    📍 위치 보기
                  </Button>
                  <Button variant="outline" size="sm">
                    💬 리뷰
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 새 장소 추가 버튼 */}
        <div className="mt-8 text-center">
          <Button size="lg" className="px-8">
            📍 새 장소 추가하기
          </Button>
        </div>
      </main>
      <Navigation />
    </>
  );
}
