import { homewords, links } from "../config/settings";
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);

  return (
    <div className={`h-full flex flex-col items-center ${loading ? 'cursor-wait' : 'cursor-default'} w-full`}>

      <div id='bg' className={`w-screen h-screen fixed -z-[5] ${loading ? 'cursor-wait' : 'cursor-default'}`} />


      <div className="flex flex-col gap-2 items-center">
        <h1 className="md:text-[4rem] text-4xl leading-none font-bold pt-8 text-center">🧰 Trash Toolbox 🧰</h1>
        <p className="md:text-2xl text-base md:pb-16 pb-10 text-center">{homewords[Math.floor(Math.random() * homewords.length)]}</p>
      </div>

      <div className="flex flex-wrap gap-5 justify-center items-center content mb-16">
        {Object.keys(links).filter(t => !t.startsWith('!')).map(key => (
            <a className="md:w-[40%] w-[80%] border-2 shadow-md p-5 flex-row flex justify-between gap-4 items-center text-[1.5rem] homelinks" onClick={() => setLoading(true)}  href={key}>
              {links[key].lefticon?<img width={50} src={links[key].lefticon}/>:<></>}
              <span className="text-wrap text-center leading-7 flex justify-center items-center w-full">
                {links[key].title}
              </span>
              {links[key].righticon?<img width={50} src={links[key].righticon}/>:<img width={50} src={links[key].lefticon}/>}

            </a>
        ))}
      </div>
    </div>
  )
}
