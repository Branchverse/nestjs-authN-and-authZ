import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel.create(createUserDto);
      user.password = undefined
      this.logger.debug(
        `The user (id = ${user._id}) has been created successfully.`
      );
      return user.toObject() as UserDocument;
    } catch (error) {
      if (error.code == '11000') {
        this.logger.warn(
          `Creating a user (email = ${createUserDto.email}) failed due to a duplicate conflict.`
        );
        throw new ConflictException('This user email already exists');
      }

      /* istanbul ignore next */
      this.logger.error(
        `An error has occured while creating a new user: (${error})`
      );
      /* istanbul ignore next */
      throw new InternalServerErrorException();
    }
  }

  async getByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
