import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, VersioningType } from '@nestjs/common';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { configureSwaggerDocs } from './swagger/configure-swagger-docs.helper';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { configureAuthSwaggerDocs } from './swagger/configure-auth-swagger-docs.helper';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const isDevelopment = configService.get<string>('NODE_ENV') === 'development';
  const sessionSecret = configService.get<string>('SESSION_SECRET');
  const domain = configService.get<string>('DOMAIN_URL');

  // swagger settings
  // configureAuthSwaggerDocs(app, configService); // Using when you need to add authentication to the Swagger UI
  configureSwaggerDocs(app, configService);

  // cors
  app.enableCors({
    origin: isProduction ? `https://${domain}` : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  // session & cookie
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: isProduction ? `*.${domain}` : 'localhost',
      },
    }),
    cookieParser(),
  );

  // versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // using global response settings
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(3000);
  if (isDevelopment) {
    Logger.debug(`Url for OpenApi: ${await app.getUrl()}/api-docs`, 'Swagger');
  }
}
bootstrap();
