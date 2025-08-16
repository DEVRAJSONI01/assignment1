# Hasura Permissions Configuration

## Chats Table Permissions

### For user role:

#### Select Permission:
```json
{
  "filter": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  },
  "allow_aggregations": false
}
```

#### Insert Permission:
```json
{
  "check": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  },
  "columns": ["title"],
  "set": {
    "user_id": "X-Hasura-User-Id"
  }
}
```

#### Update Permission:
```json
{
  "filter": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  },
  "check": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  },
  "columns": ["title"]
}
```

#### Delete Permission:
```json
{
  "filter": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  }
}
```

## Messages Table Permissions

### For user role:

#### Select Permission:
```json
{
  "filter": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  },
  "allow_aggregations": false
}
```

#### Insert Permission:
```json
{
  "check": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    },
    "chat": {
      "user_id": {
        "_eq": "X-Hasura-User-Id"
      }
    }
  },
  "columns": ["chat_id", "content", "role"],
  "set": {
    "user_id": "X-Hasura-User-Id"
  }
}
```

#### Update Permission:
```json
{
  "filter": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  },
  "check": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  },
  "columns": ["content"]
}
```

#### Delete Permission:
```json
{
  "filter": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  }
}
```

## Relationships

### Chats table:
- messages: Array relationship with messages table on `chats.id = messages.chat_id`

### Messages table:
- chat: Object relationship with chats table on `messages.chat_id = chats.id`
