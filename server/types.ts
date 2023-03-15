interface User {
  user: string,
  password: string,
  words: Array<{ word: string }>,
}

interface Word {
  word: string;
  understands: boolean;
}

export { User, Word };