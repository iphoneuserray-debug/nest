import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const config = new DocumentBuilder()
        .setTitle('Example')
        .setDescription('The cats API description')
        .setVersion('1.0')

        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            defaultModelsExpandDepth: 2,
            defaultModelExpandDepth: 2,
            defaultModelRendering: 'model',
        },
    });
    // enable validation globally
    import('class-transformer');
    import('class-validator');
    const { ValidationPipe } = await import('@nestjs/common');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    // http://localhost:3001/api-json Download swagger json document

    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
