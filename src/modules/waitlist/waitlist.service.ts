import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { WaitlistEntry } from './entities/waitlist.entity';
import { Repository } from 'typeorm';
import { CreateWaitlistEntryDTO } from './dto/create-waitlist-entry.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WaitlistService {
  constructor(
    @InjectRepository(WaitlistEntry)
    private readonly waitlistRepository: Repository<WaitlistEntry>
  ) {}

  async addWaitlistEntry(waitlistEntry: CreateWaitlistEntryDTO) {
    const existingEntry = await this.waitlistRepository.findOne({
      where: {
        email: waitlistEntry.email,
      },
    });

    if (existingEntry) {
      throw new HttpException('Entry already exists', HttpStatus.CONFLICT);
    }

    const newEntry = await this.waitlistRepository.save({
      name: waitlistEntry.name,
      email: waitlistEntry.email,
    });

    return {
      status_code: HttpStatus.CREATED,
      message: 'Entry added successfully',
      data: newEntry,
    };
  }

  async getWaitlistEntries() {
    const entries = await this.waitlistRepository.find();
    if (!entries) {
      throw new HttpException('Entries not found', HttpStatus.NOT_FOUND);
    }
    return {
      status_code: HttpStatus.OK,
      message: 'Entries fetched successfully',
      data: entries,
    };
  }

  async deleteWaitlistEntry(email: string) {
    const entry = await this.waitlistRepository.findOne({ where: { email } });
    if (!entry) {
      throw new HttpException('Entry not found', HttpStatus.NOT_FOUND);
    }
    await this.waitlistRepository.delete({ email });
    return {
      status_code: HttpStatus.OK,
      message: 'Entry deleted successfully',
      data: entry,
    };
  }

  async getWaitlistEntry(email: string) {
    const entry = await this.waitlistRepository.findOne({ where: { email } });
    if (!entry) {
      throw new HttpException('Entry not found', HttpStatus.NOT_FOUND);
    }
    return {
      status_code: HttpStatus.OK,
      message: 'Entry fetched successfully',
      data: entry,
    };
  }
}
