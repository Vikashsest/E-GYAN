import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import axios from 'axios';
import fs from 'fs';
import pdf from 'pdf-parse';
import OpenAI from 'openai';
import { Chapter } from '../book/entities/chapter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChapterEmbedding } from './entities/chapter-embedding.entity.ts';
import { Repository } from 'typeorm';

import pdfParse from 'pdf-parse';

// const openai = new OpenAI({
//   apiKey:
//    ,
// });

@Injectable()
export class AiService {
  private memoryStore: { chunk: string; embedding: number[] }[] = [];
  private GEMINI_API_KEY = 'AIzaSyDxsjTAvpaIalHTlOm7097UZIzmy314hiM';

  private openai: OpenAI;
  constructor(
    @InjectRepository(ChapterEmbedding)
    private embeddingRepo: Repository<ChapterEmbedding>, // correct injection
  ) {
    // OpenAI client initialization
    this.openai = new OpenAI({
      apiKey:
        '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',
    });
  }
  async generateQuiz(prompt: string) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `
Create exactly 1 multiple choice question.

Topic: "${prompt}"

Rules:
- 4 options only
- Return valid JSON
- No extra explanation

JSON format:
{
  "question": "",
  "options": ["", "", "", ""],
  "correctIndex": 0
}
`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        console.log('Empty Gemini response:', response.data);
        return {};
      }

      const clean = text.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch (error) {
      console.error('Gemini Error:', error.response?.data || error.message);
      return {};
    }
  }

  //   async generateQuiz(prompt: string) {
  //     try {
  //       const response = await axios.post(
  //         `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.GEMINI_API_KEY}`,
  //         {
  //           contents: [
  //             {
  //               parts: [
  //                 {
  //                   text: `
  // Create exactly 1 multiple choice question.
  // Topic: "${prompt}"

  // Return ONLY valid JSON:
  // {
  //   "question": "",
  //   "options": ["", "", "", ""],
  //   "correctIndex": 0
  // }
  // `,
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           headers: { 'Content-Type': 'application/json' },
  //         },
  //       );

  //       const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

  //       if (!text) {
  //         console.log('Gemini empty response', response.data);
  //         return {};
  //       }

  //       const clean = text.replace(/```json|```/g, '').trim();
  //       console.log('clean', clean);

  //       return JSON.parse(clean);
  //     } catch (error) {
  //       console.error('Gemini Error:', error.response?.data || error);
  //       return {};
  //     }
  //   }

  async extractAndChunkFromText(text: string) {
    const cleanText = text.replace(/\n/g, ' ');
    const words = cleanText.split(/\s+/);
    const chunkSize = 500;
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
  }

  async extractAndChunkFromPDF(fileUrl: string) {
    let buffer: Buffer;

    if (fileUrl.startsWith('http')) {
      const response = await axios.get(fileUrl, {
        responseType: 'arraybuffer',
      });
      buffer = Buffer.from(response.data);
    } else {
      buffer = fs.readFileSync(fileUrl);
    }

    const data = await pdfParse(buffer);
    return this.extractAndChunkFromText(data.text);
  }

  // --- Create Embedding ---
  async createEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  }

  async storeChunkInMemory(
    chunks: string[],
    embeddings: number[][],
  ): Promise<{ chunk: string; embedding: number[] }[]> {
    const store: { chunk: string; embedding: number[] }[] = [];
    for (let i = 0; i < chunks.length; i++) {
      store.push({ chunk: chunks[i], embedding: embeddings[i] });
    }
    this.memoryStore = store;
    return store;
  }
  async storeChunkInDB(
    chapter: Chapter,
    chunks: string[],
    embeddings: number[][],
  ) {
    const records: ChapterEmbedding[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const rec = this.embeddingRepo.create({
        chapter,
        chunkText: chunks[i],
        embedding: embeddings[i],
      });
      records.push(rec);
    }
    await this.embeddingRepo.save(records);
  }

  getTopChunks(
    questionEmbedding: number[],
    store: { chunk: string; embedding: number[] }[],
    topK = 3,
  ): string[] {
    const scored = store.map((s) => ({
      ...s,
      score: this.cosineSim(questionEmbedding, s.embedding),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map((s) => s.chunk);
  }

  private cosineSim(a: number[], b: number[]) {
    let dot = 0,
      normA = 0,
      normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  async generateAnswer(question: string, contextChunks: string[]) {
    const contextText = contextChunks.join('\n');
    const prompt = `Answer the student's question using ONLY the context below. Be simple and clear.\n\nContext:\n${contextText}\n\nQuestion: ${question}`;

    const response = await fetch(
      'https://gemini.googleapis.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gemini-1.5',
          messages: [{ role: 'user', content: prompt }],
        }),
      },
    );
    const data = await response.json();
    return data.choices[0].message.content;
  }

  async extractAndChunkFromPDFUrl(fileUrl: string) {
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    const data = await pdf(buffer);
    return this.extractAndChunkFromText(data.text);
  }

  async processChapter(chapter: Chapter) {
    if (!chapter.fileUrl) throw new BadRequestException('No content available');

    const chunks = await this.extractAndChunkFromPDFUrl(chapter.fileUrl);

    const embeddings: number[][] = [];
    for (const chunk of chunks) {
      const emb = await this.createEmbedding(chunk);
      embeddings.push(emb);
    }

    // Store embeddings in memory or DB
    this.memoryStore = await this.storeChunkInMemory(chunks, embeddings);

    return {
      message: 'Chapter processed successfully',
      chunks: chunks.length,
    };
  }

  async askDoubt(question: string) {
    if (!this.memoryStore?.length)
      throw new BadRequestException(
        'No processed content available. Please process a chapter first.',
      );

    const qEmbedding = await this.createEmbedding(question);
    const topChunks = this.getTopChunks(qEmbedding, this.memoryStore, 3);
    const answer = await this.generateAnswer(question, topChunks);

    return { answer };
  }
  async chatWithGemini(message: string) {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `
You are a helpful study assistant.

Student Question: ${message}

Respond ONLY in JSON format like below:
{
  "answer": "simple explanation for student",
  "suggestions": [
    {
      "type": "video",
      "title": "Video title",
      "query": "youtube search keywords"
    }
  ]
}
              `,
              },
            ],
          },
        ],
      },
      { headers: { 'Content-Type': 'application/json' } },
    );

    let text = response.data.candidates[0].content.parts[0].text;

    // Remove ```json``` if Gemini adds it
    text = text.replace(/```json|```/g, '');

    return JSON.parse(text);
  }
}
