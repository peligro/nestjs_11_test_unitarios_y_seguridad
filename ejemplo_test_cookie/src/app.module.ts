import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './modulos/database/database.module';
import { HealthController } from './health/health.controller';
import { ProductsModule } from './modulos/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,        // 1 minuto
        limit: 100,        // máximo 100 solicitudes por IP en ese tiempo
        ignoreUserAgents: [], // opcional: ignorar ciertos user-agents 
      },
    ]),
    DatabaseModule,
    ProductsModule
  ],
  controllers: [AppController, HealthController],
  providers: [],
})
export class AppModule {}
