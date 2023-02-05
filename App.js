import React from 'react';
import LoginNav from './frontend/navigation/loginNav';
import { GlobalState } from './GlobalState';

export default function App() {
    return (
      <GlobalState>
        <LoginNav/>
      </GlobalState>
    )
};