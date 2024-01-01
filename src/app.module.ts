/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramBotService } from './telegram-bot';
import { AdminModule } from './admin/admin.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { QuestionService } from './question/question.service';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
config();
@Module({
  imports: [AdminModule,DatabaseModule,MongooseModule.forRootAsync({
    useFactory: () => ({
      uri: process.env.MONGODB_URI,
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    }),
  }),
  ],
  controllers: [AppController,AdminController],
  providers: [AppService,QuestionService,TelegramBotService,AdminService],
})
export class AppModule {}
