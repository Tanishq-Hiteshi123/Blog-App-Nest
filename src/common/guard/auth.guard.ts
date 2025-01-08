import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const accessToken = this.extractTheToken(request);

      if (!accessToken) {
        throw new UnauthorizedException('UnAuthorised Access Denied');
      }
      const decodedData = this.jwtService.verify(accessToken);

      request.user = decodedData;

      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  extractTheToken(req: Request) {
    const accessToken = req.headers['authorization']?.split(' ')[1];

    return accessToken;
  }
}
