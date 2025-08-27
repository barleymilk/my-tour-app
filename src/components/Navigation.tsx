import Link from "next/link";
import {
  HomeIcon,
  Pin,
  NotebookPen,
  MessageCircleIcon,
  UserRound,
} from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [showDevMessage, setShowDevMessage] = useState(false);

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDevMessage(true);
    // 3초 후 자동으로 메시지 숨김
    setTimeout(() => setShowDevMessage(false), 3000);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full p-4 border-t border-gray-200 rounded-t-xl bg-background">
        <ul className="flex justify-between">
          <li>
            <Link
              href="/"
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">홈</span>
            </Link>
          </li>
          <li>
            <Link
              href="/places"
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Pin className="w-6 h-6" />
              <span className="text-xs">장소</span>
            </Link>
          </li>
          <li>
            <Link
              href="/quests"
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <NotebookPen className="w-6 h-6" />
              <span className="text-xs">퀘스트</span>
            </Link>
          </li>
          <li>
            <button
              onClick={handleChatClick}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MessageCircleIcon className="w-6 h-6" />
              <span className="text-xs">채팅</span>
            </button>
          </li>
          <li>
            <Link
              href="/profile"
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <UserRound className="w-6 h-6" />
              <span className="text-xs">프로필</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* 개발 진행 중 메시지 */}
      {showDevMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg z-50">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">🚧 개발 진행 중</div>
            <div className="text-sm">채팅 기능을 준비하고 있습니다!</div>
          </div>
        </div>
      )}
    </>
  );
}
