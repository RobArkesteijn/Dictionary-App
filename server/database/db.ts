import { MongoClient, DeleteResult } from 'mongodb';
import path from 'path';
import dotenv from 'dotenv';
import { User } from '../types'

dotenv.config({ path: path.join(__dirname, '..', 'mongodb.env') })
const username = process.env.MONGO_INITDB_ROOT_USERNAME;
const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const database = process.env.MONGO_INITDB_DATABASE;

const MONGODB_URI = `mongodb+srv://${username}:${password}@cluster0.ftsnbb8.mongodb.net/test`;

const createNewUser = async (user: string, pass: string):Promise<User> => {
  const newUser: User = {
    user: user,
    password: pass,
    words: [{
      word: ''
    }],
  };
  
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(database);
    const userExistence = await db.collection<User>('user').findOne({ user: user });
    if (userExistence) {
      throw new Error('This user already exists... Log In');
    }

    await db.collection<User>('user').insertOne(newUser);
  
    client.close();
  
    return newUser;
};

const getUserByName = async (username: string):Promise<User | null> => {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(database);
  const user = await db.collection<User>('user').findOne({ user: username });
  client.close();
  return user;
};

const updateUser = async (userAccount: User):Promise<User> => {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(database);
  const existingUser = await db.collection('user').findOne({ user: userAccount.user });
  if (!existingUser) {
    throw new Error(`User with username ${userAccount.user} not found`);
  }
  const updatedUser = { ...existingUser, ...userAccount };
  await db.collection('user').updateOne({ user: userAccount.user }, { $set: updatedUser });
  client.close();
  return updatedUser;
};

// const deleteWord = async (userAccount: User, word: string) => {
//   const client = await MongoClient.connect(MONGODB_URI);
//   const db = client.db(database);

//   const query = { user: userAccount.user };
//   const update = { $pull: { words: { word } } };
//   const options = { returnOriginal: false };

//   const updatedUser = await db.collection('carts').findOneAndUpdate(query, update, options);

//   client.close();

//   return updatedUser;
// };


  export default {
    createNewUser,
    getUserByName,
    updateUser
  };