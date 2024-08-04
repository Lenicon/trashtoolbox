import { links } from "../components/links";

export default function Home() {
  return (
    <div>
        {Object.keys(links).map(key => (
            <a href={key}>{links[key].title}</a>
        ))}
    </div>
  )
}
