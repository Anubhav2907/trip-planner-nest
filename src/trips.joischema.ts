/* eslint-disable prettier/prettier */
import * as Joi from '@hapi/joi';
import * as JoiDate from '@hapi/joi-date';
import { CreateTripDto } from './dto/create-trip.dto';
export default Joi.object<CreateTripDto>({
  destination: Joi.string().min(3).max(30).required(),
  start_date: Joi.date().min('2020-01-01').max('2099-12-31').required(),
  end_date: Joi.date().min('2020-01-01').max('2099-12-31').required(),
  comment: Joi.string().min(10).required(),
});
