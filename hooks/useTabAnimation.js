import { useRef, useState } from "react";
import { Animated } from "react-native";

export const useTabAnimation = () => {
  const [activeTab, setActiveTab] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateSlide = (index) => {
    setActiveTab(index);
    Animated.spring(slideAnim, {
      toValue: index * 85,
      useNativeDriver: true,
      tension: 68,
      friction: 10,
    }).start();
  };

  const handleTabPress = (e) => {
    const tabIndex = ["Tarihi", "Doğa", "Yemek"].indexOf(
      e.target.split("-")[0]
    );
    animateSlide(tabIndex);
  };

  return {
    activeTab,
    slideAnim,
    handleTabPress,
  };
};
