import { ConfigService } from '@nestjs/config';
import { TEST_MESSAGES } from './test-messages';
import { HttpException } from '@nestjs/common';

export const createMockConfigService = (): jest.Mocked<ConfigService> => {
  const getMessage = (key: string): string => {
    const map: Record<string, string> = {
      MESSAGE_CUSTOM_SUCCESS: TEST_MESSAGES.SUCCESS,
      MESSAGE_CUSTOM_SUCCESS_UPDATE: TEST_MESSAGES.UPDATE,
      MESSAGE_CUSTOM_SUCCESS_DELETE: TEST_MESSAGES.DELETE,
      MESSAGE_CUSTOM_ERROR: TEST_MESSAGES.ERROR,
      MESSAGE_CUSTOM_RESOURCE_NOT_AVAILABLE: TEST_MESSAGES.NOT_FOUND,
      MESSAGE_ALREADY_EXISTS: TEST_MESSAGES.ALREADY_EXISTS,
      MESSAGE_CANNOT_BE_DELETED: TEST_MESSAGES.CANNOT_DELETE,
      MESSAGE_ERROR_NAME_IS_EMPTY: TEST_MESSAGES.NAME_IS_EMPTY,
    };
    return map[key] || '';
  };

  return {
    get: jest.fn().mockImplementation(getMessage),
  } as unknown as jest.Mocked<ConfigService>;
};

export const expectHttpExceptionMessage = async (
  promise: Promise<any>,
  expectedMessage: string,
) => {
  try {
    await promise;
    throw new Error('Expected HttpException to be thrown');
  } catch (error) {
    expect(error).toBeInstanceOf(HttpException);
    const response = (error as HttpException).getResponse() as any;
    expect(response.error).toBe(expectedMessage);
  }
};