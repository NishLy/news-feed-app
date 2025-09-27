import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userService = app.get(UserService);
  const authService = app.get(AuthService);

  const adminExists = await userService.findByUsername('admin');

  if (!adminExists) {
    await authService.register({
      username: 'admin',
      password: 'password123',
    });
    console.log('✅ Admin user seeded');
  } else {
    console.log('⚠️ Admin already exists, skipping');
  }

  await app.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
