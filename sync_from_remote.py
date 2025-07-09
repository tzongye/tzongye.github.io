#!/usr/bin/env python3
import subprocess
import os

os.chdir('/Users/isaac.tsai/Documents/GitHub/tzongye.github.io')

print("🌐 正在從遠端拉取最新更改...")
result = subprocess.run(['git', 'pull', 'origin', 'main'], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print("錯誤:", result.stderr)

print("\n✅ 最新的提交記錄:")
result = subprocess.run(['git', 'log', '--oneline', '-5'], capture_output=True, text=True)
print(result.stdout)

print("\n📊 當前狀態:")
result = subprocess.run(['git', 'status'], capture_output=True, text=True)
print(result.stdout)