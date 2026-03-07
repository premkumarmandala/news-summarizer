import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select,
  MenuItem, 
  SelectChangeEvent, 
  FormGroup, 
  FormControlLabel, 
  Switch, 
  Divider, 
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Send as SendIcon } from '@mui/icons-material';
import { LLMConfig, ProcessingOptions, ProcessedArticle } from '../types';
import { processWithLLM } from '../services/llmService';

interface NewsFormProps {
  llmConfig: LLMConfig;
  onConfigChange: (config: LLMConfig) => void;
  onNewArticle: (article: ProcessedArticle) => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ llmConfig, onConfigChange, onNewArticle }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>({
    summarize: true,
    categorize: true,
    createHeadings: true,
    rewrite: false,
  });

  const handleLLMConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    onConfigChange({
      ...llmConfig,
      [name]: name === 'temperature' || name === 'maxTokens' 
        ? parseFloat(value) || 0 
        : value
    });
  };

  const handleProcessingOptionChange = (option: keyof ProcessingOptions) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setProcessingOptions({
        ...processingOptions,
        [option]: event.target.checked,
      });
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Please provide both title and content');
      return;
    }

    if (!llmConfig.apiKey) {
      setError('Please provide an API key for the selected LLM provider');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await processWithLLM({
        title,
        content,
        processingOptions,
        llmConfig,
      });

      setSuccess('Article processed successfully!');
      onNewArticle(result);
      // Reset form
      setTitle('');
      setContent('');
      // Redirect to the articles page
      setTimeout(() => {
        navigate('/articles');
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the article');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Submit News Article
        </Typography>
        
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <TextField
          label="Content"
          variant="outlined"
          fullWidth
          multiline
          rows={8}
          margin="normal"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Paste the news article content here..."
        />
        
        <Accordion sx={{ mt: 3, mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Processing Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={processingOptions.summarize}
                    onChange={handleProcessingOptionChange('summarize')}
                    name="summarize"
                  />
                }
                label="Summarize"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={processingOptions.categorize}
                    onChange={handleProcessingOptionChange('categorize')}
                    name="categorize"
                  />
                }
                label="Categorize"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={processingOptions.createHeadings}
                    onChange={handleProcessingOptionChange('createHeadings')}
                    name="createHeadings"
                  />
                }
                label="Create Headings"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={processingOptions.rewrite}
                    onChange={handleProcessingOptionChange('rewrite')}
                    name="rewrite"
                  />
                }
                label="Rewrite Content"
              />
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        
        <Accordion sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>LLM Configuration</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
              <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="llm-provider-label">LLM Provider</InputLabel>
                  <Select
                    labelId="llm-provider-label"
                    id="provider"
                    name="provider"
                    value={llmConfig.provider}
                    label="LLM Provider"
                    onChange={handleLLMConfigChange}
                  >
                    <MenuItem value="gemini">Google Gemini</MenuItem>
                    <MenuItem value="ollama">Ollama</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="model"
                  name="model"
                  label="Model"
                  value={llmConfig.model}
                  onChange={handleLLMConfigChange}
                  helperText={llmConfig.provider === 'gemini' ? 'e.g., gemini-pro' : 'e.g., llama2'}
                />
              </Box>
              <Box sx={{ width: '100%', px: 1 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="apiKey"
                  name="apiKey"
                  label={`${llmConfig.provider === 'gemini' ? 'Google AI' : 'Ollama'} API Key`}
                  type="password"
                  value={llmConfig.apiKey}
                  onChange={handleLLMConfigChange}
                  required
                />
              </Box>
              {llmConfig.provider === 'ollama' && (
                <Box sx={{ width: '100%', px: 1 }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    id="baseUrl"
                    name="baseUrl"
                    label="Ollama Base URL"
                    value={llmConfig.baseUrl || 'http://localhost:11434'}
                    onChange={handleLLMConfigChange}
                    helperText="Leave as default if running locally"
                  />
                </Box>
              )}
              <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="temperature"
                  name="temperature"
                  label="Temperature"
                  type="number"
                  inputProps={{ min: 0, max: 1, step: 0.1 }}
                  value={llmConfig.temperature}
                  onChange={handleLLMConfigChange}
                  helperText="Higher values = more creative, lower = more focused"
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  id="maxTokens"
                  name="maxTokens"
                  label="Max Tokens"
                  type="number"
                  inputProps={{ min: 100, max: 4000 }}
                  value={llmConfig.maxTokens}
                  onChange={handleLLMConfigChange}
                  helperText="Maximum length of the generated response"
                />
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isProcessing}
            startIcon={isProcessing ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {isProcessing ? 'Processing...' : 'Submit & Process'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NewsForm;
