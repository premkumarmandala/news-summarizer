import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import NewsForm from './components/NewsForm';
import NewsList from './components/NewsList';
import { LLMConfig, ProcessedArticle } from './types';
import { MOCK_ARTICLES } from './components/NewsList';

const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[500],
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
  },
});

const defaultLLMConfig: LLMConfig = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-1.5-flash',
  temperature: 0.7,
  maxTokens: 1000,
};

function App() {
  const [llmConfig, setLlmConfig] = useState<LLMConfig>(defaultLLMConfig);
  const [articles, setArticles] = useState<ProcessedArticle[]>(MOCK_ARTICLES);

  const handleNewArticle = (article: ProcessedArticle) => {
    setArticles([article, ...articles]);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                News Summarizer
              </Typography>
              <Button color="inherit" component={RouterLink} to="/">
                Submit Article
              </Button>
              <Button color="inherit" component={RouterLink} to="/articles">
                View Articles
              </Button>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route path="/" element={
                <NewsForm 
                  llmConfig={llmConfig} 
                  onConfigChange={setLlmConfig} 
                  onNewArticle={handleNewArticle}
                />
              } />
              <Route path="/articles" element={
                <NewsList articles={articles} setArticles={setArticles} />
              } />
            </Routes>
          </Container>
          
          <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => 
            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800]
          }}>
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                News Summarizer © {new Date().getFullYear()}
              </Typography>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
