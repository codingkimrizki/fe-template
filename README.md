# IoT Molding Dashboard - Frontend

A modern, responsive Vue 3 frontend application for monitoring and managing manufacturing processes in a injection molding company. This dashboard provides real-time data visualization, machine monitoring, and operational insights through an intuitive interface.

## 🚀 Features

- **Real-time Monitoring**: Live data visualization from manufacturing equipment using MQTT
- **Multi-dashboard Views**: Machine, Kanagata, and Operator dashboards with specific KPIs
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between dark and light themes with customizable primary colors
- **Role-based Access Control**: Different permissions for admin, staff, and user roles
- **Data Visualization**: Charts and graphs powered by Vue-ECharts for performance insights
- **MQTT Integration**: Real-time communication with manufacturing equipment
- **Ant Design Vue**: Professional UI components for consistent user experience
- **State Management**: Pinia for efficient state management with persistence

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **State Management**: Pinia with persisted state
- **UI Library**: Ant Design Vue
- **Routing**: Vue Router
- **Charts**: Vue-ECharts
- **MQTT Client**: Paho MQTT for real-time communication
- **Build Tool**: Vite
- **Code Quality**: ESLint & Prettier

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- Access to the backend API server
- MQTT broker for real-time data

## 📦 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following environment variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# MQTT Configuration
VITE_MQTT_WS_HOST=ws://localhost
VITE_MQTT_WS_PORT=9001
VITE_MQTT_USERNAME=your_username
VITE_MQTT_PASSWORD=your_password

### 4. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (or as configured in your Vite setup).

## 🧪 Production Build

### Build for production

```bash
npm run build
# or
yarn build
```

### Preview production build locally

```bash
npm run preview
# or
yarn preview
```

## 🛠️ Available Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Fix linting issues with ESLint |
| `npm run format` | Format code with Prettier |

## 📁 Project Structure

```
src/
├── assets/                 # Static assets (images, fonts, styles)
│   └── css/               # Global styles
├── axios/                 # HTTP client configuration
├── components/            # Reusable Vue components
├── composable/            # Vue composables (custom hooks)
├── layout/                # Application layouts
├── router/                # Vue Router configuration
│   └── routes/            # Route definitions
├── stores/                # Pinia stores for state management
├── utils/                 # Utility functions
├── views/                 # Page components
│   └── dashboard/         # Dashboard-specific views
│       ├── machine/       # Machine dashboard components
│       ├── kanagata/      # Kanagata dashboard components
│       └── operator/      # Operator dashboard components
├── App.vue                # Main application component
└── main.js                # Application entry point
```

## 🔐 Authentication & Authorization

The application implements role-based access control with the following roles:
- **Admin**: Full access to all features
- **Staff**: Access to operational data and reports
- **User**: Limited access to basic monitoring features

Authentication is handled through the backend API with JWT tokens stored in browser storage.

## 📊 Dashboard Features

### Machine Dashboard
- Realtime machine shot monitoring
- Maintenance metrics data
- Log action history
- Control action support

### Kanagata Dashboard
- Realtime mold shot monitoring
- Maintenance metrics data
- Log action history
- Control action support

### Operator Dashboard
- Realtime status machine for lotfull & yellow tray
- Production support
- Text to speech notification

## 🔌 MQTT Integration

The application connects to an MQTT broker to receive real-time data from manufacturing equipment:

- Automatic reconnection handling
- Topicsage routing
- Data transformation-based mes and visualization
- Connection status monitoring

## 🎨 Theming

The application supports both light and dark themes with customizable primary colors:

- Theme persistence across sessions
- Smooth theme transitions
- Customizable color schemes
- Font family options

## 🧩 Components Architecture

### Layout Components
- **TheLayout**: Main application layout with header, sidebar, and content area
- **TheSider**: Navigation sidebar with collapsible menu
- **TheHeader**: Top navigation bar with user controls
- **TheDrawer**: Responsive drawer for mobile navigation

### Dashboard Components
- **Machine Dashboard**: Realtime machine shot monitoring
- **Kanagata Dashboard**: Realtime kanagata shot monitoring
- **Operator Dashboard**: Production support for notification yellow tray & lotfull state

## 🔧 Development Guidelines

### Component Structure
- Use Composition API with `<script setup>`
- Follow Vue 3 best practices
- Utilize TypeScript for type safety
- Implement proper error handling

### State Management
- Use Pinia for global state management
- Implement proper store organization
- Use persisted state for user preferences
- Follow store naming conventions

### Styling
- Leverage Ant Design Vue components
- Use CSS variables for theming
- Implement responsive design patterns
- Follow accessibility guidelines

## 🚀 Deployment

### Docker Deployment

The project includes Docker configuration files:

- `Dockerfile`: Production-ready Docker image
- `docker-compose.yaml`: Multi-container setup
- `dev.docker-compose.yaml`: Development environment

### Production Deployment

1. Build the application: `npm run build`
2. Serve the `dist/` folder using a web server (Nginx, Apache, etc.)
3. Configure environment variables for production
4. Set up reverse proxy if needed

## 🔒 Security Considerations

- API requests use HTTPS in production
- Authentication tokens are stored securely
- Input validation on both client and server
- XSS protection through Vue's template rendering
- Secure MQTT connection with authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

---

Made with ❤️ using Vue 3, Pinia, and Ant Design Vue