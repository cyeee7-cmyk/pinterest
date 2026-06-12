# Pinterest OAuth 配置指南

## 1. 在Pinterest创建应用

1. 访问 [Pinterest Developers](https://developers.pinterest.com/apps/)
2. 登录Pinterest账户
3. 点击"Create app"
4. 填写应用信息：
   - **App name**: Pinterest Automation
   - **App description**: Automated Pinterest content publishing
   - **Redirect URIs**: `http://localhost:3000/api/pinterest/callback`

5. 完成后获取：
   - **App ID** (Client ID)
   - **App Secret** (Client Secret)

## 2. 配置环境变量

编辑 `.env.local`，填入你的应用凭证：

```env
PINTEREST_APP_ID=your-app-id-here
PINTEREST_APP_SECRET=your-app-secret-here
PINTEREST_REDIRECT_URI=http://localhost:3000/api/pinterest/callback
```

## 3. 本地测试

1. 启动开发服务器：
```bash
npm run dev
```

2. 登录或注册账户

3. 在Dashboard页面点击 **"🔗 连接Pinterest账户"**

4. 授权Pinterest连接

5. 连接成功后就可以发布Pin到你的Pinterest账户

## 4. 生产环境配置

部署到生产时，需要：

```env
PINTEREST_REDIRECT_URI=https://yourdomain.com/api/pinterest/callback
```

然后在Pinterest App管理中更新Redirect URI。

## 5. 权限范围

当前配置的权限：
- `read_public` - 读取公开内容
- `write_public` - 发布公开Pin

可根据需要添加更多权限。

---

## 常见问题

**Q: redirect_uri mismatch error**
A: 确保.env中的PINTEREST_REDIRECT_URI与Pinterest App中配置的完全一致

**Q: OAuth 401 error**
A: 检查APP_ID和APP_SECRET是否正确

**Q: 无法发布Pin**
A: 确保Pinterest账户有权限，且已连接OAuth
