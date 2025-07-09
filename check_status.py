#!/usr/bin/env python3
import subprocess
import os

os.chdir('/Users/isaac.tsai/Documents/GitHub/tzongye.github.io')

print("🔍 檢查工作目錄狀態...")
result = subprocess.run(['git', 'status'], capture_output=True, text=True)
print(result.stdout)

print("\n📊 檢查是否有未追蹤的檔案...")
result = subprocess.run(['git', 'ls-files', '--others', '--exclude-standard'], capture_output=True, text=True)
if result.stdout.strip():
    print("未追蹤的檔案:")
    print(result.stdout)
else:
    print("沒有未追蹤的檔案")

print("\n🔄 檢查是否有未暫存的更改...")
result = subprocess.run(['git', 'diff', '--name-only'], capture_output=True, text=True)
if result.stdout.strip():
    print("未暫存的更改:")
    print(result.stdout)
else:
    print("沒有未暫存的更改")

print("\n📋 檢查是否有已暫存的更改...")
result = subprocess.run(['git', 'diff', '--cached', '--name-only'], capture_output=True, text=True)
if result.stdout.strip():
    print("已暫存的更改:")
    print(result.stdout)
else:
    print("沒有已暫存的更改")