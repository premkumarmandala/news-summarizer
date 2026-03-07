import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { LLMConfig, ProcessingOptions } from '../types';

interface ProcessArticleParams {
  title: string;
  content: string;
  processingOptions: ProcessingOptions;
  llmConfig: LLMConfig;
}

export interface ProcessedArticle {
  title: string;
  content: string;
  summary?: string;
  category?: string;
  processedContent?: string;
  processingTime: number;
  modelUsed: string;
}

export async function processWithLLM({
  title,
  content,
  processingOptions,
  llmConfig,
}: ProcessArticleParams): Promise<ProcessedArticle> {
  const startTime = Date.now();
  
  try {
    if (llmConfig.provider === 'gemini') {
      return await processWithGemini(title, content, processingOptions, llmConfig);
    } else if (llmConfig.provider === 'ollama') {
      return await processWithOllama(title, content, processingOptions, llmConfig);
    } else {
      throw new Error('Unsupported LLM provider');
    }
  } finally {
    const processingTime = Date.now() - startTime;
    console.log(`Processing completed in ${processingTime}ms`);
    
    return {
      title,
      content,
      processingTime,
      modelUsed: llmConfig.model,
    };
  }
}

async function processWithGemini(
  title: string,
  content: string,
  processingOptions: ProcessingOptions,
  llmConfig: LLMConfig
): Promise<ProcessedArticle> {
  const genAI = new GoogleGenerativeAI(llmConfig.apiKey);
  const model = genAI.getGenerativeModel({ model: llmConfig.model });

  const prompt = buildPrompt(title, content, processingOptions);
  
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: llmConfig.temperature,
        maxOutputTokens: llmConfig.maxTokens,
      },
    });

    const response = await result.response;
    const processedText = response.text();
    
    return parseProcessedResponse(processedText, title, content, llmConfig.model);
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    throw new Error('Failed to process with Gemini. Please check your API key and try again.');
  }
}

async function processWithOllama(
  title: string,
  content: string,
  processingOptions: ProcessingOptions,
  llmConfig: LLMConfig
): Promise<ProcessedArticle> {
  const baseUrl = llmConfig.baseUrl || 'http://localhost:11434';
  const prompt = buildPrompt(title, content, processingOptions);
  
  try {
    const response = await axios.post(
      `${baseUrl}/api/generate`,
      {
        model: llmConfig.model,
        prompt: prompt,
        temperature: llmConfig.temperature,
        max_tokens: llmConfig.maxTokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          ...(llmConfig.apiKey && { 'Authorization': `Bearer ${llmConfig.apiKey}` }),
        },
      }
    );

    if (response.data && response.data.response) {
      return parseProcessedResponse(
        response.data.response,
        title,
        content,
        llmConfig.model
      );
    }
    
    throw new Error('Invalid response from Ollama API');
  } catch (error) {
    console.error('Error processing with Ollama:', error);
    throw new Error('Failed to process with Ollama. Make sure the service is running and the model is available.');
  }
}

function buildPrompt(
  title: string,
  content: string,
  options: ProcessingOptions
): string {
  let prompt = `Process the following news article with the following requirements. Your response should be in JSON format with the following structure: {"summary": "...", "category": "...", "processedContent": "..."}\n\n`;
  
  prompt += `Title: ${title}\n\n`;
  prompt += `Content: ${content}\n\n`;
  prompt += `Processing instructions:\n`;
  
  if (options.summarize) {
    prompt += "- Generate a concise summary of the article (2-3 sentences).\n";
  }
  
  if (options.categorize) {
    prompt += "- Categorize the article into one of these categories: Technology, Business, Health, Science, Entertainment, Sports, Politics, or Other.\n";
  }
  
  if (options.createHeadings) {
    prompt += "- If the article is long, add appropriate headings to improve readability.\n";
  }
  
  if (options.rewrite) {
    prompt += "- Rewrite the content to be more concise and clear while preserving the original meaning.\n";
  }
  
  prompt += "\nPlease provide the response in valid JSON format with the following structure:\n";
  prompt += '{"summary": "...", "category": "...", "processedContent": "..."}';
  
  return prompt;
}

function parseProcessedResponse(
  responseText: string,
  originalTitle: string,
  originalContent: string,
  modelUsed: string
): ProcessedArticle {
  try {
    // Try to parse the response as JSON
    const parsedResponse = JSON.parse(responseText);
    
    return {
      title: originalTitle,
      content: originalContent,
      summary: parsedResponse.summary,
      category: parsedResponse.category,
      processedContent: parsedResponse.processedContent || originalContent,
      processingTime: 0, // This will be set by the calling function
      modelUsed,
    };
  } catch (error) {
    console.error('Error parsing LLM response:', error);
    // If parsing fails, return the original content with the raw response as the summary
    return {
      title: originalTitle,
      content: originalContent,
      summary: 'Unable to parse the response. Raw output from the model:\n\n' + responseText,
      processedContent: originalContent,
      processingTime: 0,
      modelUsed,
    };
  }
}
