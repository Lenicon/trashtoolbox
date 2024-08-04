import { links } from "../components/links";

export default function Home() {
  return (
    <div className="h-[90vh] flex flex-col items-center">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="md:text-[4rem] text-4xl leading-none font-bold pt-8 text-center">🧰 Trash Toolbox 🧰</h1>
        <p className="md:text-2xl text-base pb-16 text-center">{'Stuff I made (in a hurry) to help myself'}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.keys(links).map(key => (
          <a className="text-[1.5rem] underline hover:text-yellow-600" href={key}>{links[key].title}</a>
        ))}
      </div>
    </div>
  )
}
