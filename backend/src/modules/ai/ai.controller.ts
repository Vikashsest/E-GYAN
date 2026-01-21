import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';

@Controller('ai')
export class AiController {
  private memoryStore: { chunk: string; embedding: number[] }[] = [];
  @Post('chat')
  async chat(@Body('question') question: string) {
    const result = await this.aiService.chatWithGemini(question);

    return {
      answer: result.answer,
      suggestions: result.suggestions || [],
    };
  }

  constructor(private readonly aiService: AiService) {}
  @Post('generate-quiz')
  async generateQuiz(@Body() body: { prompt: string }) {
    return this.aiService.generateQuiz(body.prompt);
  }

  @Post('process-chapter')
  async processChapter(
    @Body() body: { filePath?: string; textContent?: string },
  ) {
    let chunks: string[] = [];

    if (body.filePath) {
      // PDF file processing
      chunks = await this.aiService.extractAndChunkFromPDF(body.filePath);
    } else if (body.textContent) {
      // Direct text processing
      chunks = await this.aiService.extractAndChunkFromText(body.textContent);
    } else {
      throw new BadRequestException('No content provided to process.');
    }

    // Generate embeddings
    const embeddings: number[][] = [];
    for (const chunk of chunks) {
      const emb = await this.aiService.createEmbedding(chunk);
      embeddings.push(emb);
    }

    // Store in memory
    this.memoryStore = await this.aiService.storeChunkInMemory(
      chunks,
      embeddings,
    );

    return {
      message: 'Chapter processed and AI trended successfully',
      chunks: chunks.length,
    };
  }

  @Post('ask-doubt')
  async askDoubt(@Body() body: { question: string }) {
    console.log('click here');

    const { question } = body;

    if (!question) {
      throw new BadRequestException('Question is required.');
    }

    if (!this.memoryStore || this.memoryStore.length === 0) {
      throw new BadRequestException(
        'No processed content available. Please process a chapter first.',
      );
    }

    // Generate question embedding
    const qEmbedding = await this.aiService.createEmbedding(question);

    // Retrieve top chunks
    const topChunks = this.aiService.getTopChunks(
      qEmbedding,
      this.memoryStore,
      3,
    );
    const answer = await this.aiService.generateAnswer(question, topChunks);

    return { answer };
  }
}
