import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class SetSecurityHeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    // 👇 Encabezados anti-caché (para API B2)
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Pragma', 'no-cache');

    // 👇 Eliminar encabezados que divulgan información (para WEB B3)
    response.removeHeader('Server');
    response.removeHeader('X-Powered-By');

    // 👇 Encabezados de seguridad OWASP (para API M1)
    response.setHeader('X-Frame-Options', 'DENY'); // Previene Clickjacking
    response.setHeader('X-Content-Type-Options', 'nosniff'); // Evita MIME sniffing
    response.setHeader('X-XSS-Protection', '1; mode=block'); // Activa el filtro XSS

    // 👇 Content Security Policy (CSP) - Recomendado por OWASP
    // Esta es una política muy restrictiva. Ajusta según tus necesidades.
    response.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';",
    );

    // 👇 Strict-Transport-Security (HSTS) - Solo si usas HTTPS
    // Si tu API está detrás de un proxy o balanceador que maneja HTTPS, puedes usar esto.
    // response.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    return next.handle();
  }
}