import { Injectable } from '@nestjs/common';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import axios from 'axios';
@Injectable()
export class AiService {
  private GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  async generateQuizFromPrompt(prompt: string) {
    try {
      const response = await axios.post(
        'https://gemini-api-url/v1/generate',
        {
          prompt,
          max_output_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${this.GEMINI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const text = response.data.output_text;
      const questions = JSON.parse(text);
      return { questions };
    } catch (err) {
      console.error('Gemini API failed:', err);
      return { questions: [] };
    }
  }

  findAll() {
    return `This action returns all ai`;
  }
  findOne(id: number) {
    return `This action returns a #${id} ai`;
  }

  update(id: number, updateAiDto: UpdateAiDto) {
    return `This action updates a #${id} ai`;
  }

  remove(id: number) {
    return `This action removes a #${id} ai`;
  }
}
