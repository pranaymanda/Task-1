import BackgroundFetch from 'react-native-background-fetch';
import { fetchSteps } from '../health/stepsService';
import { saveStepsData } from '../db/database';
import { debugLogAllData,cleanupOldRecords } from '../db/helpers';


const USER_ID = 'user_001';

export async function initBackgroundTask() {
  try {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 1, 
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
        forceAlarmManager: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
        requiresCharging: false,
        requiresDeviceIdle: false,
        requiresBatteryNotLow: false,
        requiresStorageNotLow: false,
        
    },
      async taskId => {
        console.log('🔄 Background task:', taskId);

        const steps = await fetchSteps();
        console.log(`📊 Fetched ${steps.length} steps records`);

        if (steps.length > 0) {
          // Calculate total steps from all records
          const totalSteps = steps.reduce((sum, record) => {
            return sum + (record.count || 0);
          }, 0);

          // Save to WatermelonDB
          await saveStepsData(USER_ID, totalSteps, Date.now());
          console.log(`💾 Saved ${totalSteps} steps to database`);
          
          // Show all data in database
          await debugLogAllData();
        } else {
          // Save 0 steps if no data (keeps consistent 15-min intervals)
          await saveStepsData(USER_ID, 0, Date.now());
          console.log('💾 Saved 0 steps (no new data)');
          
          // Show all data in database
          await debugLogAllData();
        }
     
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.error('❌ BackgroundFetch failed:', error);
      },
    );

    // BackgroundFetch.scheduleTask({
    //   taskId: 'com.healthconnect.steps',
    //   delay: 1 * 60 * 1000, // 15 minutes  
    //   periodic: true,
    //   forceAlarmManager: true,
    //   stopOnTerminate: false,
    //   startOnBoot: true,
    // });

  } catch (error) {
    console.error('❌ initBackgroundTask error:', error);
  }
}
