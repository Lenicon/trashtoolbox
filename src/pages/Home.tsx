import { homewords, links } from "../config/settings";
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);

  return (
    <div className={`h-full flex flex-col items-center ${loading ? 'cursor-wait' : 'cursor-default'} `}>

      <div id='bg' className={`w-screen h-screen fixed -z-[5] ${loading ? 'cursor-wait' : 'cursor-default'}`} />


      <div className="flex flex-col gap-2 items-center">
        <h1 className="md:text-[4rem] text-4xl leading-none font-bold pt-8 text-center">🧰 Trash Toolbox 🧰</h1>
        <p className="md:text-2xl text-base pb-16 text-center">{homewords[Math.floor(Math.random() * homewords.length)]}</p>
      </div>

      <div className="flex flex-wrap gap-5 justify-center items-center content">
        {Object.keys(links).filter(t => !t.startsWith('!')).map(key => (
            <a className="text-[1.5rem] underline hover:text-yellow-600" onClick={() => setLoading(true)}  href={key}>
              {!links[key].icon.startsWith("!")?<img src={links[key].icon}/>:<></>}
              <span>{links[key].title}</span>
            </a>
        ))}
      </div>
    </div>
  )
}
