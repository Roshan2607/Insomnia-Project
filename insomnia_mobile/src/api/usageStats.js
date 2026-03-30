import { NativeModules, Platform } from 'react-native';

const { UsageStats } = NativeModules;

// Check if permission is granted
export async function hasUsagePermission() {
  if (Platform.OS !== 'android') return false;
  try {
    return await UsageStats.hasPermission();
  } catch {
    return false;
  }
}

// Open Android Usage Access settings so user can grant permission
export async function openUsageSettings() {
  if (Platform.OS !== 'android') return;
  try {
    await UsageStats.openUsageSettings();
  } catch (e) {
    console.warn('Could not open usage settings:', e);
  }
}

// Get actual screen time from the last 2 hours
export async function getPreSleepScreenTime() {
  if (Platform.OS !== 'android') return null;
  try {
    const result = await UsageStats.getPreSleepScreenTime();
    return result; // { screen_time_minutes: number }
  } catch (e) {
    console.warn('UsageStats error:', e);
    return null;
  }
}