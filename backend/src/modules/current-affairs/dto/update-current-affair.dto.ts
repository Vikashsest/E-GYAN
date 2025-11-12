
import { PartialType } from '@nestjs/mapped-types';
import { CreateCurrentAffairDto } from './create-current-affair.dto';

export class UpdateCurrentAffairDto extends PartialType(CreateCurrentAffairDto) {}
