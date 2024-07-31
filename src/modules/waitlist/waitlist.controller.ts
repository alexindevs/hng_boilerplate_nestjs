import { Controller, Post, Get, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { WaitlistService } from './waitlist.service';
import { CreateWaitlistEntryDTO } from './dto/create-waitlist-entry.dto';
import { skipAuth } from '../../helpers/skipAuth';

@ApiTags('Waitlist')
@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  @skipAuth()
  @ApiOperation({ summary: 'Add a new waitlist entry' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Entry added successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Entry already exists' })
  @ApiBody({ type: CreateWaitlistEntryDTO })
  async addWaitlistEntry(@Body() createWaitlistEntryDTO: CreateWaitlistEntryDTO) {
    try {
      return await this.waitlistService.addWaitlistEntry(createWaitlistEntryDTO);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  @skipAuth()
  @ApiOperation({ summary: 'Get all waitlist entries' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entries fetched successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entries not found' })
  async getWaitlistEntries() {
    try {
      return await this.waitlistService.getWaitlistEntries();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':email')
  @skipAuth()
  @ApiOperation({ summary: 'Delete a waitlist entry by email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entry deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entry not found' })
  @ApiParam({ name: 'email', type: String, description: 'Email of the entry to delete' })
  async deleteWaitlistEntry(@Param('email') email: string) {
    try {
      return await this.waitlistService.deleteWaitlistEntry(email);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':email')
  @skipAuth()
  @ApiOperation({ summary: 'Get a waitlist entry by email' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Entry fetched successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Entry not found' })
  @ApiParam({ name: 'email', type: String, description: 'Email of the entry to fetch' })
  async getWaitlistEntry(@Param('email') email: string) {
    try {
      return await this.waitlistService.getWaitlistEntry(email);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
