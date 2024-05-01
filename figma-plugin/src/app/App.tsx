import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/ui.css';

import AuthContainer from './features/auth/auth-container';
import SignupPage from './features/signup/signup.page';
import ConfirmPage from './features/confirm/confirm.page';
import PrivateAreaPage from './features/private/private.page';

function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<AuthContainer />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/confirm" element={<ConfirmPage />} />
          <Route path="/private/:page" element={<PrivateAreaPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export default App;
