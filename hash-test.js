import bcrypt from 'bcryptjs';

const plainPass = 'links234';

const run = async () => {
  const hashed = await bcrypt.hash(plainPass, 10);
  console.log('Gehasht:', hashed);
};

run();
