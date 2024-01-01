import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cron from 'node-cron';

@Injectable()
export class CronService {
  startCronJob(): void {
    cron.schedule('* * * * * *', async () => {
        try {
          const response = await axios.get('http://localhost:3002/admin/api-key');
          console.log('Ping successful:', response.status);
        } catch (error) {
          console.error('Ping failed:', error.message);
        }
    }, {timezone:'Asia/Calcutta'});
  }
}
