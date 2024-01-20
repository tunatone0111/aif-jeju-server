import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RouteService } from './route.service';

@Module({
  imports: [HttpModule],
  providers: [RouteService],
  exports: [RouteService],
})
export class RouteModule {}
