"use client";

import { useEffect, useRef, useState } from "react";

interface NaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    order?: number;
    icon?: string;
  }>;
}

declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: MapOptions) => NaverMap;
        LatLng: new (lat: number, lng: number) => NaverLatLng;
        LatLngBounds: new () => NaverLatLngBounds;
        Marker: new (options: MarkerOptions) => NaverMarker;
        InfoWindow: new (options: InfoWindowOptions) => NaverInfoWindow;
        Polyline: new (options: PolylineOptions) => NaverPolyline;
        ZoomControlStyle: {
          SMALL: number;
          LARGE: number;
        };
        Position: {
          TOP_LEFT: number;
          TOP_CENTER: number;
          TOP_RIGHT: number;
          LEFT_TOP: number;
          LEFT_CENTER: number;
          LEFT_BOTTOM: number;
          RIGHT_TOP: number;
          RIGHT_CENTER: number;
          RIGHT_BOTTOM: number;
          BOTTOM_LEFT: number;
          BOTTOM_CENTER: number;
          BOTTOM_RIGHT: number;
        };
        Size: new (width: number, height: number) => NaverSize;
        Point: new (x: number, y: number) => NaverPoint;
        Event: {
          addListener: (
            target: NaverMap | NaverMarker,
            event: string,
            listener: (event: Event) => void
          ) => void;
          once: (
            target: NaverMap | NaverMarker,
            event: string,
            listener: (event: Event) => void
          ) => void;
        };
      };
    };
  }
}

// Naver Maps 타입 정의
interface MapOptions {
  center: NaverLatLng;
  zoom: number;
  mapTypeControl?: boolean;
  zoomControl?: boolean;
  zoomControlOptions?: {
    style: number;
    position: number;
  };
}

interface MarkerOptions {
  position: NaverLatLng;
  map: NaverMap;
  title?: string;
  icon?: {
    content: string;
    size: NaverSize;
    anchor: NaverPoint;
  };
}

interface InfoWindowOptions {
  content: string;
}

interface PolylineOptions {
  path: NaverLatLng[];
  strokeColor: string;
  strokeWeight: number;
  strokeOpacity: number;
  strokeStyle: string;
  map: NaverMap;
}

interface NaverMap {
  center: NaverLatLng;
  zoom: number;
  destroy(): void;
  refresh(): void;
  fitBounds(bounds: NaverLatLngBounds): void;
}

interface NaverLatLng {
  lat(): number;
  lng(): number;
}

interface NaverLatLngBounds {
  extend(latLng: NaverLatLng): void;
}

interface NaverMarker {
  getPosition(): NaverLatLng;
}

interface NaverInfoWindow {
  open(map: NaverMap, marker: NaverMarker): void;
  close(): void;
  getContent(): string;
  setContent(content: string): void;
}

interface NaverPolyline {
  getPath(): NaverLatLng[];
  setPath(path: NaverLatLng[]): void;
  getMap(): NaverMap | null;
  setMap(map: NaverMap | null): void;
}

interface NaverSize {
  width: number;
  height: number;
}

interface NaverPoint {
  x: number;
  y: number;
}

const NaverMap = ({
  center = { lat: 37.5665, lng: 126.978 }, // 서울 시청
  zoom = 15,
  className = "w-full h-[200px] rounded-lg",
  markers = [],
}: NaverMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<NaverMap | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // 네이버 지도 스크립트 로드
  const loadNaverMapScript = () => {
    if (window.naver) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      const checkNaverObject = () => {
        if (window.naver && window.naver.maps) {
          setIsScriptLoaded(true);
        } else {
          setTimeout(checkNaverObject, 100);
        }
      };
      checkNaverObject();
    };
    script.onerror = (error) => {
      console.error("네이버 지도 스크립트 로드 실패:", error);
    };
    document.head.appendChild(script);
  };

  useEffect(() => {
    loadNaverMapScript();
  }, []);

  useEffect(() => {
    if (
      !mapRef.current ||
      !isScriptLoaded ||
      !window.naver ||
      !window.naver.maps
    ) {
      return;
    }

    // 기존 지도 인스턴스가 있다면 정리
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      } catch (error) {
        console.error("기존 지도 정리 실패:", error);
      }
    }

    // 컨테이너 내용 정리
    if (mapRef.current) {
      mapRef.current.innerHTML = "";
    }

    // 마커들의 경계(bounds) 계산
    let mapCenter = new window.naver.maps.LatLng(center.lat, center.lng);
    let calculatedZoom = zoom;

    if (markers.length > 0) {
      // 마커들의 최소/최대 위도, 경도 계산
      const lats = markers.map((m) => m.position.lat);
      const lngs = markers.map((m) => m.position.lng);

      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      // 경계의 중앙점 계산
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      mapCenter = new window.naver.maps.LatLng(centerLat, centerLng);

      // 경계의 크기에 따른 적절한 zoom 레벨 계산
      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      const maxDiff = Math.max(latDiff, lngDiff);

      if (maxDiff > 20) calculatedZoom = 4;
      else if (maxDiff > 10) calculatedZoom = 5;
      else if (maxDiff > 5) calculatedZoom = 7;
      else if (maxDiff > 2) calculatedZoom = 9;
      else if (maxDiff > 1) calculatedZoom = 11;
      else if (maxDiff > 0.5) calculatedZoom = 13;
      else if (maxDiff > 0.1) calculatedZoom = 15;
      else calculatedZoom = 17;
    }

    // 지도 생성
    const map = new window.naver.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: calculatedZoom,
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: {
        style: window.naver.maps.ZoomControlStyle.SMALL,
        position: window.naver.maps.Position.RIGHT_CENTER,
      },
    });

    mapInstanceRef.current = map;

    // 마커들이 모두 보이도록 경계 적용
    if (markers.length > 0 && window.naver.maps.LatLngBounds) {
      try {
        setTimeout(() => {
          if (map && mapRef.current) {
            const bounds = new window.naver.maps.LatLngBounds();
            markers.forEach((markerData) => {
              bounds.extend(
                new window.naver.maps.LatLng(
                  markerData.position.lat,
                  markerData.position.lng
                )
              );
            });

            const lats = markers.map((m) => m.position.lat);
            const lngs = markers.map((m) => m.position.lng);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);
            const minLng = Math.min(...lngs);
            const maxLng = Math.max(...lngs);

            const latPadding = (maxLat - minLat) * 0.2;
            const lngPadding = (maxLng - minLng) * 0.2;

            bounds.extend(
              new window.naver.maps.LatLng(
                minLat - latPadding,
                minLng - lngPadding
              )
            );
            bounds.extend(
              new window.naver.maps.LatLng(
                maxLat + latPadding,
                maxLng + lngPadding
              )
            );

            map.fitBounds(bounds);
          }
        }, 500);
      } catch (error) {
        console.error("경계 적용 실패:", error);
      }
    }

    // 사용자 정의 마커 추가
    const markerInstances: NaverMarker[] = [];

    markers.forEach((markerData, index) => {
      const markerHtml = [
        '<div class="custom-marker">',
        '<div class="marker-circle">',
        '<span class="marker-number">' +
          (markerData.order || index + 1) +
          "</span>",
        "</div>",
        "</div>",
      ].join("");

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(
          markerData.position.lat,
          markerData.position.lng
        ),
        map: map,
        title: markerData.title || "",
        icon: {
          content: markerHtml,
          size: new window.naver.maps.Size(40, 40),
          anchor: new window.naver.maps.Point(20, 40),
        },
      });

      markerInstances.push(marker);

      // 마커 클릭 이벤트
      if (markerData.title) {
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<div style="padding: 10px; min-width: 150px;">
            <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">
              ${markerData.title}
            </h3>
          </div>`,
        });

        window.naver.maps.Event.addListener(marker, "click", () => {
          infoWindow.open(map, marker);
        });
      }
    });

    // 마커들을 순서대로 연결하는 선 그리기
    if (markerInstances.length > 1) {
      const sortedMarkers = [...markerInstances].sort((a, b) => {
        const aOrder =
          markers.find(
            (m) =>
              m.position.lat === a.getPosition().lat() &&
              m.position.lng === a.getPosition().lng()
          )?.order || 0;
        const bOrder =
          markers.find(
            (m) =>
              m.position.lat === b.getPosition().lat() &&
              m.position.lng === b.getPosition().lng()
          )?.order || 0;
        return aOrder - bOrder;
      });

      for (let i = 0; i < sortedMarkers.length - 1; i++) {
        const currentMarker = sortedMarkers[i];
        const nextMarker = sortedMarkers[i + 1];

        new window.naver.maps.Polyline({
          path: [currentMarker.getPosition(), nextMarker.getPosition()],
          strokeColor: "#3B82F6",
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeStyle: "solid",
          map: map,
        });
      }
    }

    // 지도 로드 완료 이벤트
    window.naver.maps.Event.once(map, "init", () => {
      setTimeout(() => {
        if (map && mapRef.current) {
          try {
            map.refresh();
          } catch (error) {
            console.error("지도 리사이즈 실패:", error);
          }
        }
      }, 200);
    });

    // 지도 로드 실패 시 대체 방법
    setTimeout(() => {
      if (map && mapRef.current) {
        try {
          map.refresh();
        } catch (error) {
          console.error("지도 강제 리사이즈 실패:", error);
        }
      }
    }, 500);

    // 모달에서 지도가 보이지 않는 문제 해결을 위한 추가 리사이즈
    setTimeout(() => {
      if (map && mapRef.current) {
        try {
          const container = mapRef.current;
          const rect = container.getBoundingClientRect();

          if (rect.width > 0 && rect.height > 0) {
            map.refresh();
          }
        } catch (error) {
          console.error("지도 최종 리사이즈 실패:", error);
        }
      }
    }, 1000);

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error("컴포넌트 언마운트 시 지도 정리 실패:", error);
        }
      }
    };
  }, [center, zoom, markers, isScriptLoaded]);

  return (
    <div
      className={className}
      style={{
        minHeight: "200px",
        position: "relative",
        backgroundColor: "#f8f9fa",
        overflow: "hidden",
      }}
    >
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "200px",
          position: "relative",
          zIndex: 1,
        }}
      />
      {!isScriptLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="text-gray-500 mb-2">🗺️</div>
            <p className="text-sm text-gray-600">지도를 불러오는 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NaverMap;
