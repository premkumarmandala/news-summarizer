import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Article as ArticleIcon,
  Category as CategoryIcon,
  AccessTime as AccessTimeIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
// Using divs with flexbox instead of Grid component
import { formatDistanceToNow } from 'date-fns';
import { ProcessedArticle } from '../types';

export const MOCK_ARTICLES: ProcessedArticle[] = [
  {
    title: 'The Future of AI in Healthcare',
    content: 'Artificial Intelligence is revolutionizing healthcare with...',
    summary: 'AI is transforming healthcare through improved diagnostics and personalized treatment plans.',
    category: 'Technology',
    processedContent: '## The Future of AI in Healthcare\n\nArtificial Intelligence is revolutionizing healthcare with...',
    processingTime: 2450,
    modelUsed: 'gemini-pro',
  },
  {
    title: 'Global Climate Summit 2023',
    content: 'World leaders gathered to discuss climate change initiatives...',
    summary: 'The 2023 Climate Summit focused on reducing carbon emissions and sustainable energy solutions.',
    category: 'Environment',
    processedContent: '## Global Climate Summit 2023\n\nWorld leaders gathered to discuss climate change initiatives...',
    processingTime: 3200,
    modelUsed: 'llama2',
  },
];

interface NewsListProps {
  articles: ProcessedArticle[];
  setArticles: React.Dispatch<React.SetStateAction<ProcessedArticle[]>>;
}

const NewsList: React.FC<NewsListProps> = ({ articles, setArticles }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ProcessedArticle | null>(null);

  useEffect(() => {
    if (articles.length > 0) {
      setLoading(false);
    }
  }, [articles]);

  const handleRefresh = () => {
    // In a real app, this would refresh the articles list
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleDelete = (id: string) => {
    // In a real app, this would delete the article from the server
    setArticles(articles.filter(article => article.title !== id));
  };

  if (loading && articles.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (articles.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <ArticleIcon fontSize="large" color="action" />
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No articles found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Submit a news article to see it here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Processed Articles
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '24px', width: '100%' }}>
        <div style={{ flex: selectedArticle ? '0 0 calc(41.6667% - 12px)' : '0 0 100%', maxWidth: selectedArticle ? 'calc(41.6667% - 12px)' : '100%' }}>
          {articles.map((article) => (
            <Card 
              key={article.title} 
              sx={{ 
                mb: 2, 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3,
                },
                backgroundColor: selectedArticle?.title === article.title ? 'action.hover' : 'background.paper',
              }}
              onClick={() => setSelectedArticle(article)}
            >
              <CardHeader
                title={article.title}
                subheader={
                  <Box display="flex" alignItems="center" mt={1}>
                    <Chip
                      icon={<CategoryIcon fontSize="small" />}
                      label={article.category || 'Uncategorized'}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Box display="flex" alignItems="center" color="text.secondary">
                      <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="caption">
                        {formatDistanceToNow(new Date(Date.now() - 1000 * 60 * 5))} ago
                      </Typography>
                    </Box>
                  </Box>
                }
                action={
                  <Box>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(article.title);
                        }}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {article.summary || article.content.substring(0, 150)}...
                </Typography>
                <Box mt={1}>
                  <Chip 
                    label={`Processed with ${article.modelUsed}`} 
                    size="small" 
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedArticle && (
          <div style={{ flex: '0 0 calc(58.3333% - 12px)', maxWidth: 'calc(58.3333% - 12px)' }}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {selectedArticle.title}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Chip
                      icon={<CategoryIcon fontSize="small" />}
                      label={selectedArticle.category || 'Uncategorized'}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`Processed with ${selectedArticle.modelUsed}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => {
                    // In a real app, this would navigate to edit view
                    console.log('Edit article:', selectedArticle.title);
                  }}
                >
                  Edit
                </Button>
              </Box>

              {selectedArticle.summary && (
                <Box mb={3}>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Summary
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedArticle.summary}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </Box>
              )}

              <Box>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Processed Content
                </Typography>
                <Box 
                  sx={{ 
                    backgroundColor: 'background.default', 
                    p: 2, 
                    borderRadius: 1,
                    '& h2, & h3, & h4': {
                      mt: 2,
                      mb: 1,
                      color: 'primary.main',
                    },
                    '& p': {
                      mb: 2,
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: selectedArticle.processedContent 
                      ? selectedArticle.processedContent.replace(/\n/g, '<br />')
                      : selectedArticle.content.replace(/\n/g, '<br />')
                  }}
                />
              </Box>

              <Box mt={3} pt={2} borderTop={1} borderColor="divider">
                <Typography variant="caption" color="text.secondary">
                  Processed in {selectedArticle.processingTime}ms using {selectedArticle.modelUsed}
                </Typography>
              </Box>
            </Paper>
          </div>
        )}
      </div>
    </Box>
  );
};

export default NewsList;
