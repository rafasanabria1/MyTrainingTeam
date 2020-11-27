import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MTTContextProvider from './MTTContextProvider';

ReactDOM.render(
    <MTTContextProvider>
        <App />
    </MTTContextProvider>, 
    document.getElementById('root')
);
