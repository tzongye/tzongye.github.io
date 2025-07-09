#!/usr/bin/env python3
import subprocess
import os
import sys

# 切換到repository目錄
repo_path = '/Users/isaac.tsai/Documents/GitHub/tzongye.github.io'
os.chdir(repo_path)

print("🔄 正在從遠端拉取最新更改...")
try:
    result = subprocess.run(['git', 'pull', 'origin', 'main'], 
                          capture_output=True, text=True, check=True)
    print("✅ 成功拉取更新:")
    print(result.stdout)
    
    if result.stderr:
        print("警告:", result.stderr)
        
except subprocess.CalledProcessError as e:
    print(f"❌ 拉取失敗: {e}")
    print("錯誤輸出:", e.stderr)
    sys.exit(1)

print("\n📋 最新提交記錄:")
result = subprocess.run(['git', 'log', '--oneline', '-5'], capture_output=True, text=True)
print(result.stdout)

print("🎉 同步完成！")