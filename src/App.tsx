import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import { links } from "./config/settings"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faItchIo, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Notifications } from '@bdhamithkumara/react-push-notification';


function App() {
  return (
    <BrowserRouter>
    <Notifications/>
      {window.location.pathname != "/" ? <header className="text-center fixed top-0 pt-2 bg-white w-full text-2xl font-bold"><a href="/">🧰 Trash Toolbox 🧰</a></header> : <></>}

      <Routes>
        <Route path="/" element={<Home />} />

        {Object.keys(links).filter(t => links[t].route != null).filter(t => !t.startsWith("!")).map(key => (
          <Route key={key} path={key} element={links[key]?.route || <Home />} />
        ))}

        <Route path="*" element={<Navigate to='/' replace />} />



      </Routes>
      <footer className="text-center fixed bottom-0 flex flex-row justify-center items-center text-base bg-white w-full pb-1">
        <span className="px-2">Made with 💖 by <strong>Len.icon</strong></span>
        <span className="px-1">|</span>
        <a title="My Github" className="px-2 social text-lg hover:text-[#24292e]" target='_blank' href="https://github.com/Lenicon">
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a title="My Games" className="px-2 social text-lg hover:text-[#fa5c5c]" target='_blank' href="https://lenicon.itch.io">
          <FontAwesomeIcon icon={faItchIo} />
        </a>
        <a title="My Twitter / X" className="px-2 social text-lg hover:text-[#08a0e9]" target='_blank' href="https://x.com/LeniconDev">
          <FontAwesomeIcon icon={faXTwitter} />
        </a>
        <a title="My Youtube" className="px-2 social text-lg hover:text-[#ff0000]" target='_blank' href="https://www.youtube.com/@LeniconDev">
          <FontAwesomeIcon icon={faYoutube} />
        </a>
      </footer>
    </BrowserRouter>
  )
}

export default App
