import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { MongoIdDto } from '../shared/validation/mongoId.dto';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({strategy: 'excludeAll'})
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param() {id}: MongoIdDto) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param() {id}: MongoIdDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param() {id}: MongoIdDto) {
    return this.usersService.remove(id);
  }
}
