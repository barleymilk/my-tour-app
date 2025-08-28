import { Quest } from "./types";

export const quests: Quest[] = [
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
        type: "GPS_AND_MULTIPLE",
        condition: "경포 해변에서 파도 소리 15초 녹음",
        order: 1,
        reward_badge_id: "BDG-001",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "audio",
              required: true,
              min_duration: 15,
              max_duration: 60,
              file_types: ["audio/mp3", "audio/wav", "audio/m4a"],
              max_file_size: 10,
            },
          ],
          additional_conditions: ["해변에서 파도 소리 녹음"],
        },
        difficulty: "easy",
        estimated_duration: 60,
        tips: [
          "조용한 시간대에 녹음하면 더 좋은 품질을 얻을 수 있어요",
          "파도 소리가 잘 들리는 위치를 찾아보세요",
        ],
      },
      {
        mission_id: "MR-GNG-001-02",
        title: "향기 속의 추억",
        description:
          "박노인이 사랑하는 사람과 처음 만난 안목해변에서 따스한 커피 향기를 그에게 전해주세요.",
        place_id: "PL-GNG-002",
        place_name: "안목해변 커피거리",
        coordinates: { lat: 37.7892, lng: 128.8956 },
        type: "GPS_AND_MULTIPLE",
        condition: "안목해변 커피거리의 카페에서 음료 주문하기",
        order: 2,
        reward_badge_id: "BDG-002",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "purchase",
              required: true,
              purchase_min_amount: 5000,
              purchase_categories: ["음료", "커피", "카페"],
            },
            {
              type: "photo",
              required: true,
              file_types: ["image/jpeg", "image/png"],
              max_file_size: 5,
            },
          ],
          additional_conditions: [
            "카페에서 음료 구매",
            "커피거리 풍경 사진 촬영",
          ],
        },
        difficulty: "easy",
        estimated_duration: 45,
        tips: [
          "해변을 바라보는 자리에서 커피를 마시면 더 특별한 경험이 될 거예요",
          "일몰 시간대가 가장 아름다워요",
        ],
      },
      {
        mission_id: "MR-GNG-001-03",
        title: "잃어버린 맛의 지도",
        description:
          "활기찬 시장에서 사라져가는 정을 느껴보고 그에게 알려주세요. 시장의 맛을 경험하는 것이 중요합니다.",
        place_id: "PL-GNG-003",
        place_name: "강릉중앙시장",
        coordinates: { lat: 37.7519, lng: 128.8765 },
        type: "GPS_AND_MULTIPLE",
        condition: "강릉중앙시장에서 5,000원 이상 지출",
        order: 3,
        reward_badge_id: "BDG-003",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "purchase",
              required: true,
              purchase_min_amount: 5000,
              purchase_categories: ["음식", "기념품", "특산품"],
            },
            {
              type: "text",
              required: true,
              min_length: 20,
              max_length: 200,
              hint: "시장에서 느낀 감정이나 경험을 자유롭게 적어주세요",
            },
          ],
          additional_conditions: [
            "시장에서 5,000원 이상 구매",
            "시장 경험 후기 작성",
          ],
        },
        difficulty: "medium",
        estimated_duration: 90,
        tips: [
          "시장의 대표 음식을 꼭 맛보세요",
          "상인들과 대화하면 더 재미있는 이야기를 들을 수 있어요",
        ],
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
        type: "GPS_AND_PHOTO",
        condition: "한복 대여 후 한복 착용 인증 사진 업로드",
        order: 1,
        reward_badge_id: "BDG-004",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "photo",
              required: true,
              file_types: ["image/jpeg", "image/png"],
              max_file_size: 5,
              hint: "한복을 입고 한옥마을에서 사진을 찍어주세요",
            },
          ],
          additional_conditions: ["한복 착용", "한옥마을 배경 사진 촬영"],
        },
        difficulty: "easy",
        estimated_duration: 60,
        tips: [
          "한복 대여소에서 전문가의 도움을 받으면 더 아름답게 착용할 수 있어요",
          "한옥마을의 전통적인 건물을 배경으로 사진을 찍어보세요",
        ],
      },
      {
        mission_id: "MR-JNJ-001-02",
        title: "글귀를 담는 한지",
        description:
          "이 편지는 특별한 한지에만 쓸 수 있어요. 당신이 직접 한지를 만들고 그 편지에 당신의 마음을 담아주세요.",
        place_id: "PL-JNJ-002",
        place_name: "전주 한지박물관",
        coordinates: { lat: 35.812, lng: 127.15 },
        type: "GPS_AND_MULTIPLE",
        condition: "한지 공예품 만들기 체험 후 인증",
        order: 2,
        reward_badge_id: "BDG-005",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "photo",
              required: true,
              file_types: ["image/jpeg", "image/png"],
              max_file_size: 5,
            },
            {
              type: "text",
              required: true,
              min_length: 30,
              max_length: 300,
              hint: "한지 만들기 체험에서 느낀 점과 만든 작품에 대한 설명을 적어주세요",
            },
          ],
          additional_conditions: [
            "한지 공예품 제작",
            "체험 과정 사진 촬영",
            "체험 후기 작성",
          ],
        },
        difficulty: "medium",
        estimated_duration: 120,
        tips: [
          "체험 전에 예약을 하는 것이 좋아요",
          "만든 한지에 특별한 메시지를 적어보세요",
        ],
      },
      {
        mission_id: "MR-JNJ-001-03",
        title: "편지의 완성, 등불",
        description:
          "마지막으로, 당신의 편지를 밤하늘을 밝힐 등불에 띄워 보내야 해요. 밤이 되면 마을의 빛이 될 거예요.",
        place_id: "PL-JNJ-003",
        place_name: "전주 한옥마을",
        coordinates: { lat: 35.815, lng: 127.153 },
        type: "GPS_AND_MULTIPLE",
        condition: "한지 등불 들고 야간 산책 후 인증",
        order: 3,
        reward_badge_id: "BDG-006",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "photo",
              required: true,
              file_types: ["image/jpeg", "image/png"],
              max_file_size: 5,
            },
            {
              type: "audio",
              required: true,
              min_duration: 20,
              max_duration: 120,
              file_types: ["audio/mp3", "audio/wav"],
              max_file_size: 10,
            },
          ],
          additional_conditions: [
            "등불 들고 야간 산책",
            "밤하늘과 등불 사진 촬영",
            "야간 산책 소리 녹음",
          ],
        },
        difficulty: "hard",
        estimated_duration: 60,
        tips: [
          "일몰 후 1-2시간이 가장 아름다워요",
          "등불을 안전하게 들고 산책하세요",
        ],
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
        type: "GPS_AND_PHOTO",
        condition: "섭지코지에서 특정 구도에서 사진 촬영",
        order: 1,
        reward_badge_id: "BDG-007",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "photo",
              required: true,
              file_types: ["image/jpeg", "image/png"],
              max_file_size: 5,
              hint: "성산일출봉과 바다가 함께 보이는 구도로 사진을 찍어주세요",
            },
          ],
          additional_conditions: [
            "섭지코지에서 사진 촬영",
            "성산일출봉과 바다 풍경 사진 촬영",
          ],
        },
        difficulty: "medium",
        estimated_duration: 90,
        tips: [
          "일출 시간대가 가장 아름다워요",
          "바람이 강할 수 있으니 안전에 유의하세요",
        ],
      },
      {
        mission_id: "MR-JEJ-001-02",
        title: "시간이 빚은 돌의 노래",
        description:
          "돌하르방이 지키고 선 비자림 숲길을 걸으며 고요한 숲의 소리를 녹음해 주세요.",
        place_id: "PL-JEJ-002",
        place_name: "비자림",
        coordinates: { lat: 33.3867, lng: 126.7994 },
        type: "GPS_AND_AUDIO",
        condition: "비자림에서 숲의 소리 30초 녹음",
        order: 2,
        reward_badge_id: "BDG-008",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "audio",
              required: true,
              min_duration: 30,
              max_duration: 180,
              file_types: ["audio/mp3", "audio/wav"],
              max_file_size: 15,
              hint: "숲의 고요한 소리, 새소리, 바람 소리 등을 녹음해주세요",
            },
          ],
          additional_conditions: ["비자림 방문", "숲의 자연 소리 녹음"],
        },
        difficulty: "medium",
        estimated_duration: 150,
        tips: [
          "조용한 시간대에 방문하면 더 좋은 소리를 녹음할 수 있어요",
          "숲길을 천천히 걸으며 소리에 집중해보세요",
        ],
      },
      {
        mission_id: "MR-JEJ-001-03",
        title: "예술의 영감을 찾아서",
        description:
          "서귀포 이중섭거리에서 화가의 숨결을 느끼고, 거리의 화가에게 그림 한 점을 구매해 주세요.",
        place_id: "PL-JEJ-003",
        place_name: "서귀포 이중섭거리",
        coordinates: { lat: 33.2496, lng: 126.56 },
        type: "GPS_AND_PURCHASE",
        condition: "이중섭거리에서 예술 작품 1점 구매",
        order: 3,
        reward_badge_id: "BDG-009",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "purchase",
              required: true,
              purchase_min_amount: 10000,
              purchase_categories: ["예술작품", "그림", "공예품"],
            },
            {
              type: "photo",
              required: true,
              file_types: ["image/jpeg", "image/png"],
              max_file_size: 5,
            },
          ],
          additional_conditions: [
            "이중섭거리 방문",
            "예술 작품 구매",
            "작품과 함께 사진 촬영",
          ],
        },
        difficulty: "hard",
        estimated_duration: 90,
        tips: [
          "화가와 대화하면 작품에 대한 이야기를 들을 수 있어요",
          "작품의 의미를 이해하고 구매해보세요",
        ],
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
        type: "GPS_AND_QUIZ",
        condition: "석굴암 앞에서 지정된 퀴즈 정답 맞추기",
        order: 1,
        reward_badge_id: "BDG-010",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "quiz",
              required: true,
              quiz: {
                type: "multiple_choice",
                question: "석굴암의 본존불은 어떤 부처인가요?",
                options: ["아미타불", "비로자나불", "석가모니불", "약사불"],
                correct_answer: "비로자나불",
                hint: "석굴암의 본존불은 법신불을 상징합니다",
                explanation:
                  "석굴암의 본존불은 비로자나불로, 우주의 진리를 상징하는 법신불입니다.",
              },
            },
          ],
          additional_conditions: ["석굴암에서 30분 체류", "퀴즈 정답 맞추기"],
        },
        difficulty: "medium",
        estimated_duration: 45,
        tips: [
          "석굴암의 역사와 의미를 미리 알아보면 퀴즈를 쉽게 풀 수 있어요",
          "고요한 마음으로 불상을 바라보세요",
        ],
      },
      {
        mission_id: "MR-GYJ-001-02",
        title: "밤을 밝히는 등불",
        description:
          "동궁과월지 연못에 비치는 달빛을 보며 두 번째 단서를 얻으세요.",
        place_id: "PL-GYJ-002",
        place_name: "동궁과월지",
        coordinates: { lat: 35.834, lng: 129.219 },
        type: "GPS_AND_PHOTO",
        condition: "동궁과 월지 야간 투어 참여 후, 아름다운 야경 사진 업로드",
        order: 2,
        reward_badge_id: "BDG-011",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "photo",
              required: true,
              file_types: ["image/jpeg", "image/png"],
              max_file_size: 5,
              hint: "연못에 비치는 달빛과 야경을 아름답게 담아주세요",
            },
          ],
          additional_conditions: ["동궁과 월지 방문", "야경 사진 촬영"],
        },
        difficulty: "medium",
        estimated_duration: 75,
        tips: [
          "보름달이 뜨는 날이 가장 아름다워요",
          "야간 투어 시간을 미리 확인하세요",
        ],
      },
      {
        mission_id: "MR-GYJ-001-03",
        title: "천년의 종소리",
        description:
          "불국사의 범종 소리를 들으며 마지막 조각을 찾아 '천년의 서판'을 완성하세요.",
        place_id: "PL-GYJ-003",
        place_name: "불국사",
        coordinates: { lat: 35.79, lng: 129.332 },
        type: "GPS_AND_AUDIO",
        condition: "불국사에서 종소리 녹음하기",
        order: 3,
        reward_badge_id: "BDG-012",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "audio",
              required: true,
              min_duration: 20,
              max_duration: 120,
              file_types: ["audio/mp3", "audio/wav"],
              max_file_size: 10,
              hint: "범종의 울림과 사찰의 고요한 분위기를 녹음해주세요",
            },
          ],
          additional_conditions: ["불국사 방문", "종소리 녹음"],
        },
        difficulty: "hard",
        estimated_duration: 150,
        tips: [
          "범종 타종 시간을 미리 확인하세요",
          "고요한 마음으로 종소리를 들으며 녹음해보세요",
        ],
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
        type: "GPS_AND_PHOTO",
        condition: "감천문화마을에서 지정된 벽화와 함께 사진 촬영",
        order: 1,
        reward_badge_id: "BDG-013",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "photo",
              required: true,
              file_types: ["image/jpeg", "image/png"],
              max_file_size: 5,
              hint: "마을의 대표적인 벽화와 함께 사진을 찍어주세요",
            },
          ],
          additional_conditions: ["감천문화마을 방문", "벽화 사진 촬영"],
        },
        difficulty: "easy",
        estimated_duration: 75,
        tips: [
          "벽화가 잘 보이는 시간대에 방문하세요",
          "마을의 이야기를 들으며 벽화를 감상해보세요",
        ],
      },
      {
        mission_id: "MR-BUS-001-02",
        title: "맛의 미로 속 비밀",
        description:
          "자갈치시장에서 부산의 싱싱한 해산물을 맛보며 숨겨진 두 번째 단서를 찾으세요.",
        place_id: "PL-BUS-002",
        place_name: "자갈치시장",
        coordinates: { lat: 35.098, lng: 129.025 },
        type: "GPS_AND_MULTIPLE",
        condition: "자갈치시장의 음식점에서 2만 원 이상 지출",
        order: 2,
        reward_badge_id: "BDG-014",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "purchase",
              required: true,
              purchase_min_amount: 20000,
              purchase_categories: ["음식", "해산물", "식당"],
            },
            {
              type: "quiz",
              required: true,
              quiz: {
                type: "text",
                question: "자갈치시장의 마스코트가 무엇인가요?",
                correct_answer: "자갈치",
                hint: "시장 이름과 관련이 있어요",
                explanation:
                  "자갈치시장의 마스코트는 '자갈치'입니다. 자갈치는 부산 지역에서 많이 잡히는 물고기입니다.",
              },
            },
          ],
          additional_conditions: [
            "자갈치시장 방문",
            "2만원 이상 지출",
            "퀴즈 정답 맞추기",
          ],
        },
        difficulty: "medium",
        estimated_duration: 90,
        tips: [
          "신선한 해산물을 구분하는 방법을 알아보세요",
          "시장 상인들과 대화하면 더 재미있는 이야기를 들을 수 있어요",
        ],
      },
      {
        mission_id: "MR-BUS-001-03",
        title: "바다 위의 신비로운 섬",
        description:
          "태종대의 푸른 바다를 바라보며 마지막 단서를 해독하세요. 모든 퍼즐이 맞춰질 겁니다.",
        place_id: "PL-BUS-003",
        place_name: "태종대",
        coordinates: { lat: 35.058, lng: 129.02 },
        type: "GPS_AND_TEXT",
        condition: "태종대 방문 후, 절벽 풍경에 대한 감상평 작성",
        order: 3,
        reward_badge_id: "BDG-015",
        completion: {
          gps_required: true,
          inputs: [
            {
              type: "text",
              required: true,
              min_length: 50,
              max_length: 500,
              hint: "태종대의 절벽과 바다 풍경을 보고 느낀 감정과 생각을 자유롭게 적어주세요",
            },
          ],
          additional_conditions: ["태종대 방문", "절벽 풍경 감상평 작성"],
        },
        difficulty: "hard",
        estimated_duration: 150,
        tips: [
          "일몰 시간대가 가장 아름다워요",
          "안전하게 절벽을 바라보며 감상해보세요",
        ],
      },
    ],
  },
];
