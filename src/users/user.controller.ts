// src/users/users.controller.ts
import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@app/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ ADD THIS ENDPOINT
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.usersService.findAll();
  }
}
