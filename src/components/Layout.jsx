import React from 'react';
import { Outlet } from 'react-router-dom';
import {NavBar} from './NavBar';
export const Layout = ({ children }) => {
    return (
        <>
            <NavBar />
            <main>
                <Outlet /> 
            </main>
        </>
    );
}
