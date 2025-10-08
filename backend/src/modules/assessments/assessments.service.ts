import { Injectable } from '@nestjs/common';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assessment } from './entities/assessment.entity';
import { Repository } from 'typeorm';
import { AssessmentQuestion } from './entities/assessment-question.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Assessment)
    private readonly assmentRepo: Repository<Assessment>,
        @InjectRepository(AssessmentQuestion)
    private readonly assmentQuestionRepo: Repository<AssessmentQuestion>,
  ){}
  async create(createAssessmentDto: CreateAssessmentDto,teacher:User) {
    const {title,description,duration,class:className,questions}=createAssessmentDto
    const assessments=await this.assmentRepo.create({
      title,
      description,
      duration,
      class:className,
      questions,
      created_by:teacher
    })
    const savedAssements=await this.assmentRepo.save(assessments)
    // 2️⃣ Questions insert
    const questionsToSave = questions.map(q =>
      this.assmentQuestionRepo.create({
        assessment: savedAssements,
        question_text: q.question_text,
        marks: q.marks,
      }),
    );

    await this.assmentQuestionRepo.save(questionsToSave);

    // 3️⃣ Return saved assessment with questions
    savedAssements.questions = questionsToSave;
    return savedAssements;
  }

  

  findAll() {
    return `This action returns all assessments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assessment`;
  }

  update(id: number, updateAssessmentDto: UpdateAssessmentDto) {
    return `This action updates a #${id} assessment`;
  }

  remove(id: number) {
    return `This action removes a #${id} assessment`;
  }
}
