import "./ScheduleItem.css"

type Schedule = {
  time: string;
  value: string;
  image?: string;
}
export default function ScheduleItem({ time, value, image }: Schedule) {
  return (
    <>
      <li className="schedule-item">
        <span className="time">{time}</span>: {value}
      </li>
      {image && <img src={image} alt="aa" />}
    </>
  )
}