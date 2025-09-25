import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  :root {
    --bg-grad: radial-gradient(1200px 600px at 10% -10%, #dbeafe 0%, transparent 60%),
                radial-gradient(1200px 600px at 90% 110%, #fce7f3 0%, transparent 60%),
                linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    --txt-strong: #0f172a;
    --txt-muted: #475569;
    --bd: #e5e7eb;
  }
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Apple SD Gothic Neo, Noto Sans KR, sans-serif;
    color: var(--txt-strong);
    background: var(--bg-grad);
  }
`

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalStyle />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
