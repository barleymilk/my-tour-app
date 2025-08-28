"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  back?: boolean;
  title?: string;
  onBack?: () => void;
  onHomeClick?: () => void;
}

export default function Header({
  back = false,
  title = "My Tour App",
  onBack = () => {},
}: HeaderProps) {
  const router = useRouter();
  // const { theme, setTheme } = useTheme();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <header
      className="bg-background sticky top-0 z-50 border-b"
      style={{ height: "var(--header-height)" }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* 왼쪽: 홈 아이콘 or 뒤로가기 아이콘 */}
        {back ? (
          <>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onBack()}
                aria-label="뒤로가기"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNavigation("/")}
            >
              <Home />
            </Button>
          </div>
        )}

        {/* 가운데: 페이지 제목 */}
        <h1 className="text-md font-semibold absolute left-1/2 -translate-x-1/2">
          {title}
        </h1>
      </div>
    </header>
  );
}
