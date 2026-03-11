import { createContext } from "react";
import { SharedValue } from "react-native-reanimated";

export type ButtonGroupContextValue = {
  /** Index of currently pressed button. -1 = none pressed. */
  pressedIndex: SharedValue<number>;
};

/**
 * Consumed by Button to know:
 *  - whether it lives inside a ButtonGroup
 *  - what the current pressedIndex is (shared value, runs on UI thread)
 */
export const ButtonGroupContext =
  createContext<ButtonGroupContextValue | null>(null);
