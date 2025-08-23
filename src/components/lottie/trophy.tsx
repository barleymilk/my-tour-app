import { useLottie } from "lottie-react";
import Trophy from "../../../public/lottieFiles/Trophy.json";

export default function TrophyLottie() {
  const options = {
    animationData: Trophy,
    loop: false,
    autoplay: true,
  };
  const { View } = useLottie(options);
  return <div className="w-full h-full">{View}</div>;
}
