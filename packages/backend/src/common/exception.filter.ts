import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface DriverError extends Error {
  code: string;
  message: string;
  detail?: string;
  status?: number;
}

interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp?: string;
  path?: string;
}

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.getRequest();

    if (exception instanceof QueryFailedError) {
      this.handleDatabaseError(
        exception as QueryFailedError<DriverError>,
        response,
        request,
      );
    } else if (exception instanceof HttpException) {
      this.handleHttpException(exception, response, request);
    } else if (exception instanceof Error) {
      this.handleGenericError(exception, response, request);
    } else {
      this.handleUnknownError(response, request);
    }
  }

  private handleDatabaseError(
    exception: QueryFailedError,
    response: Response,
    request: any,
  ): void {
    const driverError = exception.driverError as DriverError;

    if (!driverError) {
      this.sendErrorResponse(response, request, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Database error occurred',
      });
      return;
    }

    const { status, message } = this.mapDatabaseError(driverError);

    this.sendErrorResponse(response, request, {
      statusCode: status,
      message,
    });
  }

  private mapDatabaseError(driverError: DriverError): {
    status: number;
    message: string;
  } {
    switch (driverError.code) {
      case '23505': // Postgres unique_violation
      case 'ER_DUP_ENTRY': // MySQL duplicate
        return {
          status: HttpStatus.CONFLICT,
          message:
            this.extractConstraintMessage(driverError.detail) ||
            'Duplicate entry found',
        };

      case '23503': // Postgres foreign_key_violation
      case 'ER_NO_REFERENCED_ROW_2': // MySQL foreign key
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Referenced record does not exist',
        };

      case '23502': // Postgres not_null_violation
      case '23514': // Postgres check_violation
        return {
          status: HttpStatus.BAD_REQUEST,
          message:
            this.extractConstraintMessage(driverError.detail) ||
            'Required field is missing',
        };

      case '22001': // Postgres string_data_right_truncation
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Data too long for field',
        };

      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database operation failed',
        };
    }
  }

  private extractConstraintMessage(detail?: string): string | null {
    if (!detail) return null;

    // Extract meaningful constraint violation messages
    const keyMatch = detail.match(/Key \((.+?)\)=/);
    if (keyMatch) {
      return `Field '${keyMatch[1]}' violates constraint`;
    }

    return detail;
  }

  private handleHttpException(
    exception: HttpException,
    response: Response,
    request: any,
  ): void {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as Record<string, any>;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      message = Array.isArray(responseObj.message)
        ? responseObj.message.join(', ')
        : responseObj.message || exception.message;
    } else {
      message = exception.message;
    }

    this.sendErrorResponse(response, request, {
      statusCode: status,
      message,
      error: exception.constructor.name,
    });
  }

  private handleGenericError(
    exception: Error,
    response: Response,
    request: any,
  ): void {
    console.error('Unhandled error:', exception);

    this.sendErrorResponse(response, request, {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : exception.message,
    });
  }

  private handleUnknownError(response: Response, request: any): void {
    console.error('Unknown error type caught by exception filter');

    this.sendErrorResponse(response, request, {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }

  private sendErrorResponse(
    response: Response,
    request: Request,
    errorResponse: ErrorResponse,
  ): void {
    const fullErrorResponse: ErrorResponse = {
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(errorResponse.statusCode).json(fullErrorResponse);
  }
}
