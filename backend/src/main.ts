// import * as dotenv from 'dotenv';
// dotenv.config();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { join } from 'path';
// import cookieParser from 'cookie-parser';
// import * as express from 'express';
// import * as mime from 'mime-types'; // 👈 Add this

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.use(cookieParser());
// app.use(express.static(join(__dirname, '..', '..', 'client', 'dist')));
//   app.get('*', (req, res) => {
//     res.sendFile(join(__dirname, '..', '..', 'client', 'dist', 'index.html'));
//   });

//   // ✅ Swagger Setup
//   const config = new DocumentBuilder()
//     .setTitle('Swagger Test')
//     .setDescription('API documentation for managing all api')
//     .setVersion('1.0')
//     .addTag('swagger api')
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('swagger', app, document);
//   app.use(
//     '/uploads',
//     express.static(join(__dirname, '..', 'uploads'), {
//      setHeaders: (res, path) => {
//   let contentType = mime.lookup(path);
//   if (!contentType) {
//     if (path.endsWith('.mp4')) contentType = 'video/mp4';
//     else if (path.endsWith('.pdf')) contentType = 'application/pdf';
//     else if (path.endsWith('.jpg') || path.endsWith('.jpeg'))
//       contentType = 'image/jpeg';
//     else if (path.endsWith('.png')) contentType = 'image/png';
//   }

//   if (contentType) {
//     res.setHeader('Content-Type', contentType);
//   }

//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Range');
//   res.setHeader(
//     'Access-Control-Expose-Headers',
//     'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
//   );
//   res.setHeader('Accept-Ranges', 'bytes');
// }

//     }),
//   );

// // app.enableCors({
// //   origin: 'http://192.168.2.115:5173',
// //   credentials: true,
// // });
// // app.enableCors({
// //   origin: (origin, callback) => {
// //     const allowedOrigins = [
// //       'https://egyan.ptgn.in',
// //       'http://localhost:5173'
    
// //     ];

// //     if (!origin || allowedOrigins.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error(`CORS error: origin ${origin} not allowed`));
// //     }
// //   },
// //   credentials: true,
// // });
// app.enableCors({
//   origin: (origin, callback) => {
//     const allowedOrigins = ['https://egyan.ptgn.in', 'http://localhost:5173','http://172.16.0.28:5173'];
//     if (!origin || allowedOrigins.includes(origin)) callback(null, true);
//     else callback(new Error(`CORS error: origin ${origin} not allowed`));
//   },
//   credentials: true,
// });



//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );
// await app.listen(3000, '0.0.0.0');
// }
// bootstrap();



import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mime from 'mime-types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // ✅ CORS setup (works for credentials + preflight)
  const allowedOrigins = [
    'https://egyan.ptgn.in',
    'http://localhost:5173',
    'http://172.16.0.28:5173',
    'http://localhost:3000',
    'https://e-gyan-2.vercel.app',
    'https://e-gyan-f57z.vercel.app',
    'https://e-gyan-f57z-git-main-vikashs-projects-fdefda0d.vercel.app',
    'https://e-gyan-f57z-2kdw2svxy-vikashs-projects-fdefda0d.vercel.app'
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error(`CORS error: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Range'],
  });

  // ✅ Uploads static files with correct headers
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'uploads'), {
      setHeaders: (res, path) => {
        const contentType = mime.lookup(path) || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);

        res.setHeader('Access-Control-Allow-Origin', '*'); // uploads can be accessed by any origin
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
        res.setHeader(
          'Access-Control-Expose-Headers',
          'Accept-Ranges, Content-Encoding, Content-Length, Content-Range'
        );
        res.setHeader('Accept-Ranges', 'bytes');
      },
    })
  );

  // ✅ Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // ✅ Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('eGyan API')
    .setDescription('API documentation for eGyan backend')
    .setVersion('1.0')
    .addTag('eGyan')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  // ✅ Serve frontend
  app.use(express.static(join(__dirname, '..', 'frontend')));
  const server = app.getHttpAdapter().getInstance();
  server.get(/^\/(?!auth|books|students|swagger).*/, (req, res) => {
    res.sendFile(join(__dirname, '..', 'frontend', 'index.html'));
  });

  await app.listen(process.env.PORT || 5000, '0.0.0.0');
  console.log('Server running on http://localhost:5000');
  console.log('Swagger docs: http://localhost:5000/swagger');
}

bootstrap();
