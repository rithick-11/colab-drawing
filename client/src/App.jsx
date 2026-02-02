import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Canvaschannel from './pages/Canvaschannel.jsx'
import { ToastContainer } from 'react-toastify';

const App = () => {

  return (
    <>
      <Routes>
        <Route path='/' exact element={<Home />}></Route>
        <Route path='/canva/:channelId' exact element={<Canvaschannel />}></Route>
      </Routes>
      <ToastContainer position='bottom-left' />
    </>
  )
}

export default App