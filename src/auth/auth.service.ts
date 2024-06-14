import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}
  async signUp(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new BadRequestException({ message: 'email-exists' });
    }
    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(password, salt);

    const role = 'student';

    const newUser = await this.usersService.create(email, hash, salt, role);

    const accessToken = await this.jwtService.signAsync({
      id: newUser.id,
      email: newUser.email,
      role: role,
    });
    return { accessToken };
  }
  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const hash = this.passwordService.getHash(password, user.salt);

    if (hash !== user.hash) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return { accessToken };
  }
}
