import { HttpException, ArgumentsHost } from '@nestjs/common';
import { HttpExceptionFilter } from './HttpExceptionFilter.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
  });

  const createMockArgumentsHost = (body: any) => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      req: { body },
    };

    const mockHost: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as any;

    return { mockHost, mockResponse };
  };

  it('should respond with the request body if it is an object', () => {
    const exception = new HttpException('Forbidden', 403);
    const { mockHost, mockResponse } = createMockArgumentsHost({ foo: 'bar' });

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: exception.getResponse(),
      response: { foo: 'bar' },
    });
  });

  it('should respond with empty object if body is not an object', () => {
    const exception = new HttpException('Bad Request', 400);
    const { mockHost, mockResponse } = createMockArgumentsHost('not-an-object');

    filter.catch(exception, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: exception.getResponse(),
      response: {},
    });
  });
});
