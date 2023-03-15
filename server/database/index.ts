import db from './db';
import { User, Word } from '../types';

const createUser = async (user: string, pass: string):Promise<User> => db.createNewUser(user, pass);

const getUser = async (username: string):Promise<User | null> => db.getUserByName(username);

const addWordsToUser = async (word: Word, user: User):Promise<User> => {
  user.words.push(word);
	if (user.words[0].word === ''){
		user.words.shift()
	}
  const updatedCart = await db.updateUser(user);
  return updatedCart;
};

export {
    createUser,
		getUser,
		addWordsToUser
}