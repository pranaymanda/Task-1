import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { initHealthConnect } from './src/health/healthConnectInit';


export default function App() {
  useEffect(() => {
    async function initApp() {
      try {
        const initialized = await initHealthConnect();
        if (initialized) {
          
          console.log('✅ App initialized successfully');
        }
      } catch (error) {
        console.error('❌ App init error:', error);
      }
    }

    initApp();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Health Connect Background Sync ✅</Text>
    </View>
  );
}
