import React from 'react';

import { store } from './store';
import { Home } from './pages/Home';
import { Provider } from 'react-redux';
import "./pages/style/variable.css";

function App() {

  return (
    <Provider store={store}>
      <div className="root">
        <Home />
      </div>
    </Provider>
  );
}

export default App;
