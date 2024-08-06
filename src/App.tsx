import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import { links } from "./components/links"


function App() {
  return (
    <BrowserRouter>
    {window.location.pathname!="/"? <header className="text-center fixed top-2 bg-white w-full text-2xl font-bold"><a href="/">🧰 Trash Toolbox 🧰</a></header>:<></>}

    <Routes>
      <Route path="/" element={<Home/>}/>

      {Object.keys(links).filter(t=>links[t].route!=null).map(key=>(
          <Route key={key} path={key} element={links[key]?.route||<Home/>}/>
      ))}

      <Route path="*" element={<Navigate to='/' replace/>}/>



    </Routes>
      <footer className="text-center fixed bottom-2 bg-white w-full">Made with 💖 by Len.icon | <a className="social" target='_blank' href="https://github.com/Lenicon">Github</a> | <a className="social" target='_blank' href="https://lenicon.itch.io">Itch.io</a> | <a className="social" target='_blank' href="https://x.com/LeniconDev">X</a></footer>
    </BrowserRouter>
  )
}

export default App
