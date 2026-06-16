import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { routerBasename, withAppBase } from './utils/appBase.js'
import './index.css'
import App from './App.jsx'

const nativeFetch = window.fetch.bind(window)
window.fetch = (input, init) => {
  if (typeof input === 'string' && (input.startsWith('/api/') || input === '/api')) {
    return nativeFetch(withAppBase(input), init)
  }
  return nativeFetch(input, init)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename()}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
