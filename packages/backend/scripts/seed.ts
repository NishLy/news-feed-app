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
  const adminExists1 = await userService.findByUsername('admin1');
  const adminExists2 = await userService.findByUsername('admin2');

  if (!adminExists) {
    await authService.register({
      username: 'admin',
      password: 'password123',
    });
    console.log('✅ Admin user seeded');
  } else {
    console.log('⚠️ Admin already exists, skipping');
  }

  if (!adminExists1)
    await authService.register({
      username: 'admin1',
      password: 'password123',
    });

  if (!adminExists2)
    await authService.register({
      username: 'admin2',
      password: 'password123',
    });

  await app.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
