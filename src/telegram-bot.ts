/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import * as cron from 'node-cron';
import { config } from 'dotenv';
import * as mongoose from 'mongoose';
config();
import { AdminService } from './admin/admin.service';
import { QuestionService } from './question/question.service';


const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CITY = process.env.CITY;

interface WeatherResponse {
  weather: {
    description: string;
  }[];
  main: {
    temp: number;
  };
}

@Injectable()
export class TelegramBotService {
  private bot: TelegramBot;
  private subscribedUsers: Set<number> = new Set<number>();

  constructor(
        private readonly adminService: AdminService, 
        private questionService: QuestionService,
      ) {
    
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    

    this.registerCommands();
  }

  private registerCommands() {
    console.log("hello");

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      try {
        const question = await this.questionService.findQuestionByTitle('create rectangles');
        if (question) {
          this.bot.sendPhoto(chatId, question.imageSrc, {
            caption: `Here's the image for ${question.title}`,
          });
        } else {
          this.bot.sendMessage(chatId, 'No matching question found.');
        }
      } catch (error) {
        console.error('Failed to fetch question', error);
        this.bot.sendMessage(chatId, 'An error occurred while fetching data.');
      }
    });
  }
  
}
