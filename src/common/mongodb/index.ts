import mongoose from 'mongoose';
import { getEnv } from '../utils';

export const initMongo = async () => {
  await new Promise((resolve) => {
    const mongoUrl = `mongodb+srv://${getEnv('MONGO_DB_USERNAME')}:${getEnv(
      'MONGO_DB_PASSWORD',
    )}@${getEnv('MONGO_DB_HOST')}/${getEnv('MONGO_DB_DATABASE')}?retryWrites=true&w=majority`;

    mongoose
      .connect(mongoUrl)
      .then(() => {
        console.log('Successfully connected to mongodb');
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
      });
  });
};
