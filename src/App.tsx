import Header from "components/layout/Header";
import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "Router";
import AuthProvider from "provider/userProvider";
import DarkMode from "provider/darkModeProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const App = () => {
  return (
    <DarkMode>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Router />
          <ReactQueryDevtools initialIsOpen={true} />
        </BrowserRouter>
      </AuthProvider>
    </DarkMode>
  );
};

export default App;
