import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateTrashDto from './dto/create-trash.dto';
import { Trash } from './schema/trash.schema';

@Injectable()
export class TrashService {
  constructor(@InjectModel(Trash.name) private trashModel: Model<Trash>) {}

  async create(createTrashDto: CreateTrashDto) {
    const createdTrash = new this.trashModel(createTrashDto);
    return createdTrash.save();
  }

  async update(id: string, createTrashDto: CreateTrashDto) {
    const updatedTrash = await this.trashModel.findByIdAndUpdate(
      id,
      createTrashDto,
      { new: true },
    );
    return updatedTrash.save();
  }
}
