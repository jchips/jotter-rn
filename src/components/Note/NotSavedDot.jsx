import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const NotSavedDot = ({ showDot, COLORS, configs }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (showDot) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.4, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(0, { duration: 200 });
    }
  }, [showDot]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value > 0 ? 0.6 : 0,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: COLORS.themePurple,
          marginHorizontal: !configs?.hideWordCount ? 0 : 10,
        },
        animatedStyle,
      ]}
    />
  );
};

export default NotSavedDot;
