import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { NhostProvider } from '@nhost/react'
import { NhostApolloProvider } from '@nhost/react-apollo'
import { nhostClient } from './utils/nhost'
import { useAuthenticationStatus } from '@nhost/react'
import AuthPage from './pages/AuthPage'
import ChatPage from './pages/ChatPage'
import ConnectionTest from './components/ConnectionTest'
import { MockAuthPage, MockChatPage } from './components/MockComponents'
import { useMockAuth } from './utils/mockData'

// Development mode flag - set to true to use mock data
const isDevelopmentMode = import.meta.env.VITE_NHOST_SUBDOMAIN === 'your-nhost-subdomain'

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = isDevelopmentMode 
    ? { isAuthenticated: false, isLoading: false }
    : useAuthenticationStatus()
  
  const mockAuth = useMockAuth()

  // Use mock auth in development mode
  const actualIsAuthenticated = isDevelopmentMode ? mockAuth.isAuthenticated : isAuthenticated
  const actualIsLoading = isDevelopmentMode ? mockAuth.isLoading : isLoading

  if (actualIsLoading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <>
      {!isDevelopmentMode && <ConnectionTest />}
      <Router>
        <Routes>
          <Route 
            path="/auth" 
            element={actualIsAuthenticated ? <Navigate to="/chat" replace /> : (
              isDevelopmentMode ? <MockAuthPage /> : <AuthPage />
            )} 
          />
          <Route 
            path="/chat" 
            element={actualIsAuthenticated ? (
              isDevelopmentMode ? <MockChatPage /> : <ChatPage />
            ) : <Navigate to="/auth" replace />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={actualIsAuthenticated ? "/chat" : "/auth"} replace />} 
          />
        </Routes>
      </Router>
    </>
  )
}

const App: React.FC = () => {
  if (isDevelopmentMode) {
    // In development mode, skip Nhost providers
    return (
      <div className="app">
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: '#fff3cd',
          color: '#856404',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          border: '1px solid #ffeaa7',
          zIndex: 1000,
          fontSize: '0.9rem'
        }}>
          🚧 Demo Mode - Update .env to connect to Nhost
        </div>
        <AppContent />
      </div>
    )
  }

  return (
    <NhostProvider nhost={nhostClient}>
      <NhostApolloProvider nhost={nhostClient}>
        <div className="app">
          <AppContent />
        </div>
      </NhostApolloProvider>
    </NhostProvider>
  )
}

export default App
