import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class Steps extends Model {
  static table = 'steps';
  
  static associations = {};
}
