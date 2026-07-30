import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Landing from './Landing'

function Root() {
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return <App />;
  }

  return <Landing onLaunch={() => setShowApp(true)} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)