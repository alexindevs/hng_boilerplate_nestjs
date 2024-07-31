import { Module } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { WaitlistController } from './waitlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaitlistEntry } from './entities/waitlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WaitlistEntry])],
  providers: [WaitlistService],
  controllers: [WaitlistController],
})
export class WaitlistModule {}
