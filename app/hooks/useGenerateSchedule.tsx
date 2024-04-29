"use client"
import { useState } from "react";
import { atom, useRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export type Schedule = {
  time: string;
  value: string;
  image: string;
}
const scheduleState = atom({
  key: 'schedule',
  default: [],
  effects_UNSTABLE: [persistAtom],
})

export function useGenerateschedule() {
  const [schedule, setSchedule] = useRecoilState<Schedule[]>(scheduleState);
  const API_URL = "http://localhost:3000/api"

  const fetchSchedule = async (_prompt: string) => {
    // console.log("fetch")
    const prompt = `来週までに、${_prompt}です。月曜日の予定を一時間ごとに記載して24時間分になるようにしてください。なるべく具体的に書いて。例えば、ご飯だったらメニュー、出かけるんだったら場所まで。朝5時から夜の12時まで一気に返して。下記のようなjsonの配列で返して。[{"time": "00:00", "value": "睡眠"}, {"time": "01:00", "value": "睡眠"}]。`
    const url = `${API_URL}/schedule?prompt=${encodeURIComponent(prompt)}`;

    const res = await fetch(url)
    if (res) {
      const _schedule = await res.json();
      setSchedule(_schedule);
    }
  }


  return {
    schedule,
    fetchSchedule,
    setSchedule
  }
}
