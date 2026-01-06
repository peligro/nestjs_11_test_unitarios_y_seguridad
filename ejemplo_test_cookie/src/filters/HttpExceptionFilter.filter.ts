import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const statusResponse = exception.getResponse();
    const body: unknown = response.req.body;

    if (typeof body === 'object' && body !== null) {
      response.status(status).json({
        status: statusResponse,
        // statusCode: status,
        // message: exception.message,
        response: body,
      });
    } else {
      response.status(status).json({
        status: statusResponse,
        // statusCode: status,
        // message: exception.message,
        response: {},
      });
    }
  }
}
