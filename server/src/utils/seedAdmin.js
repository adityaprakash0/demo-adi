import User from '../models/User.js';

const seedAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return;
  }

  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

  if (existingAdmin) {
    return;
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    phone: ADMIN_PHONE,
    role: 'admin',
  });

  console.log(`Admin user seeded for ${ADMIN_EMAIL}`);
};

export default seedAdmin;

