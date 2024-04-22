import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import AuthContainer from './features/auth/auth-container';
import LoginPage from './features/login/login.page';
import SignupPage from './features/signup/signup.page';
import ConfirmPage from './features/confirm/confirm.page';
import PrivateAreaPage from './features/private/private.page';

function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<AuthContainer />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/confirm" element={<ConfirmPage />} />
          <Route path="/private/:page" element={<PrivateAreaPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export default App;
