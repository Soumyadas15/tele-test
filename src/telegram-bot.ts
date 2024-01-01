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
    console.log("Bot is starting...");

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const botUsername = 'moyemoyesoumya_bot'; 
    
      try {
        if (msg.text && msg.text.startsWith(`@${botUsername} find`)) {
          const searchString = msg.text.replace(`@${botUsername} find`, '').trim();
          if (searchString) {
            const question = await this.questionService.findQuestionByTitle(searchString);
    
            if (question) {
              const senderUsername = msg.from.username ? `@${msg.from.username}` : 'User';
              
              this.bot.sendPhoto(chatId, question.imageSrc, {
                caption: `${senderUsername}, here's the solution for "${question.title}"`,
              });
            } else {
              const senderUsername = msg.from.username ? `@${msg.from.username}` : 'User';
              
              this.bot.sendMessage(chatId, `${senderUsername}, no matching question found.`);
            }
          } else {
            const senderUsername = msg.from.username ? `@${msg.from.username}` : 'User';
            this.bot.sendMessage(chatId, `${senderUsername}, please provide a valid search string after "find".`);
          }
        }
      } catch (error) {
        console.error('Failed to fetch question', error);
        const senderUsername = msg.from.username ? `@${msg.from.username}` : 'User';
        
        this.bot.sendMessage(chatId, `${senderUsername}, an error occurred while fetching data.`);
      }
    });
    
  }
}
