import { Test, TestingModule } from '@nestjs/testing';
import { CratesController } from './crates.controller';

describe('CratesController', () => {
  let controller: CratesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CratesController],
    }).compile();

    controller = module.get<CratesController>(CratesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
