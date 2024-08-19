import { isFuture } from "date-fns";
import { useEffect, useState } from "react"


interface Props {
  toDate: Date
  dayExclude?: boolean,
  hourExclude?: boolean,
  minExclude?: boolean,
  secExclude?: boolean,

}

export default function Countdown({ toDate, dayExclude = false, hourExclude = false, minExclude = false, secExclude = false }: Props) {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {

    const timerId = setInterval(() => {
      const now = new Date().getTime()

      let timeToDate = toDate.getTime();

      if (!isFuture(toDate)) timeToDate = toDate.setFullYear(new Date().getFullYear() + 1)

      const distance = (timeToDate - now) / 1000
      if (distance > 0) {
        let days = Math.floor(distance / 60 / 60 / 24);

        let hours = Math.floor(distance / 60 / 60 % 24);
        if (dayExclude && !hourExclude) hours = Math.floor(distance / 60 / 60 % 24) + Math.floor(distance / 60 / 60 / 24) * 24;

        let minutes = Math.floor((distance / 60) % 60);
        if (dayExclude && hourExclude && !minExclude) minutes = Math.floor((distance / 60) % 60) + Math.floor(distance / 60 / 60 % 24) * 60 + Math.floor(distance / 60 / 60 / 24) * 1440;

        let seconds = Math.floor(distance % 60);

        if (!dayExclude) setDays(days)
        if (!hourExclude) setHours(hours)
        if (!minExclude) setMinutes(minutes)
        if (!secExclude) setSeconds(seconds)
      } else {
        clearInterval(timerId)
      }
    }, 1000)
    return () => clearInterval(timerId)
  }, [toDate])



  return (
    <time className="flex flex-wrap md:gap-5 gap-2">

      {!dayExclude ?
        <div className="flex flex-col gap-2 items-center">
          <div className="text-4xl font-bold">{days}</div>
          <p className="text-xl">Days</p>
        </div> : <></>}

      {!dayExclude && !hourExclude ? <span className="text-4xl font-bold text-center">:</span> : <></>}

      {!hourExclude ?
        <div className="flex flex-col gap-2 items-center">
          <div className="text-4xl font-bold">{hours}</div>
          <p className="text-xl">Hours</p>
        </div> : <></>}

      {!minExclude ? <span className="text-4xl font-bold text-center">:</span> : <></>}


      {!minExclude ?
        <div className="flex flex-col gap-2 items-center">
          <div className="text-4xl font-bold">{minutes}</div>
          <p className="text-xl">Minutes</p>
        </div> : <></>}

      {!secExclude ? <span className="text-4xl font-bold text-center">:</span> : <></>}


      {!secExclude ?
        <div className="flex flex-col gap-2 items-center">
          <div className="text-4xl font-bold">{seconds}</div>
          <p className="text-xl">Seconds</p>
        </div> : <></>}

    </time>
  )
}
