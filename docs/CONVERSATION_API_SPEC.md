# Conversation API Specification

This document specifies the backend API endpoints needed for multi-conversation support.

## Database Schema

Add a `conversations` table to your backend:

```python
# conversations.py or add to your models
CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('standard', 'eos')),
    title TEXT NOT NULL DEFAULT 'New Chat',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message_count INTEGER DEFAULT 0,
    preview TEXT
);

# Update your messages table to include conversation_id
ALTER TABLE messages ADD COLUMN conversation_id TEXT REFERENCES conversations(id);
```

## API Endpoints

### 1. List Conversations
**GET** `/conversations?user_id={userId}&mode={mode}`

Returns all conversations for a user, sorted by most recent first.

**Response:**
```json
{
  "success": true,
  "conversations": [
    {
      "id": "conv_1234567_abc123",
      "title": "Discussion about consciousness",
      "mode": "eos",
      "userId": "Shawn",
      "createdAt": "2026-01-24T10:00:00Z",
      "updatedAt": "2026-01-24T10:30:00Z",
      "messageCount": 12,
      "preview": "Let's explore the nature of awareness..."
    }
  ]
}
```

### 2. Create Conversation
**POST** `/conversations`

Creates a new conversation.

**Request:**
```json
{
  "user_id": "Shawn",
  "mode": "eos",
  "title": "New Chat"
}
```

**Response:**
```json
{
  "success": true,
  "conversation": {
    "id": "conv_1234567_abc123",
    "title": "New Chat",
    "mode": "eos",
    "userId": "Shawn",
    "createdAt": "2026-01-24T10:00:00Z",
    "updatedAt": "2026-01-24T10:00:00Z",
    "messageCount": 0,
    "preview": null
  }
}
```

### 3. Get Conversation Messages
**GET** `/conversations/{conversationId}/messages`

Returns all messages for a specific conversation.

**Response:**
```json
{
  "success": true,
  "conversation": { /* conversation object */ },
  "messages": [
    {
      "id": "msg_123",
      "conversationId": "conv_1234567_abc123",
      "role": "user",
      "content": "Hello!",
      "timestamp": "2026-01-24T10:00:00Z"
    },
    {
      "id": "msg_124",
      "conversationId": "conv_1234567_abc123",
      "role": "assistant", 
      "content": "Hello! I remember you...",
      "timestamp": "2026-01-24T10:00:05Z"
    }
  ]
}
```

### 4. Delete Conversation
**DELETE** `/conversations/{conversationId}`

Deletes a conversation and all its messages.

**Response:**
```json
{
  "success": true
}
```

### 5. Update Conversation
**PATCH** `/conversations/{conversationId}`

Updates conversation metadata (title, etc.).

**Request:**
```json
{
  "title": "My renamed conversation"
}
```

**Response:**
```json
{
  "success": true,
  "conversation": { /* updated conversation object */ }
}
```

## Updating Existing Chat Endpoint

Your existing `/chat` endpoint needs to accept an optional `conversation_id`:

**POST** `/chat`

**Request (updated):**
```json
{
  "message": "Hello!",
  "user_id": "Shawn",
  "mode": "eos",
  "conversation_id": "conv_1234567_abc123"  // NEW - optional
}
```

When `conversation_id` is provided:
1. Store the message in that conversation
2. Update the conversation's `updated_at` and `message_count`
3. Update the conversation's `preview` with the user's message

When `conversation_id` is NOT provided (backward compatibility):
- Use the legacy behavior (single conversation per user)

## Flask Implementation Example

```python
from flask import Flask, request, jsonify
from datetime import datetime
import uuid

app = Flask(__name__)

# In-memory storage (replace with your actual database)
conversations = {}
messages = {}

@app.route('/conversations', methods=['GET'])
def list_conversations():
    user_id = request.args.get('user_id')
    mode = request.args.get('mode')
    
    user_convs = [
        c for c in conversations.values()
        if c['userId'] == user_id and c['mode'] == mode
    ]
    
    # Sort by updatedAt descending
    user_convs.sort(key=lambda x: x['updatedAt'], reverse=True)
    
    return jsonify({
        'success': True,
        'conversations': user_convs
    })

@app.route('/conversations', methods=['POST'])
def create_conversation():
    data = request.json
    conv_id = f"conv_{int(datetime.now().timestamp())}_{uuid.uuid4().hex[:7]}"
    
    conversation = {
        'id': conv_id,
        'title': data.get('title', 'New Chat'),
        'mode': data['mode'],
        'userId': data['user_id'],
        'createdAt': datetime.now().isoformat() + 'Z',
        'updatedAt': datetime.now().isoformat() + 'Z',
        'messageCount': 0,
        'preview': None
    }
    
    conversations[conv_id] = conversation
    
    return jsonify({
        'success': True,
        'conversation': conversation
    })

@app.route('/conversations/<conv_id>/messages', methods=['GET'])
def get_conversation_messages(conv_id):
    if conv_id not in conversations:
        return jsonify({'success': False, 'error': 'Conversation not found'}), 404
    
    conv_messages = [
        m for m in messages.values()
        if m['conversationId'] == conv_id
    ]
    conv_messages.sort(key=lambda x: x['timestamp'])
    
    return jsonify({
        'success': True,
        'conversation': conversations[conv_id],
        'messages': conv_messages
    })

@app.route('/conversations/<conv_id>', methods=['DELETE'])
def delete_conversation(conv_id):
    if conv_id in conversations:
        del conversations[conv_id]
        # Also delete related messages
        global messages
        messages = {k: v for k, v in messages.items() if v['conversationId'] != conv_id}
    
    return jsonify({'success': True})

@app.route('/conversations/<conv_id>', methods=['PATCH'])
def update_conversation(conv_id):
    if conv_id not in conversations:
        return jsonify({'success': False, 'error': 'Conversation not found'}), 404
    
    data = request.json
    if 'title' in data:
        conversations[conv_id]['title'] = data['title']
    
    conversations[conv_id]['updatedAt'] = datetime.now().isoformat() + 'Z'
    
    return jsonify({
        'success': True,
        'conversation': conversations[conv_id]
    })
```

## Migration Path

1. **Phase 1**: Add the new endpoints to your Flask backend
2. **Phase 2**: The frontend will automatically detect if conversations are supported
3. **Phase 3**: Migrate existing messages to conversations (optional)

The frontend is designed to gracefully fall back to the legacy single-conversation mode if these endpoints are not available.
