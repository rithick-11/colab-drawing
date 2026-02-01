# Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [System Components](#system-components)
5. [Data Flow](#data-flow)
6. [Real-time Communication](#real-time-communication)
7. [State Management](#state-management)
8. [Design Patterns](#design-patterns)
9. [Security Considerations](#security-considerations)
10. [Performance Optimizations](#performance-optimizations)
11. [Scalability Considerations](#scalability-considerations)

---

## System Overview

The Real-Time Collaborative Drawing Canvas is a full-stack web application that enables multiple users to draw simultaneously on a shared canvas. The system is built on a client-server architecture with real-time bidirectional communication powered by WebSocket technology (Socket.io).

### Key Architectural Principles
- **Real-time First**: All interactions are designed for instant synchronization
- **Client Authority with Server Validation**: Clients perform optimistic updates while server maintains authoritative state
- **Event-Driven Architecture**: Communication based on discrete events
- **Stateful Server**: Server maintains room/channel state in memory
- **Component-Based UI**: Modular React components for maintainability

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Browser    │  │   Browser    │  │   Browser    │         │
│  │   (User 1)   │  │   (User 2)   │  │   (User N)   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│  ┌──────▼──────────────────▼──────────────────▼───────┐        │
│  │           React Application (Vite)                  │        │
│  ├─────────────────────────────────────────────────────┤        │
│  │  Components Layer                                   │        │
│  │  ├── Home (Landing Page)                            │        │
│  │  ├── Canvaschannel (Main Canvas)                    │        │
│  │  │   ├── ToolBar                                    │        │
│  │  │   ├── UserCard                                   │        │
│  │  │   ├── ChannelInfo                                │        │
│  │  │   ├── RemoteMouseMove                            │        │
│  │  │   └── ChatBox                                    │        │
│  ├─────────────────────────────────────────────────────┤        │
│  │  State Management (Zustand)                         │        │
│  │  ├── Socket Connection State                        │        │
│  │  ├── Drawing Tools State                            │        │
│  │  ├── User State                                     │        │
│  │  └── Whiteboard Actions                             │        │
│  ├─────────────────────────────────────────────────────┤        │
│  │  Socket.io Client                                   │        │
│  │  └── WebSocket Connection Handler                   │        │
│  └─────────────────────────────────────────────────────┘        │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           │ WebSocket (Socket.io)
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                       Server Layer                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │             Express + Socket.io Server                    │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │  HTTP Server                                              │ │
│  │  └── Health Check Endpoint                               │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │  Socket.io Event Handlers                                │ │
│  │  ├── Connection/Disconnection                            │ │
│  │  ├── Channel Management (join-channel)                   │ │
│  │  ├── Drawing Events (start_drawing, add-board-action)    │ │
│  │  ├── Mouse Tracking (mouse_move)                         │ │
│  │  ├── History Management (undo-action, redo-action)       │ │
│  │  └── Chat (send-message)                                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                          │                                       │
│  ┌───────────────────────▼───────────────────────────────────┐ │
│  │               Room Management Layer                       │ │
│  │               (rooms.js)                                  │ │
│  │  ├── joinChannel()                                        │ │
│  │  ├── onUserDisconnect()                                   │ │
│  │  ├── onMouseMove()                                        │ │
│  │  ├── onAddBoardAction()                                   │ │
│  │  ├── onUndoAction()                                       │ │
│  │  └── onRedoAction()                                       │ │
│  └───────────────────────┬───────────────────────────────────┘ │
│                          │                                       │
│  ┌───────────────────────▼───────────────────────────────────┐ │
│  │            State Management Layer                         │ │
│  │            (roomState.js)                                 │ │
│  │                                                           │ │
│  │  Channel Class:                                           │ │
│  │  ├── channelId                                            │ │
│  │  ├── users[] (id, username, color, pos)                  │ │
│  │  ├── messages[]                                           │ │
│  │  ├── whiteBoardActions[] (drawing history)               │ │
│  │  └── undoStack[] (redo functionality)                    │ │
│  │                                                           │ │
│  │  Global State:                                            │ │
│  │  └── channels{} (in-memory storage)                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework for building component-based interface |
| Vite | 7.2.4 | Build tool providing fast HMR and optimized production builds |
| Tailwind CSS | 4.1.18 | Utility-first CSS framework for responsive design |
| Socket.io Client | 4.8.3 | WebSocket client for real-time communication |
| Zustand | 5.0.10 | Lightweight state management with minimal boilerplate |
| React Router DOM | 7.13.0 | Client-side routing for SPA navigation |
| Nanoid | 5.1.6 | Unique ID generation for channel creation |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | - | JavaScript runtime for server-side execution |
| Express | 5.2.1 | Web application framework for HTTP server |
| Socket.io | 4.8.3 | WebSocket server for bidirectional real-time communication |
| CORS | 2.8.6 | Enable cross-origin resource sharing |
| Randomcolor | 0.6.2 | Generate random colors for user cursors |
| Unique Names Generator | 4.7.1 | Generate unique usernames |

### Development Tools

- **ESLint**: Code linting for JavaScript/React
- **Nodemon**: Auto-restart server during development
- **dotenv**: Environment variable management

---

## System Components

### Frontend Components

#### 1. **App.jsx**
- **Purpose**: Root component and route configuration
- **Routes**:
  - `/` - Home page (room creation/joining)
  - `/canva/:channelId` - Canvas page with drawing interface
- **Technologies**: React Router DOM

#### 2. **Pages**

##### Home.jsx
- **Purpose**: Landing page for creating or joining channels
- **Features**:
  - Create new channel with auto-generated ID
  - Join existing channel with channel ID
  - Username input
  - Invite mode for direct channel links
- **State**: Local component state for form handling

##### Canvaschannel.jsx
- **Purpose**: Main canvas page with drawing functionality
- **Key Features**:
  - Canvas initialization and resize handling
  - Drawing event handlers (mouseDown, mouseMove, mouseUp)
  - Socket event listeners
  - Real-time drawing synchronization
  - Stroke rendering engine
- **Dependencies**:
  - useSocketStore for global state
  - Socket.io client for communication
  - Canvas API for rendering

#### 3. **Components**

##### ToolBar.jsx
- **Purpose**: Drawing tools and controls interface
- **Features**:
  - Tool selection (brush, line, eraser)
  - Color palette (8 colors)
  - Brush size slider (2-100px)
  - Undo/Redo buttons
- **State Integration**: Connected to Zustand store for tool state

##### UserCard.jsx
- **Purpose**: Display connected users
- **Features**:
  - User list with names and colors
  - Online status indicators
  - User count display

##### ChannelInfo.jsx
- **Purpose**: Display channel information
- **Features**:
  - Channel ID display
  - Copy to clipboard functionality
  - Share link generation

##### RemoteMouseMove.jsx
- **Purpose**: Render remote users' cursors
- **Features**:
  - Real-time cursor position updates
  - User name labels
  - Color-coded cursors
- **Implementation**: Absolutely positioned elements tracking mouse coordinates

##### ChatBox.jsx
- **Purpose**: Chat interface (ready for implementation)
- **Current State**: Component structure exists, pending feature implementation

#### 4. **State Management (useSocketStore.js)**

**Zustand Store Schema**:
```javascript
{
  // Connection state
  isConnected: boolean,
  channelId: string | null,
  
  // User data
  user: { name: string, color: string, id: string },
  users: Array<User>,
  
  // Drawing state
  tool: 'brush' | 'line' | 'eraser',
  bruseSize: number,
  brushColor: string,
  whiteBoardActions: Array<Array<Stroke>>,
  
  // Messages
  messages: Array<Message>
}
```

**Key Actions**:
- `connect()`: Initialize socket connection
- `joinChannel()`: Join a drawing channel
- `setCurrenChannelState()`: Update channel state from server
- `setBruseSize()`, `setBrushColor()`, `setTool()`: Update drawing tools
- `onSendMessage()`: Send chat messages

#### 5. **Socket Client (socket.js)**

**Configuration**:
```javascript
{
  url: process.env.VITE_SOCKET_URL,
  options: {
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  }
}
```

### Backend Components

#### 1. **Server.js**
- **Purpose**: Main server file, HTTP + WebSocket setup
- **Responsibilities**:
  - Express server initialization
  - Socket.io server setup
  - CORS configuration
  - Event handler registration
  - Health check endpoint

#### 2. **rooms.js**
- **Purpose**: Channel/room management logic
- **Functions**:
  
  **joinChannel(socket, channelId, username)**
  - Creates channel if doesn't exist
  - Adds user to channel
  - Emits channel state to joining user
  - Broadcasts new user to existing members
  
  **onUserDisconnect(socket)**
  - Removes user from channel
  - Broadcasts updated state
  - Cleanup socket room
  
  **onMouseMove(socket, pos)**
  - Updates user position in channel state
  - Broadcasts position to other users
  
  **onAddBoardAction(socket, action)**
  - Adds complete drawing action to history
  - Stored in channel's whiteBoardActions array
  
  **onUndoAction(socket)**
  - Pops last action from whiteBoardActions
  - Pushes to undoStack
  - Broadcasts updated state to all users
  
  **onRedoAction(socket)**
  - Pops from undoStack
  - Pushes back to whiteBoardActions
  - Broadcasts updated state

#### 3. **roomState.js**
- **Purpose**: Channel state class definition and global storage

**Channel Class**:
```javascript
class Channel {
  channelId: string
  messages: Array<Message>
  users: Array<{
    id: string,
    name: string,
    color: string,
    pos: {x: number, y: number}
  }>
  whiteBoardActions: Array<Array<Stroke>>
  undoStack: Array<Array<Stroke>>
  
  methods:
    onNewUser(userId, username)
    onUserDisconnect(userId)
    onMouseMove(userId, pos)
    onAddNewAction(action)
    onUndoAction()
    onRedoAction()
}
```

**Global State**:
```javascript
channels = {
  [channelId]: Channel instance
}
```

#### 4. **utils.js**
- **Purpose**: Utility functions
- **Functions**:
  - `generateUser(username)`: Creates user object with random color

---

## Data Flow

### 1. Channel Creation & Joining Flow

```
Client                          Server                    State
  │                              │                          │
  │  1. Generate channelId       │                          │
  │     (nanoid)                 │                          │
  │                              │                          │
  │  2. emit('join-channel')     │                          │
  ├─────────────────────────────>│                          │
  │                              │                          │
  │                              │  3. Check if channel     │
  │                              │     exists               │
  │                              ├─────────────────────────>│
  │                              │                          │
  │                              │  4. Create new Channel   │
  │                              │     or get existing      │
  │                              │<─────────────────────────┤
  │                              │                          │
  │                              │  5. Add user to channel  │
  │                              ├─────────────────────────>│
  │                              │                          │
  │  6. on('after_join_channel') │                          │
  │<─────────────────────────────┤                          │
  │     (channelState + user)    │                          │
  │                              │                          │
  │  7. Update local state       │                          │
  │     with channel data        │                          │
  │                              │                          │
  │                              │  8. broadcast to others  │
  │                              │     'joined-new-user'    │
  │                              │                          │
```

### 2. Drawing Flow

```
User 1 (Client)            Server                User 2 (Client)
     │                       │                         │
     │  1. Mouse down        │                         │
     │     Start drawing     │                         │
     │                       │                         │
     │  2. Mouse move        │                         │
     │     Calculate stroke  │                         │
     │     Draw locally      │                         │
     │                       │                         │
     │  3. emit              │                         │
     │    'start_drawing'    │                         │
     ├──────────────────────>│                         │
     │    {stroke data}      │                         │
     │                       │                         │
     │                       │  4. broadcast           │
     │                       │    'someone_drawing'    │
     │                       ├────────────────────────>│
     │                       │    {stroke data}        │
     │                       │                         │
     │                       │                         │  5. Receive stroke
     │                       │                         │     Draw on canvas
     │                       │                         │
     │  6. Mouse up          │                         │
     │     End drawing       │                         │
     │                       │                         │
     │  7. emit              │                         │
     │   'add-board-action'  │                         │
     ├──────────────────────>│                         │
     │   {complete action}   │                         │
     │                       │                         │
     │                       │  8. Store in            │
     │                       │     whiteBoardActions   │
     │                       │                         │
```

### 3. Undo/Redo Flow

```
Client                          Server                    State
  │                              │                          │
  │  1. Click undo button        │                          │
  │                              │                          │
  │  2. emit('undo-action')      │                          │
  ├─────────────────────────────>│                          │
  │                              │                          │
  │                              │  3. Pop from             │
  │                              │     whiteBoardActions    │
  │                              ├─────────────────────────>│
  │                              │                          │
  │                              │  4. Push to undoStack    │
  │                              ├─────────────────────────>│
  │                              │                          │
  │  5. on('on-undo-redo')       │                          │
  │<─────────────────────────────┤                          │
  │     (updated channel state)  │                          │
  │                              │                          │
  │  6. Redraw entire canvas     │                          │
  │     with remaining actions   │                          │
  │                              │                          │
  │                              │  7. broadcast to all     │
  │                              │     'on-undo-redo'       │
  │                              │                          │
```

### 4. Mouse Movement Tracking Flow

```
User 1                    Server                  User 2
  │                         │                        │
  │  1. Mouse move          │                        │
  │     Get coordinates     │                        │
  │                         │                        │
  │  2. emit                │                        │
  │    'mouse_move'         │                        │
  ├────────────────────────>│                        │
  │    {pos: {x, y}}        │                        │
  │                         │                        │
  │                         │  3. Update user pos    │
  │                         │     in channel state   │
  │                         │                        │
  │                         │  4. broadcast          │
  │                         │  'on-remote-user-      │
  │                         │   mouse-move'          │
  │                         ├───────────────────────>│
  │                         │  {current state}       │
  │                         │                        │
  │                         │                        │  5. Update remote
  │                         │                        │     cursor position
  │                         │                        │
```

---

## Real-time Communication

### Socket.io Event System

**Client Events (Emit)**:

| Event Name | Payload | Purpose |
|------------|---------|---------|
| `join-channel` | `{channelId, username}` | Join a drawing channel |
| `send-message` | `{channelId, message}` | Send chat message |
| `mouse_move` | `{channelId, pos, id}` | Update cursor position |
| `start_drawing` | `{channelId, ...stroke}` | Real-time drawing stroke |
| `add-board-action` | `action[]` | Complete drawing action |
| `undo-action` | - | Request undo |
| `redo-action` | - | Request redo |

**Server Events (Listen)**:

| Event Name | Payload | Purpose |
|------------|---------|---------|
| `after_join_channel` | `{channelState, user}` | Confirm join with state |
| `joined-new-user` | `{channelState, newUser}` | New user joined |
| `user-disconnected` | `{current_channel_state, user}` | User left |
| `receive-message` | `message` | Chat message received |
| `someone_drawing` | `stroke` | Remote drawing stroke |
| `on-remote-user-mouse-move` | `channelState` | Remote cursor update |
| `on-undo-redo` | `channelState` | Undo/redo sync |

### WebSocket Connection Management

**Connection Strategy**:
- **Manual Connection**: `autoConnect: false` - controlled by application
- **Reconnection Logic**: Automatic with exponential backoff
- **Reconnection Attempts**: 5 attempts before giving up
- **Reconnection Delay**: 1000ms initial delay

**Connection Lifecycle**:
1. User navigates to canvas page
2. `connect()` called in useEffect
3. Socket connection established
4. `join-channel` event emitted
5. Server confirms and sends state
6. User can start drawing
7. On disconnect, automatic reconnection attempts
8. On permanent disconnect, user redirected to home

---

## State Management

### Client-Side State (Zustand)

**Why Zustand?**
- Lightweight (< 1KB)
- No boilerplate compared to Redux
- React hooks API
- Simple and intuitive
- No Context Provider needed

**State Structure**:
```javascript
{
  // Connection management
  isConnected: false,
  channelId: null,
  
  // User information
  user: {name: "Loading"},
  users: [],
  
  // Drawing tools
  tool: 'brush',
  bruseSize: 2,
  brushColor: 'black',
  
  // Drawing history
  whiteBoardActions: [],
  
  // Chat
  messages: []
}
```

**Action Patterns**:
- **Direct State Update**: For local tool changes
- **Socket Emit + Wait**: For collaborative actions
- **Socket Listen + Update**: For remote updates

### Server-Side State (In-Memory)

**Channel State Management**:
```javascript
channels = {
  'channel-abc-123': {
    channelId: 'channel-abc-123',
    users: [
      {id: 'socket-1', name: 'Alice', color: '#ff0000', pos: {x: 100, y: 50}},
      {id: 'socket-2', name: 'Bob', color: '#00ff00', pos: {x: 200, y: 150}}
    ],
    messages: [],
    whiteBoardActions: [
      [{lastPos: {x:0, y:0}, currentPos: {x:10, y:10}, ...}],
      [{lastPos: {x:10, y:10}, currentPos: {x:20, y:15}, ...}]
    ],
    undoStack: []
  }
}
```

**State Persistence**:
- **Current Implementation**: In-memory (resets on server restart)
- **Future Enhancement**: Database persistence (MongoDB, Redis)
- **Lifecycle**: Created on first join, exists until server restart

---

## Design Patterns

### 1. **Observer Pattern**
**Implementation**: Socket.io event system
```javascript
// Publisher (Server)
socket.emit('user-joined', userData)

// Subscribers (Clients)
socket.on('user-joined', (userData) => {
  // Handle user joined
})
```

### 2. **Singleton Pattern**
**Implementation**: Socket instance
```javascript
// socket.js
const socket = io(SOCKET_URL, options)
export { socket } // Single instance shared across app
```

### 3. **Factory Pattern**
**Implementation**: Channel creation
```javascript
class Channel {
  constructor(channelId) {
    this.channelId = channelId
    // Initialize with defaults
  }
}

// Factory
if (!channels[channelId]) {
  channels[channelId] = new Channel(channelId)
}
```

### 4. **Command Pattern**
**Implementation**: Drawing actions
```javascript
// Each drawing action is a command object
const action = [
  {
    type: 'stroke',
    lastPos: {x: 0, y: 0},
    currentPos: {x: 10, y: 10},
    bruseSize: 2,
    brushColor: 'black',
    tool: 'brush'
  }
]

// Can be undone/redone
onUndoAction() // Pop from actions, push to undo
onRedoAction() // Pop from undo, push to actions
```

### 5. **State Pattern**
**Implementation**: Tool selection
```javascript
const useSocketStore = create((set) => ({
  tool: 'brush',
  setTool: (tool) => set({tool})
}))

// Tool behavior changes based on state
if (tool === 'eraser') {
  ctx.strokeStyle = 'white'
} else {
  ctx.strokeStyle = brushColor
}
```

### 6. **Mediator Pattern**
**Implementation**: Server as mediator
```javascript
// Server mediates all client communication
socket.on('start_drawing', (data) => {
  // Validate and broadcast to others
  socket.to(channelId).emit('someone_drawing', data)
})
```

---

## Security Considerations

### Current Implementation

#### 1. **CORS Configuration**
```javascript
cors: {
  origin: "*",  // ⚠️ Currently allows all origins
  methods: ["GET", "POST"]
}
```
**Security Note**: Should be restricted to specific domains in production

#### 2. **Input Validation**
- **Missing**: No validation on drawing data
- **Missing**: No sanitization of usernames
- **Missing**: No rate limiting on socket events

#### 3. **Channel Access**
- **Current**: Anyone with channel ID can join
- **No Authentication**: No user verification
- **No Authorization**: No permission system

### Recommended Security Enhancements

#### 1. **CORS Restriction**
```javascript
cors: {
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true
}
```

#### 2. **Input Validation**
```javascript
// Validate drawing coordinates
if (typeof x !== 'number' || typeof y !== 'number') {
  return // Reject invalid data
}

// Sanitize username
const sanitizedUsername = username.trim().substring(0, 20)
```

#### 3. **Rate Limiting**
```javascript
// Limit drawing events per second
const drawingRateLimit = new Map()
socket.on('start_drawing', (data) => {
  const lastDraw = drawingRateLimit.get(socket.id)
  if (lastDraw && Date.now() - lastDraw < 10) {
    return // Too many requests
  }
  drawingRateLimit.set(socket.id, Date.now())
  // Process drawing
})
```

#### 4. **Channel Access Control**
```javascript
// Add password protection
channels[channelId] = {
  ...channelState,
  password: hashedPassword,
  owner: ownerId
}
```

#### 5. **XSS Prevention**
- Sanitize all user inputs (usernames, chat messages)
- Use Content Security Policy headers
- Escape HTML in rendering

---

## Performance Optimizations

### Current Optimizations

#### 1. **Throttled Mouse Events**
Drawing strokes are sent on every mousemove, but canvas updates are handled by browser's RAF

#### 2. **Canvas Rendering**
- Direct Canvas API usage (faster than SVG for drawing)
- Line strokes instead of individual pixels

#### 3. **State Updates**
- Zustand for efficient React re-renders
- Selective state updates (only changed properties)

#### 4. **Socket Broadcast**
```javascript
socket.to(channelId).emit() // Excludes sender
```
Prevents echo of user's own actions

### Recommended Performance Improvements

#### 1. **Throttle Mouse Movement**
```javascript
import { throttle } from 'lodash'

const throttledMouseMove = throttle((pos) => {
  socket.emit('mouse_move', {channelId, pos})
}, 50) // Max 20 updates per second
```

#### 2. **Canvas Optimization**
```javascript
// Use offscreen canvas for better performance
const offscreen = new OffscreenCanvas(width, height)
const ctx = offscreen.getContext('2d', {
  alpha: false, // Disable alpha for solid backgrounds
  desynchronized: true // Reduce latency
})
```

#### 3. **Batch Drawing Actions**
```javascript
// Instead of emitting every stroke segment
const batchedStrokes = []
setInterval(() => {
  if (batchedStrokes.length > 0) {
    socket.emit('batch_strokes', batchedStrokes)
    batchedStrokes.length = 0
  }
}, 50)
```

#### 4. **Compression**
```javascript
// Use Socket.io compression
io.use(compression())
```

#### 5. **Delta Updates**
Instead of sending entire channel state, send only changes:
```javascript
// Before
emit('on-undo-redo', entireChannelState)

// After
emit('whiteboard-update', {
  type: 'undo',
  actionIndex: lastIndex,
  newLength: actions.length
})
```

---

## Scalability Considerations

### Current Limitations

#### 1. **In-Memory State**
- State lost on server restart
- Limited by server RAM
- No horizontal scaling support

#### 2. **Single Server**
- All connections to one server
- No load balancing
- Single point of failure

#### 3. **No Persistence**
- Drawings not saved
- Chat history lost
- User data ephemeral

### Scaling Solutions

#### 1. **State Persistence**

**Redis for Session State**:
```javascript
const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_URL)

// Store channel state
await redis.set(
  `channel:${channelId}`,
  JSON.stringify(channelState),
  'EX',
  3600 // 1 hour expiry
)

// Retrieve on join
const savedState = await redis.get(`channel:${channelId}`)
```

**MongoDB for Drawings**:
```javascript
const drawingSchema = new Schema({
  channelId: String,
  actions: [[{
    lastPos: {x: Number, y: Number},
    currentPos: {x: Number, y: Number},
    bruseSize: Number,
    brushColor: String,
    tool: String
  }]],
  createdAt: Date,
  updatedAt: Date
})
```

#### 2. **Horizontal Scaling**

**Socket.io with Redis Adapter**:
```javascript
const { createAdapter } = require('@socket.io/redis-adapter')
const { createClient } = require('redis')

const pubClient = createClient({url: REDIS_URL})
const subClient = pubClient.duplicate()

io.adapter(createAdapter(pubClient, subClient))
```

**Architecture**:
```
                    Load Balancer
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
    Server 1         Server 2         Server 3
        │                │                │
        └────────────────┼────────────────┘
                         │
                    Redis PubSub
                         │
                    Redis Cache
                         │
                      MongoDB
```

#### 3. **CDN for Static Assets**
- Host client build on Vercel/Netlify
- Serve assets from CDN
- Reduce server load

#### 4. **Database Optimization**

**Indexes**:
```javascript
// MongoDB indexes for fast queries
drawingSchema.index({channelId: 1})
drawingSchema.index({createdAt: -1})
drawingSchema.index({channelId: 1, updatedAt: -1})
```

**Connection Pooling**:
```javascript
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 50,
  minPoolSize: 10
})
```

#### 5. **Caching Strategy**

**Multi-Layer Cache**:
```
Client          Redis           Database
Browser  →  In-Memory  →  Redis  →  MongoDB
```

**Implementation**:
```javascript
async function getChannelState(channelId) {
  // 1. Check in-memory
  if (channels[channelId]) return channels[channelId]
  
  // 2. Check Redis
  const cached = await redis.get(`channel:${channelId}`)
  if (cached) {
    channels[channelId] = JSON.parse(cached)
    return channels[channelId]
  }
  
  // 3. Check MongoDB
  const saved = await Drawing.findOne({channelId})
  if (saved) {
    const state = createChannelFromDrawing(saved)
    await redis.set(`channel:${channelId}`, JSON.stringify(state))
    channels[channelId] = state
    return state
  }
  
  // 4. Create new
  return createNewChannel(channelId)
}
```

#### 6. **WebSocket Load Balancing**

**Sticky Sessions**:
```javascript
// nginx.conf
upstream socket_nodes {
  ip_hash; // Sticky sessions
  server 127.0.0.1:3001;
  server 127.0.0.1:3002;
  server 127.0.0.1:3003;
}
```

#### 7. **Monitoring & Metrics**

**Implement Monitoring**:
```javascript
const prometheus = require('prom-client')

const connectionGauge = new prometheus.Gauge({
  name: 'websocket_connections',
  help: 'Number of active WebSocket connections'
})

io.on('connection', (socket) => {
  connectionGauge.inc()
  socket.on('disconnect', () => {
    connectionGauge.dec()
  })
})
```

---

## Deployment Architecture

### Current Deployment

**Client**: Vercel (Static Hosting)
```
Client Build (Vite) → Vercel CDN → Users
```

**Server**: Should be deployed on:
- Heroku
- Railway
- DigitalOcean
- AWS EC2/ECS

### Production-Ready Deployment

```
┌─────────────────────────────────────────────────────────┐
│                        Users                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
              ┌──────────────┐
              │     CDN      │
              │  (Cloudflare)│
              └──────┬───────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌────────────────┐      ┌────────────────┐
│  Static Assets │      │   API Gateway  │
│   (Vercel)     │      │  (nginx/ALB)   │
└────────────────┘      └────────┬───────┘
                                 │
                     ┌───────────┴───────────┐
                     ▼                       ▼
            ┌─────────────────┐    ┌─────────────────┐
            │  Socket Server  │    │  Socket Server  │
            │   (Node.js)     │    │   (Node.js)     │
            └────────┬────────┘    └────────┬────────┘
                     │                       │
                     └───────────┬───────────┘
                                 │
                     ┌───────────┴───────────┐
                     ▼                       ▼
              ┌────────────┐         ┌────────────┐
              │   Redis    │         │  MongoDB   │
              │  (Session) │         │ (Storage)  │
              └────────────┘         └────────────┘
```

### Environment Configuration

**Client (.env)**:
```env
VITE_SOCKET_URL=https://api.yourapp.com
VITE_API_URL=https://api.yourapp.com
```

**Server (.env)**:
```env
NODE_ENV=production
PORT=3211
REDIS_URL=redis://your-redis-server:6379
MONGODB_URI=mongodb://your-mongo-server/colab-drawing
CORS_ORIGIN=https://yourapp.com
```

---

## Testing Strategy

### Recommended Testing Approach

#### 1. **Unit Tests**
```javascript
// Example: Test undo/redo logic
describe('Channel.onUndoAction', () => {
  it('should move last action to undo stack', () => {
    const channel = new Channel('test-123')
    const action = [{stroke: 'data'}]
    channel.whiteBoardActions.push(action)
    
    channel.onUndoAction()
    
    expect(channel.whiteBoardActions.length).toBe(0)
    expect(channel.undoStack.length).toBe(1)
    expect(channel.undoStack[0]).toEqual(action)
  })
})
```

#### 2. **Integration Tests**
```javascript
// Example: Test socket events
describe('Socket Events', () => {
  it('should broadcast drawing to other users', (done) => {
    const user1 = io('http://localhost:3211')
    const user2 = io('http://localhost:3211')
    
    user1.emit('join-channel', {channelId: 'test', username: 'User1'})
    user2.emit('join-channel', {channelId: 'test', username: 'User2'})
    
    user2.on('someone_drawing', (stroke) => {
      expect(stroke).toBeDefined()
      done()
    })
    
    user1.emit('start_drawing', {
      channelId: 'test',
      lastPos: {x: 0, y: 0},
      currentPos: {x: 10, y: 10}
    })
  })
})
```

#### 3. **E2E Tests**
```javascript
// Example: Cypress test
describe('Drawing Canvas', () => {
  it('should allow user to draw', () => {
    cy.visit('/')
    cy.contains('Create Room').click()
    cy.get('input[placeholder="Enter your name"]').type('TestUser')
    cy.contains('Start Drawing').click()
    
    cy.get('canvas')
      .trigger('mousedown', {clientX: 100, clientY: 100})
      .trigger('mousemove', {clientX: 200, clientY: 200})
      .trigger('mouseup')
    
    // Verify drawing exists
    cy.get('canvas').should('have.been.drawn')
  })
})
```

---

## Future Improvements

### Technical Enhancements
1. **WebRTC for P2P**: Reduce server load for large strokes
2. **CRDT for Conflict Resolution**: Better collaborative editing
3. **Service Workers**: Offline support
4. **WebAssembly**: Performance-critical rendering
5. **GraphQL Subscriptions**: Alternative to Socket.io

### Feature Enhancements
1. **Layers System**: Multiple drawing layers
2. **Vector Tools**: Shapes, text, images
3. **Export/Import**: Save/load drawings
4. **Permissions**: Role-based access control
5. **History Timeline**: Visual undo/redo history
6. **Templates**: Preset canvas templates
7. **Real-time Video Chat**: WebRTC integration
8. **Mobile App**: React Native version

---

## Conclusion

This architecture provides a solid foundation for a real-time collaborative drawing application. The modular design allows for easy extensions and improvements while maintaining performance and user experience. The suggested scalability improvements will enable the application to handle production workloads effectively.
