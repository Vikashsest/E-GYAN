// import { Module } from '@nestjs/common';
// import { UserModule } from './modules/user/user.module';
// import { AuthModule } from './modules/auth/auth.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { databaseConfig } from './config/database.config';
// import { ConfigModule } from '@nestjs/config';
// import { BookModule } from './modules/book/book.module';
// import { AuthController } from './modules/auth/auth.controller';
// import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from './common/guard/role.guard';
// import { AdminModule } from './modules/admin/admin.module';
// import { SchoolModule } from './modules/school/school.module';
// import { ClassModule } from './modules/class/class.module';
// import { SubjectModule } from './modules/subject/subject.module';
// import { AssignmentModule } from './modules/assignment/assignment.module';
// import { AnalyticsModule } from './modules/analytics/analytics.module';
// import { StudentModule } from './modules/student/student.module';
// import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
// import { DashboardModule } from './modules/dashboard/dashboard.module';
// import { NextcloudModule } from './modules/nextcloud/nextcloud.module';
// import { RepositoryModule } from './modules/repository/repository.module';
// import { AssessmentsModule } from './modules/assessments/assessments.module';
// import { QuizzesModule } from './modules/quizzes/quizzes.module';
// import { Module } from './quizzes/modules/.module';
// import { AssessmentsModule } from './modules/assessments/assessments.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: '.env',
//     }),

//     TypeOrmModule.forRoot(databaseConfig),

//     UserModule,
//     AuthModule,
//     BookModule,
//     AdminModule,
//     SchoolModule,
//     ClassModule,
//     SubjectModule,
//     AssignmentModule,
//     AnalyticsModule,
//     StudentModule,
//     DashboardModule,
//     NextcloudModule,
//     RepositoryModule,
//     AssessmentsModule,
//     Module,
//     QuizzesModule

//   ],
//   controllers: [AuthController],
//   providers: [
//     {
//       provide: APP_GUARD,
//       useClass: JwtAuthGuard,
//     },
//     {
//       provide: APP_GUARD,
//       useClass: RolesGuard,
//     },
//   ]
// })
// export class AppModule {}

import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './modules/book/book.module';
import { AuthController } from './modules/auth/auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guard/role.guard';
import { AdminModule } from './modules/admin/admin.module';
import { SchoolModule } from './modules/school/school.module';
import { ClassModule } from './modules/class/class.module';
import { SubjectModule } from './modules/subject/subject.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { StudentModule } from './modules/student/student.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { NextcloudModule } from './modules/nextcloud/nextcloud.module';
import { RepositoryModule } from './modules/repository/repository.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { ChatModule } from './modules/chat/chat.module';
import { CurrentAffairsModule } from './modules/current-affairs/current-affairs.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthSessionModuleModule } from './modules/auth-session-module/auth-session-module.module';
import { StudentBookAssignModule } from './modules/student-book-assign/student-book-assign.module';
import { AnnoucementsModule } from './modules/annoucements/annoucements.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ModulesModule } from './ai/modules/modules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot(databaseConfig),

    UserModule,
    AuthModule,
    BookModule,
    AdminModule,
    SchoolModule,
    ClassModule,
    SubjectModule,
    AnalyticsModule,
    StudentModule,
    DashboardModule,
    NextcloudModule,
    RepositoryModule,
    AssessmentsModule,
    QuizzesModule,
    ChatModule,
    CurrentAffairsModule,
    AiModule,
    AuthSessionModuleModule,
    StudentBookAssignModule,
    AnnoucementsModule,
    WebsocketModule,
    ReportsModule,
    ModulesModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
