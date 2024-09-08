import React from 'react'

import { BrowserRouter } from 'react-router-dom';
import { PagesRouter } from '../router/PagesRouter';
import { UserProvider } from '../context/UserProvider';
import { PrivateRouter } from '../router/PrivateRouter'; 
export const MainApp = () => {
  return (
    <UserProvider>
      <BrowserRouter>
            <PagesRouter/>
      </BrowserRouter>
    </UserProvider>
  )
}
