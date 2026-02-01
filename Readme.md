# Real-Time Collaborative Drawing Canvas

A real-time collaborative drawing application that allows multiple users to draw together on a shared canvas. Built with React, Socket.io, and Node.js, this application enables seamless collaboration with features like real-time cursor tracking, drawing synchronization, and undo/redo functionality.

🔗 **Live Demo:** [https://colab-drawing.vercel.app](https://colab-drawing.vercel.app)

## ✨ Features

### Core Functionality
- **Real-time Collaboration**: Multiple users can draw simultaneously on the same canvas
- **Live Cursor Tracking**: See other users' mouse positions in real-time with personalized cursors
- **Drawing Tools**:
  - Brush tool with customizable sizes
  - Eraser tool
  - Line drawing tool
- **Customization Options**:
  - Adjustable brush sizes (2-100px)
  - Multiple color options (black, red, green, blue, yellow, purple, orange, white)
  
### Advanced Features
- **Undo/Redo Support**: Full undo and redo functionality synchronized across all users
- **Channel-based Rooms**: Create or join drawing channels using unique channel IDs
- **User Management**: Automatic user identification with generated usernames and colors
- **Responsive Design**: Clean, modern UI built with Tailwind CSS
- **Real-time Synchronization**: All drawing actions are instantly synchronized across all connected users

### Technical Features
- **WebSocket Communication**: Powered by Socket.io for low-latency real-time updates
- **State Management**: Zustand for efficient client-side state management
- **Canvas API**: Native HTML5 Canvas for high-performance drawing
- **Channel State Persistence**: Server-side channel state management for joining users

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Socket.io Client 4.8.3** - Real-time WebSocket communication
- **Zustand 5.0.10** - State management
- **React Router DOM 7.13.0** - Client-side routing
- **React Icons 5.5.0** - Icon library
- **Nanoid 5.1.6** - Unique ID generation

### Backend
- **Node.js** - Runtime environment
- **Express 5.2.1** - Web framework
- **Socket.io 4.8.3** - WebSocket server
- **CORS 2.8.6** - Cross-origin resource sharing
- **Dotenv 17.2.3** - Environment configuration
- **Randomcolor 0.6.2** - Random color generation
- **Unique Names Generator 4.7.1** - Username generation

## 📁 Project Structure

```
colab-drawing/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ChannelInfo.jsx      # Channel information display
│   │   │   ├── ChatBox.jsx          # Chat functionality (ready for implementation)
│   │   │   ├── Container.jsx        # Layout container
│   │   │   ├── RemoteMouseMove.jsx  # Remote cursor rendering
│   │   │   ├── ToolBar.jsx          # Drawing tools interface
│   │   │   └── UserCard.jsx         # User information card
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   └── Canvaschannel.jsx    # Main canvas page
│   │   ├── socket/
│   │   │   └── socket.js            # Socket.io client configuration
│   │   ├── store/
│   │   │   └── useSocketStore.js    # Zustand state management
│   │   ├── utils/
│   │   │   └── generateChannelId.js # Channel ID generation utility
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Node.js application
│   ├── server.js              # Express server and Socket.io setup
│   ├── rooms.js               # Channel/room management logic
│   ├── roomState.js           # Channel state class and storage
│   ├── utils.js               # Utility functions
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rithick-11/colab-drawing.git
   cd colab-drawing
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Create `.env` file in the server directory:
   ```env
   PORT=3211
   ```

   Create `.env` file in the client directory:
   ```env
   VITE_SOCKET_URL=http://localhost:3211
   ```

### Running the Application

1. **Start the server**
   ```bash
   cd server
   npm run dev
   # or
   npm start
   ```
   Server will run on `http://localhost:3211`

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

3. **Open in browser**
   Navigate to `http://localhost:5173`

## 📖 Usage Guide

### Creating a New Drawing Session
1. Click "Create Room" on the home page
2. Enter your username
3. Click "Start Drawing"
4. Share the channel ID with others to invite them

### Joining an Existing Session
1. Click "Join Room" on the home page
2. Enter the channel ID provided by the room creator
3. Enter your username
4. Click "Start Drawing"

### Using the Drawing Tools
- **Select Tool**: Click on brush, line, or eraser icon
- **Change Color**: Click on any of the color squares
- **Adjust Size**: Use the slider to change brush/eraser size
- **Undo/Redo**: Click the undo/redo buttons to revert or reapply actions

### Inviting Users
- Share the URL with the channel ID: `http://localhost:5173/?mode=invite&channelID={channelId}`
- Users can directly enter their name and join

## 🏗️ Architecture Highlights

### Real-time Communication Flow
1. **Client initiates drawing** → Emits stroke data via Socket.io
2. **Server receives data** → Validates and broadcasts to all users in channel
3. **Other clients receive** → Update their canvas with the new stroke
4. **State synchronization** → Server maintains authoritative channel state

### State Management
- **Client State (Zustand)**: Manages UI state, drawing tools, user info
- **Server State (In-memory)**: Maintains channel state, user lists, drawing history
- **Synchronization**: Bidirectional updates ensure consistency

### Drawing Engine
- Uses HTML5 Canvas API for rendering
- Strokes are broken into small segments for smooth curves
- All drawing actions are recorded as arrays of stroke objects
- Redo stack maintains removed actions for redo functionality

## 🔌 Socket Events

### Client → Server
- `join-channel` - Join a drawing channel
- `send-message` - Send chat message
- `mouse_move` - Update cursor position
- `start_drawing` - Broadcast drawing stroke
- `add-board-action` - Add complete drawing action
- `undo-action` - Request undo
- `redo-action` - Request redo

### Server → Client
- `after_join_channel` - Confirmation with channel state
- `joined-new-user` - Notify about new user joining
- `user-disconnected` - Notify about user leaving
- `receive-message` - Receive chat message
- `someone_drawing` - Receive drawing stroke
- `on-remote-user-mouse-move` - Update remote cursor positions
- `on-undo-redo` - Synchronize undo/redo state

## 🎨 Components Overview

- **Container**: Main layout wrapper with full-screen styling
- **ToolBar**: Drawing tools, colors, and size controls
- **UserCard**: Display connected users with their colors
- **ChannelInfo**: Show current channel ID and controls
- **RemoteMouseMove**: Render other users' cursors with names
- **ChatBox**: Ready-to-implement chat feature

## 🚧 Future Enhancements

- [ ] Implement chat functionality
- [ ] Add shape drawing tools (rectangle, circle, polygon)
- [ ] Canvas export (PNG, SVG)
- [ ] Canvas import/background images
- [ ] Drawing layers support
- [ ] Text tool
- [ ] More sophisticated undo/redo (per-user)
- [ ] User authentication
- [ ] Save and load drawings
- [ ] Mobile touch support optimization

## 📝 Environment Variables

### Server
```env
PORT=3211                    # Server port number
```

### Client
```env
VITE_SOCKET_URL=http://localhost:3211    # Socket server URL
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Rithick**
- GitHub: [@rithick-11](https://github.com/rithick-11)
- Project Link: [https://github.com/rithick-11/colab-drawing](https://github.com/rithick-11/colab-drawing)

## 🙏 Acknowledgments

- Socket.io for real-time communication
- React team for the amazing library
- Tailwind CSS for the utility-first CSS framework
- Vercel for hosting

---

**Note**: This is a placement assessment project demonstrating real-time collaborative features, WebSocket communication, and modern full-stack development practices.