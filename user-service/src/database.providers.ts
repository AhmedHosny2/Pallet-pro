import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      const uri = 'mongodb+srv://test:test@cluster0.lvfdivg.mongodb.net/';
      return await mongoose.connect(uri);
    },
  },
];

