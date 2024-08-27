"use client"
import { useState } from "react";
import { atom, useRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export type Schedule = {
  time: string;
  value: string;
  image: string;
  location: string
}
const scheduleState = atom({
  key: 'schedule',
  default: [],
  effects_UNSTABLE: [persistAtom],
})

export function useGenerateschedule() {
  const [schedule, setSchedule] = useRecoilState<Schedule[]>(scheduleState);

  const fetchSchedule = async (_prompt: string) => {
    const prompt = `来週までに、${_prompt}です。月曜日の予定を一時間ごとに記載して24時間分になるようにしてください。なるべく具体的に書いて。例えば、ご飯だったらメニュー、出かけるんだったら場所まで。朝5時から夜の12時まで一気に返して。下記のようなjsonの配列で返して。[{"time": "00:00", "value": "睡眠", "location": "自宅"}, {"time": "01:00", "value": "睡眠", "location": "レストラン"}]。`
    const url = `/api/schedule?prompt=${encodeURIComponent(prompt)}`;

    const res = await fetch(url)
    if (res) {
      const scheduleJson = await res.json();
      const _schedule: Schedule[] = JSON.parse(scheduleJson.message.content)
      setSchedule(_schedule);
    }
  }


  return {
    schedule,
    fetchSchedule,
    setSchedule
  }
}
