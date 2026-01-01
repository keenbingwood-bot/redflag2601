# Vercel 生产环境配置指南

## 当前问题
生产环境日志显示：
```
WARNING: Database not configured. Using mock Prisma Client.
Database save failed, continuing without saving: Error: Database not configured. Please set PRISMA_ACCELERATE_URL or POSTGRES_PRISMA_URL environment variable.
```

## 解决方案
需要在 Vercel 仪表板中设置以下环境变量：

## 必需的环境变量

### 1. AI API 配置
```
DEEPSEEK_API_KEY=sk-3d0f70d573c84bdd9c3ec4e214915371
DEEPSEEK_API_URL=https://api.deepseek.com
```

### 2. 数据库配置（选择一种方式）

**选项 A：使用 Prisma Accelerate（推荐）**
```
PRISMA_ACCELERATE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza194RW82Qlk3YXB0aWRzdVRLV3NwQ0wiLCJhcGlfa2V5IjoiMDFLRFZQWUZTTjhBUkZSV0MzU1lBNzhZVDgiLCJ0ZW5hbnRfaWQiOiI1OTViYjIyODA1NzY5MzJjZjc5OGY0ZWIyNWUzYWZjMTZmNjNlNzU2OGQ2NTNiYjFkOWI1MDRmNWZmNWY1NDliIiwiaW50ZXJuYWxfc2VjcmV0IjoiNTMyNTU2NWMtOGI1Yi00YWVlLWE2MWMtMDFlZWM0ZGQ5MjRhIn0.iRoV5gvRgNyCVSfaUgw8EA7kio6oiv1dgQ1jjpilw04
```

**选项 B：使用直接 PostgreSQL 连接**
```
POSTGRES_PRISMA_URL=postgres://595bb2280576932cf798f4eb25e3afc16f63e7568d653bb1d9b504f5ff5f549b:sk_xEo6BY7aptidsuTKWspCL@db.prisma.io:5432/postgres?sslmode=require
POSTGRES_URL_NON_POOLING=postgres://595bb2280576932cf798f4eb25e3afc16f63e7568d653bb1d9b504f5ff5f549b:sk_xEo6BY7aptidsuTKWspCL@db.prisma.io:5432/postgres?sslmode=require
```

### 3. 应用配置
```
NEXT_PUBLIC_APP_URL=https://redflag.buzz
NEXT_PUBLIC_APP_NAME=RedFlag2601
NODE_ENV=production
```

### 4. 可选服务
```
JINA_READER_API_KEY=jina_af525ab1bb55445eab1e80d79765123723Lh5UtK6l3RkEEDHpMXy5aZxag_
```

## 在 Vercel 中设置的步骤

### 方法一：通过 Vercel 仪表板
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目 "redflag2601"
3. 点击 **Settings** → **Environment Variables**
4. 点击 **Add New** 添加每个环境变量
5. 按照上面的列表添加所有必需变量
6. 点击 **Save**
7. 重新部署项目

### 方法二：通过 Vercel CLI
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 添加环境变量
vercel env add DEEPSEEK_API_KEY
vercel env add PRISMA_ACCELERATE_URL
# ... 添加所有其他变量

# 重新部署
vercel --prod
```

## 验证配置

### 1. 检查环境变量是否生效
部署后，检查 Vercel 的部署日志，应该看到：
```
Prisma Client created with database configuration
Using Prisma Accelerate URL  # 或 Using direct database URL
```

### 2. 测试功能
1. 提交一个工作描述进行分析
2. 检查分析结果是否保存到数据库
3. 验证 AI 分析功能正常工作

### 3. 查看日志
在 Vercel 仪表板的 **Deployments** → 选择最新部署 → **Logs** 中查看实时日志。

## 故障排除

### 如果仍然看到 "Database not configured" 错误：
1. **检查变量名称**：确保变量名称完全匹配（大小写敏感）
2. **重新部署**：添加环境变量后必须重新部署
3. **检查部署环境**：确保变量添加到生产环境（Production）
4. **验证数据库连接**：检查数据库凭据是否正确

### 如果看到 "DEEPSEEK_API_KEY is not set" 错误：
1. 确保 `DEEPSEEK_API_KEY` 已设置
2. 检查 API 密钥是否有效
3. 验证 DeepSeek API 服务是否可用

## 安全注意事项
1. **不要提交 `.env.local` 到版本控制**
2. **定期轮换 API 密钥**
3. **使用不同的密钥用于开发和生产环境**
4. **监控 API 使用情况和费用**

## 紧急修复
如果生产环境急需修复，可以：
1. 立即在 Vercel 仪表板中添加缺失的环境变量
2. 使用 **Redeploy** 按钮重新部署
3. 验证修复后访问 https://redflag.buzz