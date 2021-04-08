import { Controller, Post, Body, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from './request/login.dto';
import { LoginResponse } from './response/login.dto';
import { EmptyObject } from '../../shared/response/emptyObject.dto';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { LoginBase } from './response/loginBase.dto';
import { Causes } from '../../config/exception/causes';
import { EmptyObjectBase } from '../../shared/response/emptyObjectBase.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Register } from './request/register.dto';
import { RegisterResponse } from './response/register.dto';
import { RegisterBase } from './response/registerBase.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({
    tags: ['auth'],
    operationId: 'register',
    summary: 'Register',
    description: 'Register a new user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: RegisterBase,
  })
  async register(@Body() data: Register): Promise<RegisterResponse | EmptyObject> {
    const duplicatedUser = await this.authService.checkDuplicatedUser(data);
    if (duplicatedUser) {
      throw Causes.DUPLICATED_EMAIL_OR_USERNAME;
    }
    const user = await this.authService.registerUser(data);
    return user;
  }

  @Post('/login')
  @ApiOperation({
    tags: ['auth'],
    operationId: 'login',
    summary: 'Login',
    description: 'Login',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: LoginBase,
  })
  async login(@Body() data: Login): Promise<LoginResponse | EmptyObject> {
    const user = await this.authService.validateUser(data);
    if (!user) {
      throw Causes.EMAIL_OR_PASSWORD_INVALID;
    }
    return this.authService.login(user);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    tags: ['auth'],
    operationId: 'logout',
    summary: 'Logout',
    description: 'Logout',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: EmptyObjectBase,
  })
  async logout(@Req() request: any): Promise<EmptyObject> {
    const token = request.headers.authorization;
    this.authService.logout(token);
    return new EmptyObject();
  }
}
