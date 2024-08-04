import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import { links } from "./components/links"


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>

      {Object.keys(links).filter(t=>links[t].route!=null).map(key=>(
          <Route key={key} path={key} element={links[key]?.route||<Home/>}/>
      ))}

      <Route path="*" element={<Navigate to='/' replace/>}/>



    </Routes>
      <footer className="text-center">Made with 💖 by Len.icon | <a href="https://github.com/Lenicon">Github</a> | <a href="https://lenicon.itch.io">Itch.io</a> | <a href="https://x.com/LeniconDev">X</a></footer>
    </BrowserRouter>
  )
}

export default App
