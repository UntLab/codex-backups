#!/bin/bash
# Запуск PharmaTech в Android-эмуляторе
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH

# Запустить эмулятор, если не запущен
adb devices | grep -q emulator || emulator -avd PharmaTech_Emulator -no-snapshot-load &

sleep 20
npm run android
