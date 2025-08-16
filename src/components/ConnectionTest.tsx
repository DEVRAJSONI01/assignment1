import React, { useState } from 'react'
import { nhostClient } from '../utils/nhost'

const ConnectionTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('')
  const [testing, setTesting] = useState(false)

  const testNhostConnection = async () => {
    setTesting(true)
    setTestResult('')

    try {
      // Test basic connection
      const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN
      const region = import.meta.env.VITE_NHOST_REGION

      if (!subdomain || subdomain === 'your-nhost-subdomain') {
        setTestResult('❌ Please update VITE_NHOST_SUBDOMAIN in your .env file')
        return
      }

      if (!region || region === 'your-nhost-region') {
        setTestResult('❌ Please update VITE_NHOST_REGION in your .env file')
        return
      }

      // Test if Nhost client is working
      const isConnected = nhostClient.auth.isAuthenticated()
      setTestResult(`✅ Nhost configuration looks good!\n📍 Subdomain: ${subdomain}\n🌍 Region: ${region}\n🔐 Auth Status: ${isConnected ? 'Authenticated' : 'Not authenticated (expected)'}`)

    } catch (error) {
      setTestResult(`❌ Connection test failed: ${error}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      padding: '1rem',
      border: '2px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      maxWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>🧪 Connection Test</h4>
      
      <button
        onClick={testNhostConnection}
        disabled={testing}
        style={{
          background: '#667eea',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: testing ? 'not-allowed' : 'pointer',
          width: '100%',
          marginBottom: '1rem'
        }}
      >
        {testing ? 'Testing...' : 'Test Nhost Connection'}
      </button>

      {testResult && (
        <div style={{
          padding: '0.5rem',
          background: testResult.includes('❌') ? '#fee' : '#efe',
          border: `1px solid ${testResult.includes('❌') ? '#fcc' : '#cfc'}`,
          borderRadius: '4px',
          fontSize: '0.8rem',
          whiteSpace: 'pre-line'
        }}>
          {testResult}
        </div>
      )}

      <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.5rem' }}>
        💡 Update your .env file and refresh to test
      </div>
    </div>
  )
}

export default ConnectionTest
