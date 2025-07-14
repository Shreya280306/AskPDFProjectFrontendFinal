// Global server URL for API calls

// IMP NOTE: After any change in main.jsx, "npm run dev" has to happen again
// export const ServerURL = "http://localhost:8000";
export const ServerURL = "https://askpdfvideoazdep-cvhcaydreee7chb6.canadacentral-01.azurewebsites.net";
// export const ServerURL = "https://askpdfvideo-dvfjcqd0hzbvd4f4.canadacentral-01.azurewebsites.net";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
