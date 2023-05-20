import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from 'pages/dashboard'

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

function App() {

    return (
        <Routes>
            <Route
                path='/'
                element={<Dashboard />}
            />
        </Routes>
    );
}

export default App;
