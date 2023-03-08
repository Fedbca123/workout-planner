import React, { useState, useRef } from "react";
import AuthProvider from './frontend/AuthProvider';
import { GlobalState } from './frontend/GlobalState';
import RootNav from './frontend/navigation/rootNav';

export default function App() {

    return (
      <AuthProvider>
        <GlobalState>
          <RootNav/>
        </GlobalState>
      </AuthProvider>
    )
};