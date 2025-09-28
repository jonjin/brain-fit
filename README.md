# BrainFit

BrainFit 是一个面向 60-80 岁健康老年人的脑机接口 (BCI) 认知训练移动网页应用。通过 EEG 神经反馈系统提升注意力、工作记忆和延迟记忆能力。

## 主要特性
- EEG 设备 Web Bluetooth 连接与数据模拟
- 自适应训练任务：购物清单、卡片匹配、记忆回想
- RBANS / RBMT 标准化认知评估模块
- 训练进度、脑网络可视化与日历安排
- Chakra UI 移动优先设计
- React Query 数据缓存，本地存储离线支持

## 技术栈
React 18 · TypeScript · Chakra UI · React Router · React Query · Recharts · Web Bluetooth API

## 开发脚本
```bash
npm install
npm start
```

```bash
npm run build
```

## 目录结构
详见 `brain-fit/` 下的源代码结构。
# brain-fit
#上传代码
ssh-keygen -t ed25519 -C "your_email@example.com"
pbcopy < ~/.ssh/id_ed25519.pub. 添加到 GitHub
打开浏览器访问：https://github.com/settings/keys
点击 "New SSH key"
Title 填写：Mac mini（或任意名称）
Key 直接粘贴（ctrl+V）
点击 "Add SSH key"
git remote set-url origin git@github.com:jonjin/brain-fit.git
ssh -T git@github.com
git push -u origin main
