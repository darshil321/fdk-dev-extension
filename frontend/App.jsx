import React from 'react';

import { store } from './store';
import { Home } from './pages/Home';
import { useParams } from 'react-router-dom';
import { Provider } from 'react-redux';

function App() {
  const { company_id } = useParams();

  return (
    <Provider store={store}>
      <div className="root">
        <Home companyId={company_id} />
      </div>
    </Provider>
  );
}

export default App;
