import * as bcryptjs from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcryptjs.hash(password, 10);
};
