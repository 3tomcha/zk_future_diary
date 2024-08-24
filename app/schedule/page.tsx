"use client"

import ScheduleItem from "../components/ScheduleItem"

const mockSchedule = [
  { "time": "00:00", "value": "睡眠" },
  { "time": "01:00", "value": "睡眠" },
  { "time": "02:00", "value": "睡眠" },
  { "time": "03:00", "value": "睡眠" },
  { "time": "04:00", "value": "睡眠" },
  { "time": "05:00", "value": "ランニング" },
  { "time": "06:00", "value": "シャワー" },
  { "time": "07:00", "value": "朝食: 野菜スムージー" },
  { "time": "08:00", "value": "仕事" },
  { "time": "09:00", "value": "仕事" },
  { "time": "10:00", "value": "スナック: キウイ" },
  { "time": "11:00", "value": "仕事" },
  { "time": "12:00", "value": "ランチ: グリルチキンとサラダ" },
  { "time": "13:00", "value": "仕事" },
  { "time": "14:00", "value": "仕事" },
  { "time": "15:00", "value": "スナック: プロテインバー" },
  { "time": "16:00", "value": "ジム: カーディオトレーニング" },
  { "time": "17:00", "value": "ジム: ウェイトトレーニング" },
  { "time": "18:00", "value": "夕食: サーモンと野菜" },
  { "time": "19:00", "value": "ストレッチとリラックス" },
  { "time": "20:00", "value": "読書" },
  { "time": "21:00", "value": "軽いヨガ" },
  { "time": "22:00", "value": "夜のおやつ: ギリシャヨーグルト" },
  { "time": "23:00", "value": "睡眠" },
]

export default function Schedule() {
  const handleVerify = () => {
    console.log('verify')
  }
  return (
    <div className="container">
      <ul className="schedule-list" id="schedule">
        {mockSchedule.map((item) => {
          return (
            <ScheduleItem {...item} key={item.time} onVerify={handleVerify} />
          )
        })}
      </ul>
    </div>
  )
}