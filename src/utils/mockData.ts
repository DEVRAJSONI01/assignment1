import React, { useState } from 'react'

// Mock authentication hook for development
export const useMockAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email.includes('@')) {
      setIsAuthenticated(true)
      localStorage.setItem('mock-auth', 'true')
    } else {
      setError(new Error('Invalid email format'))
    }
    
    setIsLoading(false)
  }

  const signUp = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email.includes('@') && password.length >= 6) {
      setIsAuthenticated(true)
      localStorage.setItem('mock-auth', 'true')
    } else {
      setError(new Error('Email must be valid and password at least 6 characters'))
    }
    
    setIsLoading(false)
  }

  const signOut = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('mock-auth')
  }

  // Check for existing auth on load
  React.useEffect(() => {
    const mockAuth = localStorage.getItem('mock-auth')
    if (mockAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  return {
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signUp,
    signOut
  }
}

// Mock chat data
export const mockChats = [
  {
    id: '1',
    title: 'General Chat',
    created_at: '2025-08-17T10:00:00Z',
    updated_at: '2025-08-17T10:30:00Z',
    user_id: 'mock-user-1'
  },
  {
    id: '2', 
    title: 'AI Assistant Help',
    created_at: '2025-08-17T09:00:00Z',
    updated_at: '2025-08-17T09:15:00Z',
    user_id: 'mock-user-1'
  }
]

export const mockMessages: Record<string, Array<{
  id: string
  content: string
  role: 'user' | 'assistant'
  created_at: string
  chat_id: string
  user_id: string
}>> = {
  '1': [
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      role: 'assistant' as const,
      created_at: '2025-08-17T10:00:00Z',
      chat_id: '1',
      user_id: 'mock-user-1'
    },
    {
      id: '2',
      content: 'Hi there! I wanted to test this chatbot.',
      role: 'user' as const,
      created_at: '2025-08-17T10:01:00Z',
      chat_id: '1',
      user_id: 'mock-user-1'
    },
    {
      id: '3',
      content: 'Great! I\'m working well. What would you like to know?',
      role: 'assistant' as const,
      created_at: '2025-08-17T10:02:00Z',
      chat_id: '1',
      user_id: 'mock-user-1'
    }
  ],
  '2': [
    {
      id: '4',
      content: 'Welcome to AI Assistant! I can help you with various tasks.',
      role: 'assistant' as const,
      created_at: '2025-08-17T09:00:00Z',
      chat_id: '2',
      user_id: 'mock-user-1'
    }
  ]
}
