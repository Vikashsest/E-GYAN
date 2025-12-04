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
// // app.use(express.static(join(__dirname, '..', '..', 'client', 'dist')));
// //   app.get('*', (req, res) => {
// //     res.sendFile(join(__dirname, '..', '..', 'client', 'dist', 'index.html'));
// //   });

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
//   res.setHeader("Content-Disposition", "inline; filename=chapter.pdf");
// res.setHeader("Accept-Ranges", "bytes");
// res.setHeader("Content-Type", "application/pdf");
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
//     const allowedOrigins = ['https://egyan.ptgn.in', 'http://localhost:5173','http://172.16.0.19:5173'];
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
// await app.listen(5000, '0.0.0.0');
// }
// bootstrap();

// // import * as dotenv from 'dotenv';
// // dotenv.config();

// // import { NestFactory } from '@nestjs/core';
// // import { AppModule } from './app.module';
// // import { ValidationPipe } from '@nestjs/common';
// // import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// // import { join } from 'path';
// // import cookieParser from 'cookie-parser';
// // import * as express from 'express';
// // import * as mime from 'mime-types';

// // async function bootstrap() {
// //   const app = await NestFactory.create(AppModule);

// //   // Cookie parser
// //   app.use(cookieParser());

// //   // Logging all requests
// //   app.use((req, res, next) => {
// //     console.log('URL:', req.url, 'METHOD:', req.method, 'ORIGIN:', req.headers.origin);
// //     next();
// //   });

// //   // ✅ CORS setup for credentials + preflight
// //   app.enableCors({
// //     origin: [
// //       'https://egyan.ptgn.in',
// //       'http://localhost:5173',
// //       'https://e-gyan-2.vercel.app',
// //      'http://172.16.0.9:5173'
// //     ],
// //     credentials: true,
// //     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
// //     allowedHeaders: [
// //       'Content-Type',
// //       'Authorization',
// //       'Accept',
// //       'Origin',
// //       'X-Requested-With',
// //     ],
// //   });

// //   // ✅ Handle OPTIONS preflight for all routes
// //   app.use((req, res, next) => {
// //     if (req.method === 'OPTIONS') {
// //       res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
// //       res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
// //       res.header(
// //         'Access-Control-Allow-Headers',
// //         'Content-Type,Authorization,Accept,Origin,X-Requested-With'
// //       );
// //       res.header('Access-Control-Allow-Credentials', 'true');
// //       return res.sendStatus(200);
// //     }
// //     next();
// //   });

// //   // ✅ Dynamic CORS for uploads
// //   app.use('/uploads', (req, res, next) => {
// //     res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
// //     res.header('Access-Control-Allow-Credentials', 'true');
// //     res.header('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
// //     res.header(
// //       'Access-Control-Expose-Headers',
// //       'Accept-Ranges, Content-Encoding, Content-Length, Content-Range'
// //     );
// //     res.header('Accept-Ranges', 'bytes');
// //     if (req.method === 'OPTIONS') return res.sendStatus(200);
// //     next();
// //   });

// //   // ✅ Serve uploads folder
// //   app.use('/uploads', express.static(join(__dirname, '..', 'uploads'), {
// //     setHeaders: (res, path) => {
// //       const contentType = mime.lookup(path) || 'application/octet-stream';
// //       res.setHeader('Content-Type', contentType);
// //     },
// //   }));

// //   // ✅ Global validation pipe
// //   app.useGlobalPipes(
// //     new ValidationPipe({
// //       whitelist: true,
// //       forbidNonWhitelisted: true,
// //       transform: true,
// //     })
// //   );

// //   // ✅ Swagger setup
// //   const swaggerConfig = new DocumentBuilder()
// //     .setTitle('eGyan API')
// //     .setDescription('API documentation for eGyan backend')
// //     .setVersion('1.0')
// //     .addTag('eGyan')
// //     .build();
// //   const document = SwaggerModule.createDocument(app, swaggerConfig);
// //   SwaggerModule.setup('swagger', app, document);

// //   // ✅ Serve frontend
// //   // app.use(express.static(join(__dirname, '..', 'frontend')));
// //   const server = app.getHttpAdapter().getInstance();
// //   server.get(/^\/(?!auth|books|students|swagger).*/, (req, res) => {
// //     res.sendFile(join(__dirname, '..', 'frontend', 'index.html'));
// //   });

// //   // ✅ Start server (Railway will assign a port)
// //   const PORT = process.env.PORT || 5000;
// //   await app.listen(PORT, '0.0.0.0');
// //   console.log(`Server is running at ${PORT}`);
// //   console.log('Swagger docs: http://localhost:5000/swagger');
// // }

// // bootstrap();

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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://egyan.ptgn.in',
        'http://localhost:5173',
        'http://localhost:5000',
        'http://172.16.0.19:5173',
      ];
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error(`CORS error: origin ${origin} not allowed`));
    },
    credentials: true,
  });

  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'uploads'), {
      setHeaders: (res, path) => {
        let contentType = mime.lookup(path);
        if (!contentType) {
          if (path.endsWith('.mp4')) contentType = 'video/mp4';
          else if (path.endsWith('.pdf')) contentType = 'application/pdf';
          else if (path.endsWith('.jpg') || path.endsWith('.jpeg'))
            contentType = 'image/jpeg';
          else if (path.endsWith('.png')) contentType = 'image/png';
        }

        if (contentType) res.setHeader('Content-Type', contentType);

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Range');
        res.setHeader(
          'Access-Control-Expose-Headers',
          'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
        );
        res.setHeader('Accept-Ranges', 'bytes');
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('eGyan API Docs')
    .setDescription('Complete API documentation for eGyan backend system')
    .setVersion('1.0')
    .addTag('eGyan')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // ✅ Server start
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT, '0.0.0.0');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📘 Swagger Docs available at http://localhost:${PORT}/swagger`);
}

bootstrap();
