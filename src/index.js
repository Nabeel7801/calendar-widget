import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// stylesheets
import 'assets/css/index.css';
import 'flowbite-datepicker';

// project import
import App from './App';

import reportWebVitals from './reportWebVitals';

import { store, persistor } from './redux';

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <PersistGate  persistor={persistor}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>
);

reportWebVitals();
