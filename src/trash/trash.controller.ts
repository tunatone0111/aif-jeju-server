import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { RouteService } from 'src/route/route.service';
import { CreateTrashDto, GetTrashPriorityDto } from './dto';
import { CreateTrashBatchDto } from './dto/create-trash.dto';
import { TrashService } from './trash.service';

@Controller('trash')
export class TrashController {
  constructor(
    private readonly trashService: TrashService,
    private readonly routeService: RouteService,
  ) {}

  @Get('/priority')
  @ApiResponse({ status: 200, type: GetTrashPriorityDto })
  async getTrashPriority(
    @Query('random') random: boolean,
    @Query('size', new ParseIntPipe()) size: number,
  ): Promise<GetTrashPriorityDto> {
    const trashList = await this.trashService.randomRead(size);

    const res = this.routeService.solveTSP(
      await this.routeService.getDistanceMatrix(
        trashList.map((t) => t.location),
      ),
    );

    return res.map((i) => ({
      id: trashList[i - 1]._id.toString(),
      ...trashList[i - 1],
      _id: undefined,
      priority: i,
    }));
  }

  @Post('/')
  async createTrash(@Body() createTrashDto: CreateTrashDto) {
    return await this.trashService.create(createTrashDto);
  }

  @Post('/batch')
  async createTrashBatch(@Body() createTrashBatchDto: CreateTrashBatchDto) {
    for (const trash of createTrashBatchDto) {
      await this.trashService.create(trash);
    }
  }
}
