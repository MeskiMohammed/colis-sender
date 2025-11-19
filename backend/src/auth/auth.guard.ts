import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;

    if (!auth) return false;

    try {
      const token = auth.split(" ")[1];
      const decoded = this.jwt.verify(token,{secret:process.env.JWT_SECRET});
      req.user = decoded;
      return true;
    } catch (e) {
      return false;
    }
  }
}
