import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import { RouteService } from 'src/route/route.service';
import CreateTrashDto from './dto/create-trash.dto';
import { Trash } from './schema/trash.schema';
import { TrashType } from './schema/trashType.enum';

@Injectable()
export class TrashService {
  constructor(
    private readonly routeService: RouteService,
    @InjectModel(Trash.name) private trashModel: Model<Trash>,
  ) {}

  async create(createTrashDto: CreateTrashDto) {
    const createdTrash = new this.trashModel({
      distant: await this.routeService.getDistanceFromOffice(
        createTrashDto.location,
      ),
      location: createTrashDto.location,
      type: this.getRandomTrashTypes(),
    });
    return createdTrash.save();
  }

  async randomRead(size: number): Promise<Trash[]> {
    return await this.trashModel.aggregate([{ $sample: { size } }]).exec();
  }

  async update(id: string, createTrashDto: CreateTrashDto) {
    const updatedTrash = await this.trashModel.findByIdAndUpdate(
      id,
      createTrashDto,
      { new: true },
    );
    return updatedTrash?.save();
  }

  getRandomTrashTypes() {
    const number =
      Math.floor(Math.random() * (Object.keys(TrashType).length - 1)) + 1;
    return _.sampleSize(TrashType, number);
  }
}
