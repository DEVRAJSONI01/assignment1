import React, { useState } from 'react'
import { useMockAuth, mockChats, mockMessages } from '../utils/mockData'

const MockAuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const { signIn, signUp, isLoading, error } = useMockAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSignUp) {
      await signUp(email, password)
    } else {
      await signIn(email, password)
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'} (Demo Mode)</h2>
        
        <div style={{ 
          background: '#e3f2fd', 
          padding: '1rem', 
          borderRadius: '4px', 
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          <strong>Demo Mode:</strong> Use any email format and password (6+ chars)
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password123"
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="error-message">
            {error.message}
          </div>
        )}

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>

        <div className="auth-switch">
          <p>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

const MockChatPage: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>(mockChats[0]?.id || '')
  const [messageInput, setMessageInput] = useState('')
  const [messages, setMessages] = useState(mockMessages)
  const [chats, setChats] = useState(mockChats)
  const [isSending, setIsSending] = useState(false)

  const { signOut } = useMockAuth()

  const handleCreateChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: `New Chat ${chats.length + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'mock-user-1'
    }
    
    setChats([newChat, ...chats])
    setMessages({ ...messages, [newChat.id]: [] })
    setSelectedChatId(newChat.id)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!messageInput.trim() || !selectedChatId || isSending) return

    setIsSending(true)
    
    const userMessage = {
      id: Date.now().toString(),
      content: messageInput.trim(),
      role: 'user' as const,
      created_at: new Date().toISOString(),
      chat_id: selectedChatId,
      user_id: 'mock-user-1'
    }

    // Add user message
    const currentMessages = messages[selectedChatId] || []
    setMessages({
      ...messages,
      [selectedChatId]: [...currentMessages, userMessage]
    })

    setMessageInput('')

    // Simulate AI response after delay
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: `This is a mock AI response to: "${userMessage.content}". In the real app, this would come from OpenRouter via n8n!`,
        role: 'assistant' as const,
        created_at: new Date().toISOString(),
        chat_id: selectedChatId,
        user_id: 'mock-user-1'
      }

      setMessages(prev => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), botMessage]
      }))
      
      setIsSending(false)
    }, 1500)
  }

  const currentMessages = messages[selectedChatId] || []

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Chats (Demo)</h3>
          <button onClick={signOut} className="logout-btn">
            Logout
          </button>
        </div>
        
        <button onClick={handleCreateChat} className="new-chat-btn">
          + New Chat
        </button>

        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${selectedChatId === chat.id ? 'active' : ''}`}
              onClick={() => setSelectedChatId(chat.id)}
            >
              <div>{chat.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#bbb' }}>
                {new Date(chat.updated_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-content">
        <div className="chat-header">
          <h3>{chats.find(c => c.id === selectedChatId)?.title || 'Chat'}</h3>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            Demo Mode - Connect to Nhost for real functionality
          </div>
        </div>

        <div className="messages-container">
          {currentMessages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-bubble">
                {message.content}
              </div>
            </div>
          ))}
          
          {isSending && (
            <div className="message bot">
              <div className="message-bubble">
                <em>AI is thinking...</em>
              </div>
            </div>
          )}
        </div>

        <div className="message-input-container">
          <form onSubmit={handleSendMessage} className="message-input-form">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message... (Demo mode)"
              className="message-input"
              disabled={isSending}
            />
            <button 
              type="submit" 
              className="send-btn" 
              disabled={isSending || !messageInput.trim()}
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export { MockAuthPage, MockChatPage }
