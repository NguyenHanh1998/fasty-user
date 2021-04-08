import { Test, TestingModule } from '@nestjs/testing';
import { CratesService } from './crates.service';

describe('CratesService', () => {
  let service: CratesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CratesService],
    }).compile();

    service = module.get<CratesService>(CratesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
