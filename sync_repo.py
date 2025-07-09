#!/usr/bin/env python3
"""
GitHub 倉庫同步腳本
檢查並同步遠端倉庫的變更
"""

import os
import subprocess
import sys
from pathlib import Path

def run_git_command(command, cwd=None):
    """執行 Git 命令"""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            cwd=cwd,
            check=True
        )
        return True, result.stdout.strip(), result.stderr.strip()
    except subprocess.CalledProcessError as e:
        return False, e.stdout.strip(), e.stderr.strip()

def check_repo_status():
    """檢查倉庫狀態"""
    repo_path = Path(__file__).parent
    print(f"🔍 檢查倉庫狀態: {repo_path}")
    
    # 檢查是否為 Git 倉庫
    if not (repo_path / ".git").exists():
        print("❌ 這不是一個 Git 倉庫")
        return False
    
    # 檢查當前狀態
    success, stdout, stderr = run_git_command("git status --porcelain", repo_path)
    if not success:
        print(f"❌ 無法獲取 Git 狀態: {stderr}")
        return False
    
    if stdout:
        print("📝 本地有未提交的變更:")
        print(stdout)
    else:
        print("✅ 本地沒有未提交的變更")
    
    return True

def check_remote_updates():
    """檢查遠端更新"""
    repo_path = Path(__file__).parent
    print("\n🌐 檢查遠端更新...")
    
    # 獲取遠端資訊
    success, stdout, stderr = run_git_command("git fetch origin", repo_path)
    if not success:
        print(f"❌ 無法從遠端獲取更新: {stderr}")
        return False
    
    # 比較本地和遠端
    success, stdout, stderr = run_git_command("git status -uno", repo_path)
    if not success:
        print(f"❌ 無法比較本地和遠端: {stderr}")
        return False
    
    print(f"📊 分支狀態:")
    print(stdout)
    
    # 檢查是否有遠端更新
    if "behind" in stdout:
        print("⬇️ 發現遠端有新的更新需要同步")
        return True
    elif "ahead" in stdout:
        print("⬆️ 本地有新的變更需要推送")
        return True
    else:
        print("✅ 本地和遠端已同步")
        return False

def show_commit_diff():
    """顯示提交差異"""
    repo_path = Path(__file__).parent
    print("\n📋 顯示遠端新提交:")
    
    # 獲取遠端新提交
    success, stdout, stderr = run_git_command("git log HEAD..origin/main --oneline", repo_path)
    if success and stdout:
        print(stdout)
    else:
        # 嘗試其他主要分支名稱
        success, stdout, stderr = run_git_command("git log HEAD..origin/master --oneline", repo_path)
        if success and stdout:
            print(stdout)
        else:
            print("沒有找到新的提交")

def sync_repository():
    """同步倉庫"""
    repo_path = Path(__file__).parent
    print("\n🔄 開始同步倉庫...")
    
    # 檢查當前分支
    success, current_branch, stderr = run_git_command("git branch --show-current", repo_path)
    if not success:
        print(f"❌ 無法獲取當前分支: {stderr}")
        return False
    
    print(f"📍 當前分支: {current_branch}")
    
    # 拉取遠端更新
    success, stdout, stderr = run_git_command(f"git pull origin {current_branch}", repo_path)
    if not success:
        print(f"❌ 拉取失敗: {stderr}")
        return False
    
    print("✅ 同步完成!")
    print(stdout)
    
    return True

def show_recent_changes():
    """顯示最近的變更"""
    repo_path = Path(__file__).parent
    print("\n📈 最近的提交記錄:")
    
    success, stdout, stderr = run_git_command("git log --oneline -10", repo_path)
    if success:
        print(stdout)
    else:
        print(f"❌ 無法獲取提交記錄: {stderr}")

def main():
    """主函數"""
    print("🔧 GitHub 倉庫同步工具")
    print("=" * 50)
    
    # 1. 檢查倉庫狀態
    if not check_repo_status():
        return
    
    # 2. 檢查遠端更新
    has_updates = check_remote_updates()
    
    # 3. 顯示提交差異
    show_commit_diff()
    
    # 4. 詢問是否同步
    if has_updates:
        print("\n❓ 是否要同步遠端更新？")
        print("1. 是 - 自動同步")
        print("2. 否 - 只顯示狀態")
        
        try:
            choice = input("請選擇 (1/2): ").strip()
            if choice == "1":
                if sync_repository():
                    show_recent_changes()
            elif choice == "2":
                print("✅ 只顯示狀態，不進行同步")
            else:
                print("❌ 無效選擇")
        except KeyboardInterrupt:
            print("\n❌ 操作已取消")
    else:
        show_recent_changes()

if __name__ == "__main__":
    main()