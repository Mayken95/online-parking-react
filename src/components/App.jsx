import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
export const App = () => {
  return (
    <BrowserRouter basename="/app">
    <Routes>
      <Route path="/" exact c/> 
    </Routes>
    </BrowserRouter>
  )
}
