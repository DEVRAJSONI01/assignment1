import { gql } from '@apollo/client'

// Chat queries and mutations
export const GET_CHATS = gql`
  query GetChats {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      user_id
    }
  }
`

export const GET_MESSAGES = gql`
  query GetMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      role
      created_at
      chat_id
      user_id
    }
  }
`

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!) {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at
      updated_at
      user_id
    }
  }
`

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($chatId: uuid!, $content: String!, $role: String!) {
    insert_messages_one(object: { 
      chat_id: $chatId, 
      content: $content, 
      role: $role 
    }) {
      id
      content
      role
      created_at
      chat_id
      user_id
    }
  }
`

export const SEND_MESSAGE_ACTION = gql`
  mutation SendMessage($chatId: uuid!, $message: String!) {
    sendMessage(chatId: $chatId, message: $message) {
      response
      success
      error
    }
  }
`

// Subscriptions for real-time updates
export const MESSAGES_SUBSCRIPTION = gql`
  subscription MessagesSubscription($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      role
      created_at
      chat_id
      user_id
    }
  }
`

export const CHATS_SUBSCRIPTION = gql`
  subscription ChatsSubscription {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      user_id
    }
  }
`
