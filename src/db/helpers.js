import { Q } from '@nozbe/watermelondb';
import { database } from './database';

// Get all steps for a user
export async function getAllUserSteps(userId) {
  try {
    const stepsCollection = database.collections.get('steps');
    const steps = await stepsCollection
      .query(
        Q.where('user_id', userId),
        Q.sortBy('timestamp', Q.desc)
      )
      .fetch();
    
    return steps.map(step => ({
      id: step.id,
      userId: step._raw.user_id,
      stepCount: step._raw.step_count,
      timestamp: step._raw.timestamp,
      date: new Date(step._raw.timestamp).toLocaleString(),
      createdAt: step._raw.created_at,
    }));
  } catch (error) {
    console.error('❌ Error fetching user steps:', error);
    return [];
  }
}

// Get steps count for today
export async function getTodaySteps(userId) {
  try {
    const stepsCollection = database.collections.get('steps');
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    
    const steps = await stepsCollection
      .query(
        Q.where('user_id', userId),
        Q.where('timestamp', Q.gte(startOfDay))
      )
      .fetch();
    
    return steps.reduce((total, step) => total + step._raw.step_count, 0);
  } catch (error) {
    console.error('❌ Error fetching today steps:', error);
    return 0;
  }
}

// Delete old records (older than X days)
export async function cleanupOldRecords(daysToKeep = 30) {
  try {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const stepsCollection = database.collections.get('steps');
    
    const oldSteps = await stepsCollection
      .query(Q.where('timestamp', Q.lt(cutoffTime)))
      .fetch();
    
    await database.write(async () => {
      await database.batch(...oldSteps.map(step => step.prepareDestroyPermanently()));
    });
    
    console.log(`🗑️ Cleaned up ${oldSteps.length} old records`);
    return oldSteps.length;
  } catch (error) {
    console.error('❌ Error cleaning up old records:', error);
    return 0;
  }
}

// Debug: Log all data in database
export async function debugLogAllData() {
  try {
    const stepsCollection = database.collections.get('steps');
    const allSteps = await stepsCollection.query().fetch();
    
    console.log('📊 Database contents:');
    allSteps.forEach(step => {
      console.log(`  ${step._raw.user_id} | ${new Date(step._raw.timestamp).toLocaleString()} | ${step._raw.step_count} steps`);
    });
    
    return allSteps.length;
  } catch (error) {
    console.error('❌ Error logging database data:', error);
    return 0;
  }
}