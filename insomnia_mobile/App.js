import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AssessmentProvider } from './src/context/AssessmentContext';
import { C } from './src/theme';

import HomeScreen      from './src/screens/HomeScreen';
import Step1Profile    from './src/screens/Step1Profile';
import Step2Sleep      from './src/screens/Step2Sleep';
import Step3Lifestyle  from './src/screens/Step3Lifestyle';
import Step4Cardio     from './src/screens/Step4Cardio';
import Step5BioSignals from './src/screens/Step5BioSignals';
import Step6ISI        from './src/screens/Step6ISI';
import ResultsScreen   from './src/screens/ResultsScreen';

const Stack = createNativeStackNavigator();

const screenOpts = {
  headerShown: false,
  contentStyle: { backgroundColor: C.bg },
  animation: 'slide_from_right',
};

export default function App() {
  return (
    <AssessmentProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOpts}>
          <Stack.Screen name="Home"    component={HomeScreen} />
          <Stack.Screen name="Step1"   component={Step1Profile} />
          <Stack.Screen name="Step2"   component={Step2Sleep} />
          <Stack.Screen name="Step3"   component={Step3Lifestyle} />
          <Stack.Screen name="Step4"   component={Step4Cardio} />
          <Stack.Screen name="Step5"   component={Step5BioSignals} />
          <Stack.Screen name="Step6"   component={Step6ISI} />
          <Stack.Screen name="Results" component={ResultsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AssessmentProvider>
  );
}