import {
  readRecords,
  requestPermission,
} from 'react-native-health-connect';

export async function fetchSteps() {
  try {
    const permissions = [
      {
        accessType: 'read',
        recordType: 'Steps',
      },
    ];

    const granted = await requestPermission(permissions);
    if (!granted) {
      console.warn('⚠️ Steps permission not granted');
      return [];
    }

    const endTime = new Date();
    const startTime = new Date();
    startTime.setMinutes(endTime.getMinutes() - 15);

    const response = await readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    });

    return response?.records || [];
  } catch (error) {
    console.error('❌ fetchSteps error:', error);
    return [];
  }
}
