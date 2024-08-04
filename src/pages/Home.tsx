import { links } from "../components/links";

export default function Home() {
  return (
    <div className="h-[90vh] flex flex-col items-center">
      <h1 className="md:text-[4rem] text-4xl font-bold pt-5">🧰 Trash Toolbox</h1>
      <h3 className="md:text-[1.8rem] text-xl pb-20">{'Stuff I made (in a hurry) to help myself'}</h3>

      <div className="flex flex-wrap gap-3">
        {Object.keys(links).map(key => (
          <a className="text-[1.5rem] underline hover:text-yellow-600" href={key}>{links[key].title}</a>
        ))}
      </div>
    </div>
  )
}
