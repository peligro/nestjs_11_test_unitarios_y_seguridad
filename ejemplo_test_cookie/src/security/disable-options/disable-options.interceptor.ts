import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class DisableOptionsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    if (request.method === 'OPTIONS') {
      // Devuelve 200 OK vacío (puedes cambiar por 405 si prefieres)
      response.status(200).end();
      return new Observable(subscriber => subscriber.complete());
    }

    return next.handle();
  }
}