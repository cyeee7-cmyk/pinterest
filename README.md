# Pinterest自动化SaaS - MVP

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
编辑 `.env.local`，填入你的Pinterest API凭证：
```
PINTEREST_CLIENT_ID=your-app-id
PINTEREST_CLIENT_SECRET=your-app-secret
PINTEREST_ACCESS_TOKEN=your-token
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

---

## 功能概览

✅ **登录/注册** - 邮箱和密码认证  
✅ **发布Pin** - 输入标题、描述和图片URL  
✅ **Pin管理** - 查看已发布的Pin  

---

## 下一步（第4-6周）

### 1. Pinterest OAuth集成
- 替换简单token为Pinterest OAuth
- 获取用户Pinterest账户信息

### 2. 添加定时发布
- 创建定时任务队列 (Bull)
- 支持后台发布Pin

### 3. 计费系统
- 集成Stripe
- 实现订阅管理

### 4. 分析仪表板
- 显示Pin的互动数据
- 统计信息图表

---

## 项目结构
```
/app
  /api
    /auth - 登录/注册
    /pins - Pin管理
  /auth - 登录页面
  /dashboard - 主应用页面
/prisma
  schema.prisma - 数据库模型
```

## API端点

- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `POST /api/pins/create` - 创建Pin

需要在请求头中添加 `Authorization: Bearer <token>`
