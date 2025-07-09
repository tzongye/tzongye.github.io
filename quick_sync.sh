#!/bin/bash

# 快速同步 GitHub 倉庫

echo "🔍 檢查 Git 狀態..."
git status

echo -e "\n🌐 獲取遠端更新..."
git fetch origin

echo -e "\n📊 檢查本地與遠端差異..."
git status -uno

echo -e "\n📋 遠端新提交 (如果有)..."
git log HEAD..origin/main --oneline 2>/dev/null || git log HEAD..origin/master --oneline 2>/dev/null || echo "沒有新提交"

echo -e "\n🔄 開始同步..."
git pull origin main 2>/dev/null || git pull origin master 2>/dev/null

echo -e "\n✅ 同步完成！最近提交記錄:"
git log --oneline -5

echo -e "\n📁 當前檔案狀態:"
git status --short