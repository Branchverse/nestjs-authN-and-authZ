import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { MongoIdDto } from '../shared/validation/mongoId.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
@Controller('users')
@ApiTags('users')
@ApiCookieAuth()
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
