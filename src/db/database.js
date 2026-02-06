import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Q } from '@nozbe/watermelondb';
import { schema } from './schema';
import Steps from './models/Steps';

const adapter = new SQLiteAdapter({
  schema,
  // Optional: Enable synchronization
  // jsi: true, // Enable JSI for better performance (Android only)
});

export const database = new Database({
  adapter,
  modelClasses: [Steps],
});

// Helper function to save steps data
export async function saveStepsData(userId, stepCount, timestamp = Date.now()) {
  try {
    await database.write(async () => {
      const stepsCollection = database.collections.get('steps');
      await stepsCollection.create(step => {
        step._raw.user_id = userId;
        step._raw.step_count = stepCount;
        step._raw.timestamp = timestamp;
        step._raw.created_at = Date.now();
      });
    });
    console.log('💾 Steps data saved to database');
  } catch (error) {
    console.error('❌ Error saving steps data:', error);
  }
}

// Helper function to get recent steps data
export async function getRecentSteps(userId, hoursBack = 24) {
  try {
    const stepsCollection = database.collections.get('steps');
    const cutoffTime = Date.now() - (hoursBack * 60 * 60 * 1000);
    
    const steps = await stepsCollection
      .query(
        Q.where('user_id', userId),
        Q.where('timestamp', Q.gte(cutoffTime)),
        Q.sortBy('timestamp', Q.desc)
      )
      .fetch();
    
    return steps;
  } catch (error) {
    console.error('❌ Error fetching steps data:', error);
    return [];
  }
}
