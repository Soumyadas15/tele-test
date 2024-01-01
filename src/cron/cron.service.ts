import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cron from 'node-cron';

@Injectable()
export class CronService {
  startCronJob(): void {
    cron.schedule('0/10 * * * *', async () => {
        try {
          const response = await axios.get('https://telebot2-xvgp.onrender.com/admin/api-key');
          console.log('Ping successful:', response.status);
        } catch (error) {
          console.error('Ping failed:', error.message);
        }
      });
  }
}
