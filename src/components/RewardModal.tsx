"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TrophyLottie from "@/components/lottie/trophy";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RewardModal = ({ isOpen, onClose }: RewardModalProps) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80%]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-yellow-600">
            🎉 축하합니다!
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-8">
          <div className="w-32 h-32">
            <TrophyLottie />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              퀘스트 완료!
            </h3>
            <p className="text-gray-600">
              정말 대단합니다! <br />
              새로운 모험을 시작해보세요.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RewardModal;
