# Google NotebookLM Clone - PDF Chat Application

A sophisticated web application that enables users to upload PDF documents and interact with them through an AI-powered chat interface. Built with React, TypeScript, and Google Gemini AI.

## 🚀 Features

### Core Functionality
- **PDF Upload & Processing**: Drag-and-drop PDF upload with real-time text extraction
- **Integrated PDF Viewer**: Navigate through documents with zoom, rotation, and page controls
- **AI-Powered Chat**: Ask questions about your documents using Google Gemini AI
- **Smart Citations**: Clickable references that jump to specific PDF pages
- **Multi-Document Support**: Manage and switch between multiple uploaded PDFs
- **Document Search**: Find specific content within your documents

### Advanced Features
- **Context-Aware Responses**: AI understands document context for accurate answers
- **Confidence Scoring**: Citations include confidence levels for reliability assessment
- **Conversation History**: Persistent chat history for each document
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Processing**: Live feedback during PDF processing and AI responses

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **PDF Processing**: PDF.js for text extraction and viewing
- **AI Integration**: Google Gemini API for document analysis
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify (or any static hosting)

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Gemini API key (free at [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harsh260105/NotebookLM
   cd notebooklm-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key to your `.env` file

**Note**: The Gemini API offers generous free usage limits, perfect for development and testing.

## 📖 Usage Guide

### Uploading Documents
1. **Drag & Drop**: Simply drag a PDF file onto the upload area
2. **Browse**: Click "browse" to select a file from your computer
3. **Processing**: Watch the progress bar as the document is processed
4. **Ready**: Once complete, the document appears in your document list

### Chatting with Documents
1. **Select Document**: Click on a document from the sidebar to activate it
2. **Ask Questions**: Type your question in the chat input
3. **View Responses**: AI provides contextual answers with citations
4. **Follow Citations**: Click citation buttons to jump to referenced pages
5. **Continue Conversation**: Build on previous questions for deeper analysis

### PDF Viewer Controls
- **Navigation**: Use arrow buttons or page input to navigate
- **Zoom**: Zoom in/out for better readability
- **Rotate**: Rotate pages for optimal viewing
- **Download**: Download the original PDF file

## 🎯 Example Use Cases

### Academic Research
- "What are the main findings of this research paper?"
- "Summarize the methodology used in this study"
- "What are the limitations mentioned by the authors?"

### Business Documents
- "What are the key financial metrics in this report?"
- "Summarize the executive summary"
- "What recommendations are provided?"

### Legal Documents
- "What are the main terms and conditions?"
- "Explain the liability clauses"
- "What are the termination conditions?"

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── ChatInterface.tsx    # Main chat UI
│   ├── PDFViewer.tsx       # PDF display component
│   ├── PDFUpload.tsx       # File upload interface
│   ├── DocumentList.tsx    # Document management
│   └── CitationButton.tsx  # Citation UI component
├── utils/               # Utility functions
│   ├── geminiService.ts    # Google Gemini AI integration
│   ├── pdfProcessor.ts     # PDF text extraction
│   └── aiService.ts        # Legacy AI service wrapper
├── types/               # TypeScript type definitions
│   └── index.ts
└── App.tsx             # Main application component
```

## 🚀 Deployment

### Netlify (Recommended)
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable: `VITE_GEMINI_API_KEY`

### Other Platforms
The application can be deployed to any static hosting service:
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 🔒 Security & Privacy

- **API Keys**: Never commit API keys to version control
- **Client-Side Processing**: PDF text extraction happens in the browser
- **No Data Storage**: Documents and conversations are not stored on servers
- **HTTPS**: Always use HTTPS in production for API security

## 🐛 Troubleshooting

### Common Issues

**"AI service not configured"**
- Ensure your `.env` file contains a valid `VITE_GEMINI_API_KEY`
- Restart the development server after adding the API key

**PDF not loading**
- Check that the file is a valid PDF
- Ensure file size is under 50MB
- Try a different PDF file to isolate the issue

**Slow responses**
- Large PDFs may take longer to process
- Complex questions require more AI processing time
- Check your internet connection

### Performance Tips
- Use PDFs under 20MB for optimal performance
- Ask specific questions rather than very broad ones
- Clear browser cache if experiencing issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the Google Gemini API documentation

---

**Built with ❤️ using React, TypeScript, and Google Gemini AI**
