import * as mongoose from 'mongoose';
import { env } from 'process';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      const uri = 'mongodb+srv://admin:ma82345678omm@cluster0.ynli9r8.mongodb.net/';
      // const uri = env.MONGODB_URI;
      return await mongoose.connect(uri);
    },
  },
];
