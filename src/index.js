import React from 'react';
import ReactDOM from 'react-dom/client';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faImage, 
  faFont, 
  faPencil, 
  faFilter, 
  faUpRightAndDownLeftFromCenter,
  faTrash, 
  faDownload,
  faCode 
} from '@fortawesome/free-solid-svg-icons';

import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

library.add(
  faImage, 
  faFont, 
  faPencil, 
  faFilter, 
  faUpRightAndDownLeftFromCenter, 
  faTrash, 
  faDownload, 
  faCode
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
