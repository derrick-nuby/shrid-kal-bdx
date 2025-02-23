import {ArgumentsHost, Catch, ExceptionFilter} from "@nestjs/common";
import {ThrottlerException} from "@nestjs/throttler";
import {Response, Request} from "express";
import {ConfigService} from "@nestjs/config";

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
    constructor(private readonly configService: ConfigService) {}

    catch(exception: ThrottlerException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const ttl = this.configService.get<number>('THROTTLE_TTL', 300000);
        const minutes = Math.ceil(ttl / 60000);
        const timeUnit = minutes === 1 ? 'minute' : 'minutes';

        response.status(429).json({
            message: `Too many requests, please try again after ${minutes} ${timeUnit}`,
            error: 'Too Many Requests',
            statusCode: 429,
        });
    }
}