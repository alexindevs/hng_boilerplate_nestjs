import { Test, TestingModule } from '@nestjs/testing';
import { WaitlistService } from '../waitlist.service';
import { Repository } from 'typeorm';
import { WaitlistEntry } from '../entities/waitlist.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateWaitlistEntryDTO } from '../dto/create-waitlist-entry.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('WaitlistService', () => {
  let service: WaitlistService;
  let repository: Repository<WaitlistEntry>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaitlistService,
        {
          provide: getRepositoryToken(WaitlistEntry),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<WaitlistService>(WaitlistService);
    repository = module.get<Repository<WaitlistEntry>>(getRepositoryToken(WaitlistEntry));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addWaitlistEntry', () => {
    it('should add a new entry successfully', async () => {
      const dto: CreateWaitlistEntryDTO = { name: 'Test User', email: 'test@example.com' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue({ id: 'user-id', ...dto } as WaitlistEntry);

      const result = await service.addWaitlistEntry(dto);

      expect(result.status_code).toBe(HttpStatus.CREATED);
      expect(result.message).toBe('Entry added successfully');
      expect(result.data).toEqual(expect.objectContaining(dto));
    });

    it('should throw an exception if entry already exists', async () => {
      const dto: CreateWaitlistEntryDTO = { name: 'Test User', email: 'test@example.com' };
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue({ id: '1', ...dto, created_at: new Date(), updated_at: new Date() } as WaitlistEntry);

      await expect(service.addWaitlistEntry(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('getWaitlistEntries', () => {
    it('should return all entries', async () => {
      const mockEntries = [
        { id: '1', name: 'User 1', email: 'user1@example.com', created_at: new Date(), updated_at: new Date() },
        { id: '2', name: 'User 2', email: 'user2@example.com', created_at: new Date(), updated_at: new Date() },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(mockEntries as WaitlistEntry[]);

      const result = await service.getWaitlistEntries();

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.message).toBe('Entries fetched successfully');
      expect(result.data).toEqual(mockEntries);
    });

    it('should throw an exception if no entries found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue(null);

      await expect(service.getWaitlistEntries()).rejects.toThrow(HttpException);
    });
  });

  describe('deleteWaitlistEntry', () => {
    it('should delete an entry successfully', async () => {
      const mockEntry = { id: '1', name: 'Test User', email: 'test@example.com' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockEntry as WaitlistEntry);
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.deleteWaitlistEntry('test@example.com');

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.message).toBe('Entry deleted successfully');
      expect(result.data).toEqual(mockEntry);
    });

    it('should throw an exception if entry not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteWaitlistEntry('nonexistent@example.com')).rejects.toThrow(HttpException);
    });
  });

  describe('getWaitlistEntry', () => {
    it('should return a specific entry', async () => {
      const mockEntry = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        created_at: new Date(),
        updated_at: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockEntry as WaitlistEntry);

      const result = await service.getWaitlistEntry('test@example.com');

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.message).toBe('Entry fetched successfully');
      expect(result.data).toEqual(mockEntry);
    });

    it('should throw an exception if entry not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.getWaitlistEntry('nonexistent@example.com')).rejects.toThrow(HttpException);
    });
  });
});
