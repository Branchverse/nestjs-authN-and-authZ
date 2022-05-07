import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import RoleGuard from '../auth/guards/role.guard';
import { Role } from '../shared/enums/role';
import { MongoIdDto } from '../shared/validation/mongoId.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
@UseGuards(RoleGuard(Role.ADMIN))
@ApiTags('users')
@ApiCookieAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiCookieAuth()
  create(@Body() createUserDto: CreateUserDto) {
    return plainToInstance(User, this.usersService.create(createUserDto));
  }

  @Get()
  @ApiCookieAuth()
  findAll() {
    return plainToInstance(User, this.usersService.findAll());
  }

  @Get(':id')
  @ApiCookieAuth()
  findOne(@Param() { id }: MongoIdDto) {
    return plainToInstance(User, this.usersService.getById(id));
  }

  @Patch(':id')
  @ApiCookieAuth()
  update(@Param() { id }: MongoIdDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiCookieAuth()
  remove(@Param() { id }: MongoIdDto) {
    return this.usersService.remove(id);
  }
}
