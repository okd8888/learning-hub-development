---
stableId: 'infra-git-branches'
slug: 'infrastructure/git-branches'
title: '用短分支保持變更容易審查'
description: '用一個合成團隊流程示範分支、提交與回滾的基本關係。'
category: 'infrastructure'
subcategory: 'git'
type: 'note'
tags: ['git', 'opensource']
publishedAt: '2026-10-30'
draft: false
---

## 變更生命週期

分支讓工作在合併前保持隔離；小型提交則讓審查者能逐步理解每次修改。

## 回滾

```bash
git revert <commit>
```

`revert` 產生新的反向提交，適合保留共享分支上的歷史脈絡。
