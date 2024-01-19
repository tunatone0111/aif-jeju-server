import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RouteService } from './route.service';

@Module({
  imports: [HttpModule],
  providers: [RouteService],
})
export class RouteModule {}
