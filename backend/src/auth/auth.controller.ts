import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("login")
  @HttpCode(200)
  login(@Body() body: any) {
    return this.auth.login(body.email, body.password);
  }
}
