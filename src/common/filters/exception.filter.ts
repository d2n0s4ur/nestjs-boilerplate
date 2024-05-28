import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message;

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        message = 'BAD_REQUEST';
        break;
      case HttpStatus.UNAUTHORIZED:
        message = 'UNAUTHORIZED';
        break;
      case HttpStatus.FORBIDDEN:
        message = 'FORBIDDEN';
        break;
      case HttpStatus.NOT_FOUND:
        message = 'NOT_FOUND';
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        message = 'INTERNAL_SERVER_ERROR';
        break;
      default:
        message = 'SOMETHING_WENT_WRONG';
        break;
    }

    response.status(status).json({
      code: status,
      message,
      data: null,
    });
  }
}
