/* eslint-disable prettier/prettier */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('**********************');
    console.log(request);
    if (!request.authorization) {
      console.log(request.authorization);
    }
    return request.isAuthenticated();
  }
}
