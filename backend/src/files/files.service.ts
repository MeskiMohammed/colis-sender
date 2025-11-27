import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FilesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ url, orderId }: { url: string; orderId: number }) {
    await this.prismaService.pic.create({ data: { url, orderId } });
  }

  async remove(id: number) {
    const pic = await this.prismaService.pic.delete({ where: { id } });
    if (pic) await fs.unlink(path.join(process.cwd(), pic.url)).catch(() => null);
    return pic;
  }
}
