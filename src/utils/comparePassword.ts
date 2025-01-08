import * as bcryptjs from 'bcryptjs';
export const comparePassword = async (password, userPassword) => {
  return await bcryptjs.compare(password, userPassword);
};
