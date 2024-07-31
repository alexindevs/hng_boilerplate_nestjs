import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateWaitlistEntryDTO {
  @ApiProperty({
    description: 'The email address of the person who wants to be added to the waitlist',
    type: String,
    example: 'example@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The name of the person who wants to be added to the waitlist',
    type: String,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
