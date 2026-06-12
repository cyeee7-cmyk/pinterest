# Stripe支付集成指南

## 1. 创建Stripe账户

访问 [Stripe](https://stripe.com) 并注册账户。

## 2. 获取API密钥

1. 登录Stripe Dashboard
2. 进入 **Developers** → **API keys**
3. 复制以下密钥到 `.env.local`：

```env
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

## 3. 创建$9.9产品和价格

1. 进入 **Products** → **Create product**
2. 填写信息：
   - **Name**: Pinterest Pro
   - **Type**: Service

3. 添加定价：
   - **Price**: $9.9
   - **Billing period**: Monthly (recurring)
   - **Save price**

4. 复制 **Price ID** 到 `.env.local`：

```env
STRIPE_PRICE_ID=price_xxxxx
```

## 4. 配置Webhook（生产环境）

1. 进入 **Developers** → **Webhooks**
2. 点击 **Add endpoint**
3. URL: `https://yourdomain.com/api/stripe/webhook`
4. 选择事件：
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. 复制 **Signing secret** 到 `.env.local`：

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

## 5. 测试支付

### 测试卡号

| 卡号 | CVC | 日期 | 用途 |
|------|-----|------|------|
| 4242 4242 4242 4242 | 任意 | 未来日期 | 成功支付 |
| 4000 0000 0000 0002 | 任意 | 未来日期 | 支付失败 |

### 测试流程

1. 访问 `/pricing` 页面
2. 点击"立即订阅"
3. 填写测试卡信息
4. 完成支付
5. 检查Dashboard，订阅状态应更新为 "active"

## 6. 生产环境配置

上线前：

1. **切换到Live密钥**
   ```env
   STRIPE_SECRET_KEY=sk_live_xxxxx
   STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
   ```

2. **配置真实Webhook URL**
   - `https://yourdomain.com/api/stripe/webhook`

3. **启用邮件通知**
   - 设置失败支付提醒

## 常见问题

**Q: 本地无法测试Webhook？**
A: 使用Stripe CLI转发Webhook：
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Q: 支付成功但订阅未更新？**
A: 检查Webhook是否正确配置且接收到事件

**Q: 如何处理退款？**
A: 在Stripe Dashboard的Payments中查看，支持手动退款或自动处理

---

## 定价页面集成

用户可以通过 `/pricing` 页面订阅。

订阅成功后会重定向到Dashboard，显示 ✅ 已订阅状态。
