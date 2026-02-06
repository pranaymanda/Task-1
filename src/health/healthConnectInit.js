import {
  initialize
  
} from 'react-native-health-connect';

export async function initHealthConnect() {
  try {
    await initialize();
    console.log('✅ Health Connect initialized');

    return true;
  } catch (error) {
    console.error('❌ Health Connect init error:', error);
    return false;
  }
}
