import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should execte raw query', async () => {
    await expect(service.$executeRaw`SELECT 1 + 1`).resolves.toBe(1);
  });

  it('should return the response from database without any error', async () => {
    await expect(service.account.findMany()).resolves.toBeInstanceOf(Object);
  });
});
