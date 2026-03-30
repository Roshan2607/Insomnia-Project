package com.insomnia_mobile;

import android.app.AppOpsManager;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import android.os.Process;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.util.Calendar;
import java.util.List;
import java.util.Map;

public class UsageStatsModule extends ReactContextBaseJavaModule {

    public UsageStatsModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "UsageStats";
    }

    // Check if permission is granted
    @ReactMethod
    public void hasPermission(Promise promise) {
        try {
            AppOpsManager appOps = (AppOpsManager)
                getReactApplicationContext().getSystemService(Context.APP_OPS_SERVICE);
            int mode = appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                getReactApplicationContext().getPackageName()
            );
            promise.resolve(mode == AppOpsManager.MODE_ALLOWED);
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    // Open the Usage Access settings screen
    @ReactMethod
    public void openUsageSettings(Promise promise) {
        try {
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getReactApplicationContext().startActivity(intent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    // Get screen time for last 1 hour before midnight (pre-sleep window)
    @ReactMethod
    public void getPreSleepScreenTime(Promise promise) {
        try {
            if (!checkPermission()) {
                promise.reject("NO_PERMISSION", "Usage stats permission not granted");
                return;
            }

            UsageStatsManager usm = (UsageStatsManager)
                getReactApplicationContext().getSystemService(Context.USAGE_STATS_SERVICE);

            // Last 2 hours window
            long endTime   = System.currentTimeMillis();
            long startTime = endTime - (2 * 60 * 60 * 1000);

            List<UsageStats> stats = usm.queryUsageStats(
                UsageStatsManager.INTERVAL_BEST, startTime, endTime
            );

            long totalScreenMs = 0;
            long totalPickups  = 0;

            if (stats != null) {
                for (UsageStats s : stats) {
                    totalScreenMs += s.getTotalTimeInForeground();
                }
            }

            long screenTimeMinutes = totalScreenMs / 60000;

            WritableMap result = Arguments.createMap();
            result.putInt("screen_time_minutes", (int) screenTimeMinutes);
            promise.resolve(result);

        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage());
        }
    }

    private boolean checkPermission() {
        AppOpsManager appOps = (AppOpsManager)
            getReactApplicationContext().getSystemService(Context.APP_OPS_SERVICE);
        int mode = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            Process.myUid(),
            getReactApplicationContext().getPackageName()
        );
        return mode == AppOpsManager.MODE_ALLOWED;
    }
}