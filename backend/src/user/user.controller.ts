import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UserService } from './user.service';
import { User, ValidateResponse } from './user.schema';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   *
   *
   * @param {Express.Multer.File} file
   * @param {string} [dryRun]
   * @return {*}
   * @memberof UserController
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@UploadedFile() file: Express.Multer.File, @Query('dryRun') dryRun?: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.includes('csv') && !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('File must be a CSV');
    }

    const isDryRun = dryRun === 'true';
    return this.userService.uploadCsv(file.buffer, isDryRun);
  }

  /**
   *
   *
   * @param {Partial<User>} data
   * @return {*}  {Promise<ValidateResponse>}
   * @memberof UserController
   */
  @Post('validate')
  async validateUser(@Body() data: Partial<User>): Promise<ValidateResponse> {
    return this.userService.validateUser(data);
  }

  /**
   * Save a revalidated user to storage
   *
   * @param {Partial<User>} data
   * @return {*}  {Promise<User>}
   * @memberof UserController
   */
  @Post('save-revalidated')
  async saveRevalidatedUser(@Body() data: Partial<User>): Promise<User> {
    return this.userService.saveRevalidatedUser(data);
  }

  /**
   *
   *
   * @param {Response} res
   * @memberof UserController
   */
  @Get('export')
  async exportCsv(@Res() res: Response) {
    const csvContent = await this.userService.exportCsv();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csvContent);
  }
}
