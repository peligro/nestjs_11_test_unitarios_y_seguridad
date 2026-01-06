import { Module } from '@nestjs/common';
import { PostgreSqlModule } from './postgre-sql/postgre-sql.module';

@Module({
  imports: [
   
    PostgreSqlModule,
  ],
  exports: [
    
    PostgreSqlModule,
  ],
})
export class DatabaseModule {}
