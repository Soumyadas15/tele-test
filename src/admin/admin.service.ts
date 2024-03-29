// admin.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  private apiKey = '3afaf6d8497970c3796e7353691b1f4a';
  private users: string[] = [];

  getApiKey(): string {
    return this.apiKey;
  }

  setApiKey(key: string): string {
    this.apiKey = key;
    return 'API key updated successfully';
  }

  getUsers(): string[] {
    return this.users;
  }
}
