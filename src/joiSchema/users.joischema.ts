/* eslint-disable prettier/prettier */
import * as Joi from '@hapi/joi';
import { CreateUserDto } from '../dto/create-user.dto';
export default Joi.object<CreateUserDto>({
  Name: Joi.string().min(3).max(30).required(),

  Email: Joi.string().required(),

  Password: Joi.string().min(3).required(),

  Role: Joi.string().valid('User', 'Manager', 'Admin').required(),
});
