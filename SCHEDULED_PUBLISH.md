# 定时发布功能说明

## 功能概述

用户可以：
1. 创建Pin时选择定时发布时间
2. Pin会在指定时间自动发布到Pinterest
3. 查看Pin的发布状态（草稿、定时中、已发布）

## 工作流程

```
用户创建Pin
    ↓
选择定时发布时间（可选）
    ↓
提交表单
    ↓
Pin保存到数据库，状态为 "scheduled"
    ↓
添加到任务队列（Bull）
    ↓
等待定时时间到达
    ↓
任务执行 → 调用Pinterest API
    ↓
Pin状态更新为 "published"
```

## 技术栈

- **Bull**: 任务队列库
- **Redis** (可选): 生产环境推荐用Redis存储任务
- **Prisma**: 任务持久化存储

## 当前实现

### API端点

1. **POST /api/pins/schedule** - 创建定时Pin
   - 参数: title, description, imageUrl, scheduledAt
   - 返回: Pin对象

2. **POST /api/pins/publish** - 手动发布Pin
   - 参数: pinId
   - 返回: 更新后的Pin对象

### 数据库字段

```javascript
Pin {
  scheduledAt: DateTime?    // 定时发布时间
  publishedAt: DateTime?    // 实际发布时间
  status: String           // draft | scheduled | published
}
```

## 生产环境配置

在生产环境，建议：

1. 安装Redis服务器
2. 更新.env配置指向Redis
3. 使用单独的Worker进程处理队列

```env
# .env.production
REDIS_URL=redis://localhost:6379
```

## 测试定时发布

1. 访问Dashboard
2. 连接Pinterest账户
3. 填写Pin信息
4. 选择"定时发布"，选择几分钟后的时间
5. 点击"安排发布"
6. 等待定时时间到达，观察Pin状态变化

## 常见问题

**Q: 定时发布如果断电会丢失吗？**
A: 是的，当前使用内存存储。生产环境应使用Redis。

**Q: 支持批量定时发布吗？**
A: 当前版本支持逐个创建。未来可添加批量上传功能。

**Q: 可以编辑已定时的Pin吗？**
A: 当前不支持。可以先删除再重新创建。
