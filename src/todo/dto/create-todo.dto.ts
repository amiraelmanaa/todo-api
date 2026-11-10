import {
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';

import { VALIDATION_MESSAGES } from '../../common/constants/validation-messages.js';
import { StatusEnum } from '../enums/status.enums.js';
export class CreateTodoDto {
  @IsString({
    message: VALIDATION_MESSAGES.NAME.IS_STRING,
  })
  @MinLength(3, {
    message: VALIDATION_MESSAGES.NAME.MIN_LENGTH,
  })
  @MaxLength(10, {
    message: VALIDATION_MESSAGES.NAME.MAX_LENGTH,
  })
  name!: string;

  @IsString({
    message: VALIDATION_MESSAGES.DESCRIPTION.IS_STRING,
  })
  @MinLength(10, {
    message: VALIDATION_MESSAGES.DESCRIPTION.MIN_LENGTH,
  })
  description!: string;

  @IsOptional()
  @IsEnum(StatusEnum, {
  message: VALIDATION_MESSAGES.STATUS.IS_ENUM,
})
status?: StatusEnum;
}