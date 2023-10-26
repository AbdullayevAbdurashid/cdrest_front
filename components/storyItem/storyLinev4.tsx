import React, { useMemo } from "react";
import cls from "./v4.module.scss";
import { STORY_DURATION } from "constants/story";

type Props = {
  time: number;
  lineIdx: number;
  currentIdx: number;
  isBefore: boolean;
};

export default function StoryLine({
  time,
  lineIdx,
  currentIdx,
  isBefore,
}: Props) {
  const percentage = useMemo(() => {
    if (isBefore) {
      return 100;
    } else {
      return currentIdx === lineIdx
        ? ((STORY_DURATION - time) * 100) / STORY_DURATION
        : 0;
    }
  }, [currentIdx, lineIdx, time, isBefore]);

  return (
    <div className={cls.step}>
      <div className={cls.completed} style={{ width: percentage + "%" }} />
    </div>
  );
}
