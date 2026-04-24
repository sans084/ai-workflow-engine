import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestDocument, RequestEntity } from './schemas/request.schema';
import { CreateRequestDto } from './dto/create-request.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel(RequestEntity.name)
    private readonly requestModel: Model<RequestDocument>,
    private readonly aiService: AiService,
  ) {}

  async create(dto: CreateRequestDto): Promise<RequestDocument> {
    const saved = await this.requestModel.create(dto);

    // Fire-and-forget: respond 201 immediately, enrich in background
    setImmediate(() => {
      this.aiService.enrichRequest(
        saved._id.toString(),
        saved.name,
        saved.email,
        saved.message,
      );
    });

    return saved;
  }

  async remove(id: string): Promise<void> {
    await this.requestModel.findByIdAndDelete(id);
  }

  async findAll(page = 1, limit = 10, category?: string) {
    const filter: Record<string, unknown> = {};
    if (category && category !== 'all') {
      filter.category = category;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.requestModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.requestModel.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}