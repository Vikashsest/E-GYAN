import { Injectable } from '@nestjs/common';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';
import axios from 'axios';
@Injectable()
export class AiService {
  private GEMINI_API_KEY = 'AIzaSyDxsjTAvpaIalHTlOm7097UZIzmy314hiM';

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
