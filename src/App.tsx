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
    </BrowserRouter>
  )
}

export default App
