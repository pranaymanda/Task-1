import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'steps',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'timestamp', type: 'number' },
        { name: 'step_count', type: 'number' },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
