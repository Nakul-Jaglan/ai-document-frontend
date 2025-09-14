# Document Portal - AI-Powered Document Analysis

A Next.js application that allows users to upload, manage, and ask questions about PDF documents using AI-powered analysis with the Gemini API.

## 🚀 Features

- **Secure Authentication**: JWT-based user authentication and authorization
- **Document Management**: Upload, view, and organize PDF, DOC, and DOCX files
- **AI-Powered Q&A**: Ask questions about uploaded documents and get intelligent answers
- **Real-time Interaction**: Interactive chat interface for document queries
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Server Status Monitoring**: Smart server startup notifications for cold starts

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: JWT tokens with automatic refresh
- **HTTP Client**: Axios for API communication
- **UI Components**: Custom React components
- **Date Handling**: date-fns for date formatting
- **Deployment**: Optimized for Vercel deployment

## 📋 Prerequisites

Before running this application, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A backend API server running (Django backend recommended)
- Gemini API access for document analysis

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Nakul-Jaglan/ai-document-frontend.git
cd ai-document-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Replace the API URL with your backend server URL.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── app/
│   ├── dashboard/
│   │   └── page.js                 # Main dashboard page
│   ├── document/
│   │   └── [id]/
│   │       └── question/
│   │           └── page.js         # Document Q&A page
│   ├── login/
│   │   └── page.js                 # Login page
│   ├── register/
│   │   └── page.js                 # Registration page
│   ├── globals.css                 # Global styles
│   ├── layout.js                   # Root layout with AuthProvider
│   └── page.js                     # Home page (redirects)
├── components/
│   ├── DocumentCard.js             # Document display component
│   ├── Navbar.js                   # Navigation component
│   ├── PrivateRoute.js             # Route protection
│   ├── ProtectedRoute.js           # Alternative route protection
│   └── UploadModal.js              # File upload modal
├── contexts/
│   └── AuthContext.js              # Authentication context
├── lib/
│   └── api.js                      # API client and endpoints
└── public/                         # Static assets
```

## 🔐 Authentication Flow

1. **Registration/Login**: Users create accounts or sign in
2. **JWT Tokens**: Access and refresh tokens for secure API calls
3. **Automatic Refresh**: Seamless token renewal on expiration
4. **Route Protection**: Private routes require authentication
5. **Logout**: Secure session termination

## 📄 Document Management

### Supported File Types
- PDF documents
- Microsoft Word (.doc, .docx)

### Features
- Drag-and-drop file upload
- Document metadata management
- File preview and organization
- Secure document storage

## 🤖 AI-Powered Q&A

- Ask natural language questions about document content
- Get intelligent, context-aware responses
- Conversation history tracking
- Real-time answer generation

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Server Status**: Cold start notifications with countdown timer
- **Accessibility**: Screen reader friendly components

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

### API Endpoints

The application expects the following backend endpoints:

- `POST /api/auth/login/` - User authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/refresh/` - Token refresh
- `GET /api/documents/` - List user documents
- `POST /api/documents/` - Upload new document
- `GET /api/documents/{id}/` - Get document details
- `DELETE /api/documents/{id}/` - Delete document
- `POST /api/documents/{id}/ask/` - Ask question about document

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm start
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- Uses ESLint for code quality
- Follows Next.js best practices
- Component-based architecture
- Tailwind CSS for styling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Nakul Jaglan**
- GitHub: [@Nakul-Jaglan](https://github.com/Nakul-Jaglan)
- Portfolio: [Resume](https://my.newtonschool.co/template/user/jaat/resume)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- AI capabilities powered by Gemini API
- Icons from [Heroicons](https://heroicons.com/)

---

For questions or support, please open an issue on GitHub or contact the author.
