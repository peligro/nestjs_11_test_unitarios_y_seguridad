import { Repository, ObjectLiteral } from 'typeorm';

export const createMockRepository = <T extends ObjectLiteral>(): jest.Mocked<Repository<T>> => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  // Añade otros métodos si los usas, por ejemplo:
  // count: jest.fn(),
  // findAndCount: jest.fn(),
  // etc.
} as unknown as jest.Mocked<Repository<T>>);