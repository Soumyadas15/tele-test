import { Injectable } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class QuestionService {
  private db: Db;
  private client: MongoClient;

  constructor() {
    this.connect();
  }

  async connect() {
    try {
      this.client = new MongoClient(process.env.MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db(process.env.DB_NAME);

      console.log('Successfully connected to the database');
    } catch (error) {
      console.error('Error connecting to the database', error);
    }
  }

  async findQuestionByTitle(title: string) {
    try {
      const collection = this.db.collection('Question');
      const question = await collection.findOne({ title: title });
      return question;
    } catch (error) {
      console.error('Error finding question', error);
      throw error;
    }
  }

  async onClose() {
    await this.client.close();
  }
}
