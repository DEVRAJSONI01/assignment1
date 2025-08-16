import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { useSignOut, useUserData } from '@nhost/react'
import { 
  GET_CHATS, 
  GET_MESSAGES, 
  CREATE_CHAT, 
  CREATE_MESSAGE, 
  SEND_MESSAGE_ACTION,
  MESSAGES_SUBSCRIPTION,
  CHATS_SUBSCRIPTION
} from '../graphql/queries'

interface Chat {
  id: string
  title: string
  created_at: string
  updated_at: string
  user_id: string
}

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  created_at: string
  chat_id: string
  user_id: string
}

const ChatPage: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [isSending, setIsSending] = useState(false)

  const { signOut } = useSignOut()
  const userData = useUserData()

  // Queries and mutations
  const { data: chatsData, loading: chatsLoading } = useQuery(GET_CHATS)
  const { data: messagesData, loading: messagesLoading } = useQuery(GET_MESSAGES, {
    variables: { chatId: selectedChatId },
    skip: !selectedChatId
  })

  const [createChat] = useMutation(CREATE_CHAT, {
    refetchQueries: [{ query: GET_CHATS }]
  })

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    refetchQueries: [{ query: GET_MESSAGES, variables: { chatId: selectedChatId } }]
  })

  const [sendMessageAction] = useMutation(SEND_MESSAGE_ACTION)

  // Subscriptions for real-time updates
  useSubscription(CHATS_SUBSCRIPTION)
  useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { chatId: selectedChatId },
    skip: !selectedChatId
  })

  const chats: Chat[] = chatsData?.chats || []
  const messages: Message[] = messagesData?.messages || []

  // Auto-select first chat if none selected
  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id)
    }
  }, [chats, selectedChatId])

  const handleCreateChat = async () => {
    try {
      const result = await createChat({
        variables: {
          title: `Chat ${new Date().toLocaleDateString()}`
        }
      })
      
      if (result.data?.insert_chats_one) {
        setSelectedChatId(result.data.insert_chats_one.id)
      }
    } catch (error) {
      console.error('Error creating chat:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!messageInput.trim() || !selectedChatId || isSending) return

    setIsSending(true)
    
    try {
      // First, save the user message
      await createMessage({
        variables: {
          chatId: selectedChatId,
          content: messageInput.trim(),
          role: 'user'
        }
      })

      const userMessage = messageInput.trim()
      setMessageInput('')

      // Then trigger the chatbot action
      const actionResult = await sendMessageAction({
        variables: {
          chatId: selectedChatId,
          message: userMessage
        }
      })

      if (actionResult.data?.sendMessage?.success) {
        console.log('Message sent successfully')
      } else {
        console.error('Error from action:', actionResult.data?.sendMessage?.error)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleLogout = () => {
    signOut()
  }

  if (chatsLoading) {
    return <div className="loading">Loading chats...</div>
  }

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Chats</h3>
          <button onClick={handleLogout} className="logout-btn">
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
        {selectedChatId ? (
          <>
            <div className="chat-header">
              <h3>{chats.find(c => c.id === selectedChatId)?.title || 'Chat'}</h3>
            </div>

            <div className="messages-container">
              {messagesLoading ? (
                <div>Loading messages...</div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`message ${message.role}`}>
                    <div className="message-bubble">
                      {message.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="message-input-container">
              <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
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
          </>
        ) : (
          <div className="chat-content">
            <div className="messages-container">
              <div style={{ textAlign: 'center', marginTop: '2rem', color: '#666' }}>
                Select a chat or create a new one to start messaging
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
