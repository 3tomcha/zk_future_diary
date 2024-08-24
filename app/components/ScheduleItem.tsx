import "./ScheduleItem.css"

type Schedule = {
  time: string;
  value: string;
  image?: string;
  onVerify: () => void;
}
export default function ScheduleItem({ time, value, image, onVerify }: Schedule) {
  return (
    <>
      <li className="schedule-item">
        <div>
          <span className="time">{time}</span>: {value}
        </div>
        <div className="verify-buttons">
          <button className="verify" onClick={onVerify}>verify time</button>
          <button className="verify" onClick={onVerify}>verify location</button>
          <button className="verify" onClick={onVerify}>verify activity</button>
        </div>
      </li>
      {image && <img src={image} alt="aa" />}
    </>
  )
}