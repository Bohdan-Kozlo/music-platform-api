import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  @IsNumberString()
  trackId: string;
}