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

export type Mission = {
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

export type InProgressQuest = {
  quest_id: string;
  mission_id: string;
  progress: number;
  total: number;
  completed_missions: string[];
  current_mission: string;
};
