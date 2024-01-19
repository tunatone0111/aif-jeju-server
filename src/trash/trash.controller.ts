import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetTrashPriorityDto } from './dto';
import CreateTrashDto from './dto/create-trash.dto';
import { TrashService } from './trash.service';

@Controller('trash')
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Get('/priority')
  async getTrashPriority(): Promise<GetTrashPriorityDto[]> {
    return [
      {
        id: '1',
        type: ['plastic', 'metal'],
        distant: 2.1,
        location: {
          lat: 33.3910079,
          lng: 126.2220771,
        },
      },
      {
        id: '2',
        type: ['paper'],
        distant: 12.3,
        location: {
          lat: 37.4882919,
          lng: 127.0648862,
        },
      },
    ];
  }

  @Post('/')
  async createTrash(@Body() createTrashDto: CreateTrashDto) {
    return await this.trashService.create(createTrashDto);
  }
}
