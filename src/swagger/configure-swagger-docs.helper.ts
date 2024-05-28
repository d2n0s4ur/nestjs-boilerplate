import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const SWAGGER_ENVS = ['development', 'staging'];

export function configureSwaggerDocs(
  app: INestApplication,
  configService: ConfigService,
) {
  if (SWAGGER_ENVS.includes(configService.get<string>('NODE_ENV'))) {
    const options = new DocumentBuilder()
      .setTitle('API Docs')
      .setDescription('API Docs')
      .setVersion('1.0')
      .addTag('API Docs')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api-docs', app, documentFactory);
  }
}
