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
    naver: any;
  }
}

const NaverMap = ({
  center = { lat: 37.5665, lng: 126.978 }, // 서울 시청
  zoom = 15,
  className = "w-full h-[200px] rounded-lg",
  markers = [],
}: NaverMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // 스크립트 로드 상태 변경 추적
  useEffect(() => {
    console.log("isScriptLoaded 상태 변경:", isScriptLoaded);
  }, [isScriptLoaded]);

  // 네이버 지도 스크립트 로드
  const loadNaverMapScript = () => {
    console.log("스크립트 로드 시작");

    if (window.naver) {
      console.log("이미 naver 객체가 존재함");
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      console.log("네이버 지도 스크립트 로드 완료!");

      // naver 객체가 실제로 설정될 때까지 대기
      const checkNaverObject = () => {
        if (window.naver && window.naver.maps) {
          console.log("naver.maps 객체 확인됨");
          setIsScriptLoaded(true);

          // 상태 업데이트 후 강제로 useEffect 재실행
          setTimeout(() => {
            console.log("스크립트 로드 완료 후 강제 실행");
          }, 100);
        } else {
          console.log("naver.maps 객체 대기 중...");
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
    console.log("지도 생성 useEffect 실행:", {
      hasMapRef: !!mapRef.current,
      isScriptLoaded,
      hasNaver: !!window.naver,
      hasNaverMaps: !!(window.naver && window.naver.maps),
    });

    if (
      !mapRef.current ||
      !isScriptLoaded ||
      !window.naver ||
      !window.naver.maps
    ) {
      console.log("지도 생성 조건 미충족:", {
        hasMapRef: !!mapRef.current,
        isScriptLoaded,
        hasNaver: !!window.naver,
        hasNaverMaps: !!(window.naver && window.naver.maps),
      });
      return;
    }

    // 기존 지도 인스턴스가 있다면 정리
    if (mapInstanceRef.current) {
      try {
        console.log("기존 지도 인스턴스 정리 중...");
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      } catch (error) {
        console.error("기존 지도 정리 실패:", error);
      }
    }

    // 컨테이너 내용 정리
    if (mapRef.current) {
      mapRef.current.innerHTML = "";
      console.log("지도 컨테이너 정리 완료");
    }

    console.log("지도 생성 시작:", {
      center,
      zoom,
      containerSize: {
        width: mapRef.current.offsetWidth,
        height: mapRef.current.offsetHeight,
      },
    });

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

      // 경계 크기에 따른 zoom 레벨 매핑 (더 정교한 계산)
      if (maxDiff > 20) calculatedZoom = 4; // 국가 레벨
      else if (maxDiff > 10) calculatedZoom = 5; // 광역시/도 레벨
      else if (maxDiff > 5) calculatedZoom = 7; // 시/군/구 레벨
      else if (maxDiff > 2) calculatedZoom = 9; // 동/읍/면 레벨
      else if (maxDiff > 1) calculatedZoom = 11; // 상세 지역 레벨
      else if (maxDiff > 0.5) calculatedZoom = 13; // 도시 상세 레벨
      else if (maxDiff > 0.1) calculatedZoom = 15; // 거리 레벨
      else calculatedZoom = 17; // 건물 레벨

      console.log("마커 경계 계산:", {
        bounds: { minLat, maxLat, minLng, maxLng },
        center: { centerLat, centerLng },
        maxDiff,
        calculatedZoom,
      });

      // 마커들이 모두 보이도록 경계 설정
      const bounds = new window.naver.maps.LatLngBounds();
      markers.forEach((markerData) => {
        bounds.extend(
          new window.naver.maps.LatLng(
            markerData.position.lat,
            markerData.position.lng
          )
        );
      });

      // 경계에 여백 추가 (20% 여백)
      const latPadding = latDiff * 0.2;
      const lngPadding = lngDiff * 0.2;

      bounds.extend(
        new window.naver.maps.LatLng(minLat - latPadding, minLng - lngPadding)
      );
      bounds.extend(
        new window.naver.maps.LatLng(maxLat + latPadding, maxLng + lngPadding)
      );

      console.log("경계 설정 준비 완료:", {
        bounds: bounds.toString(),
        padding: { latPadding, lngPadding },
      });
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
    console.log("지도 인스턴스 생성 완료:", map);

    // 마커들이 모두 보이도록 경계 적용
    if (markers.length > 0 && window.naver.maps.LatLngBounds) {
      try {
        // 지도가 완전히 로드된 후 경계 적용
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

            // 경계에 여백 추가 (20% 여백)
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

            // 지도 뷰를 경계에 맞춤
            map.fitBounds(bounds);

            console.log("지도 경계 적용 완료:", {
              bounds: bounds.toString(),
              padding: { latPadding, lngPadding },
            });
          }
        }, 500); // 지도 로드 후 0.5초 뒤에 경계 적용
      } catch (error) {
        console.error("경계 적용 실패:", error);
      }
    }

    // 지도가 실제로 렌더링되었는지 확인
    setTimeout(() => {
      if (map && mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        console.log("지도 렌더링 확인:", {
          containerSize: rect,
          mapInstance: !!map,
          hasMapElement: mapRef.current.children.length > 0,
        });
      }
    }, 100);

    // 기본 마커 추가 (중심점)
    // const defaultMarker = new window.naver.maps.Marker({
    //   position: new window.naver.maps.LatLng(center.lat, center.lng),
    //   map: map,
    //   title: "현재 위치",
    // });

    // 사용자 정의 마커 추가
    const markerInstances: any[] = [];

    markers.forEach((markerData, index) => {
      // order 정보를 포함한 커스텀 마커 HTML 생성
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
      // order 기준으로 마커들을 정렬
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

      // 연속된 마커들 사이에 선 그리기
      for (let i = 0; i < sortedMarkers.length - 1; i++) {
        const currentMarker = sortedMarkers[i];
        const nextMarker = sortedMarkers[i + 1];

        const polyline = new window.naver.maps.Polyline({
          path: [currentMarker.getPosition(), nextMarker.getPosition()],
          strokeColor: "#3B82F6", // 파란색
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeStyle: "solid",
          map: map,
        });
      }
    }

    // 지도 로드 완료 이벤트
    window.naver.maps.Event.once(map, "init", () => {
      console.log("네이버 지도가 로드되었습니다.");

      // 모달에서 지도가 제대로 표시되도록 강제 리사이즈
      setTimeout(() => {
        if (map && mapRef.current) {
          try {
            map.refresh();
            console.log("지도 리사이즈 완료");
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
          console.log("지도 강제 리사이즈 완료");
        } catch (error) {
          console.error("지도 강제 리사이즈 실패:", error);
        }
      }
    }, 500);

    // 모달에서 지도가 보이지 않는 문제 해결을 위한 추가 리사이즈
    setTimeout(() => {
      if (map && mapRef.current) {
        try {
          // 지도 컨테이너 크기 강제 업데이트
          const container = mapRef.current;
          const rect = container.getBoundingClientRect();
          console.log("컨테이너 크기:", rect);

          if (rect.width > 0 && rect.height > 0) {
            map.refresh();
            console.log("지도 최종 리사이즈 완료");
          } else {
            console.log("컨테이너 크기가 0입니다");
          }
        } catch (error) {
          console.error("지도 최종 리사이즈 실패:", error);
        }
      }
    }, 1000);

    return () => {
      if (mapInstanceRef.current) {
        try {
          console.log("컴포넌트 언마운트 시 지도 정리 중...");
          mapInstanceRef.current.destroy();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error("컴포넌트 언마운트 시 지도 정리 실패:", error);
        }
      }
    };
  }, [center.lat, center.lng, zoom, markers, isScriptLoaded]);

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
