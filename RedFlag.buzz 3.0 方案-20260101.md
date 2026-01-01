文档分为两部分：

1. **产品设计蓝图 (PRD)**：用于明确产品逻辑。  
2. **Cloud Code 提示词集 (Master Prompts)**：用于直接驱动 AI 编写代码。

# ---

**第一部分：RedFlag.buzz 3.0 产品设计蓝图 (PRD)**

## **1\. 产品概述**

* **产品名称**：RedFlag.buzz  
* **产品定位**：求职者的风控顾问 (Job Seeker's Risk Auditor)。  
* **核心价值**：帮助全球求职者透过 HR 的辞藻（Corporate Jargon），理性识别 JD 中的潜在深坑（加班、文化有毒、画饼、低薪）。  
* **Slogan**：  
  * **主标**：TL;DR for Job Descriptions.  
  * **副标**：Skip the corporate jargon. Decode hidden risks in seconds.

## **2\. 用户体验流程 (User Flow)**

1. **Landing Page (首页)**：  
   * 风格类似 Google 搜索或 WeTransfer，极简、专业。  
   * 核心区域是一个巨大的输入框，支持 Tab 切换：\[Paste Link\] 和 \[Paste Text\]。  
   * 用户输入 URL 或文本后，点击 "Analyze Risks" 按钮。  
2. **Processing (处理中)**：  
   * 系统通过 API (Jina Reader) 抓取网页内容或直接处理文本。  
   * LLM 进行审计分析，生成结构化 JSON 数据。  
   * 数据同步存入 PostgreSQL 数据库。  
3. **Risk Dashboard (结果页)**：  
   * **Risk Score**：展示一个 0-100 的安全分（或风险分）。  
   * **Summary**：一句话总结核心风险（如："Warning: High likelihood of burnout."）。  
   * **Detailed Table (核心)**：结构化展示风险点，包含“原文(Trap)”与“解读(Reality)”的对比。  
4. **Viral Loop (分享)**：  
   * 点击分享按钮，生成一张“警示风格”的图片卡片（包含分数 \+ Top 3 风险）。  
   * 复制文案：“I scanned this JD with RedFlag.buzz. Risk Score: 45/100. Check it out...”

## **3\. 视觉设计系统 (Design System)**

* **主题模式**：**Light Mode Only (纯亮色)**。拒绝暗黑系，强调“审计报告”的专业感、透明感和清晰度。  
* **配色方案**：  
  * **背景**：Slate-50 (极淡灰) 用于页面底色，White 用于卡片。  
  * **文字**：Slate-900 (主标题), Slate-600 (正文)。  
  * **逻辑信号色**：  
    * 🔴 **High Risk**: Red-600 (文字/图标), Red-50 (背景)。  
    * 🟡 **Medium Risk**: Amber-600 (文字/图标), Amber-50 (背景)。  
    * 🔵 **Low Risk/Info**: Blue-600 (文字/图标), Blue-50 (背景)。

## **4\. 技术架构 (Tech Stack)**

* **Framework**: Next.js 16 (App Router, Stable Release)。  
* **Language**: TypeScript.  
* **UI Library**: Tailwind CSS \+ Shadcn/UI (Lucide React Icons).  
* **Database**: Vercel Postgres \+ Prisma ORM.  
* **AI Logic**: 使用deepseek V3.2。  
* **Scraper**: Jina Reader API (用于将 URL 转为 LLM 友好的 Markdown)。  
* **Image Gen**: satori 或 html2canvas (前端生成分享图)。

# ---

**第二部分：Cloud Code 提示词集合 (Master Prompts)**

请按顺序将以下 Prompt 发送给您的 AI 编程助手（Claude Code / Cursor / Windsurf）。

### **Step 1: Project Initialization & Stack Setup**

**目标**：初始化项目，确立 Next.js 16 和安全规范。

Prompt:  
I am building a web application called "RedFlag.buzz". It is an AI-powered tool that analyzes Job Descriptions (JDs) to identify potential risks ("red flags") for job seekers globally.  
Please initialize the project with the following strictly defined stack:

1. **Framework**: Next.js 16 (App Router). Use the latest **stable** patch version.   
2. **Language**: TypeScript.  
3. **Styling**: Tailwind CSS.  
4. **Components**: Shadcn/UI (please initialize with npx shadcn-ui@latest init and use slate as the base color).  
5. **Icons**: Lucide React.  
6. **Security**:  
   * Use zod for strictly validating all inputs in Server Actions to prevent injection attacks.  
   * Ensure react and react-dom are pinned to stable versions compatible with Next.js 16\.

**Task**: Set up the basic folder structure, install necessary dependencies (including clsx, tailwind-merge, zod), and confirm the dev server runs.

### **Step 2: Database Schema (Prisma \+ Postgres)**

**目标**：设计数据库以存储 JD、公司名、职位和具体的风险点。

Prompt:  
I need to persist the analysis results to a PostgreSQL database using Prisma to allow for future data analysis.  
1\. Install Dependencies:  
Add prisma, @prisma/client to the project.  
2\. Define Schema (schema.prisma):  
Please create a schema with two models: JobScan and RiskFlag.

Code snippet

// schema.prisma

generator client {  
provider \= "prisma-client-js"  
}  
datasource db {  
provider \= "postgresql"  
url \= env("POSTGRES\_PRISMA\_URL") // Connection pooling  
directUrl \= env("POSTGRES\_URL\_NON\_POOLING") // Direct connection  
}  
model JobScan {  
id String @id @default(cuid())  
createdAt DateTime @default(now())  
// Input Metadata  
inputType String // "url" or "text"  
sourceUrl String? // Optional, if URL was provided  
content String @db.Text // The raw JD text  
// Extracted Metadata (AI will extract these)  
companyName String? // e.g. "Tech Corp"  
jobTitle String? // e.g. "Senior React Dev"  
// Analysis Results  
riskScore Int // 0-100 (100 \= Safe, 0 \= Risky)  
summary String @db.Text  
shareCopy String? // Short witty text for social sharing  
// Relations  
flags RiskFlag\[\]  
}  
model RiskFlag {  
id String @id @default(cuid())  
scanId String  
scan JobScan @relation(fields: \[scanId\], references: \[id\])  
severity String // "High", "Medium", "Low"  
category String // "Culture", "Compensation", "Workload", "Management", "Stability"  
quote String @db.Text // The exact phrase from the JD  
reality String @db.Text // The AI interpretation of why it is a risk  
}

\*\*Task\*\*: Create this schema file and explain how to generate the Prisma client.

### **Step 3: Visual Design System (Light Theme)**

**目标**：确立“专业、清晰、明亮”的视觉风格。

Prompt:  
Let's define the visual design system. The goal is a "Professional Risk Auditor" look—clean, minimalist, and objective.  
**Style Guidelines (Strict):**

* **Theme**: **Light Mode ONLY**. Do not implement dark mode.  
* **Backgrounds**:  
  * Page background: bg-slate-50 (to reduce eye strain).  
  * Cards/Containers: bg-white with rounded-xl, border border-slate-200, and subtle shadow-sm.  
* **Typography**: Use a clean sans-serif font (Inter or Geist).  
  * Headings: text-slate-900.  
  * Body text: text-slate-600.  
* **Risk Color Palette (Crucial):**  
  * **High Risk (Red Flag)**: text-red-600, bg-red-50, border-red-200.  
  * **Medium Risk (Warning)**: text-amber-600, bg-amber-50, border-amber-200.  
  * **Low Risk / Safe**: text-blue-600, bg-blue-50, border-blue-200.  
* **Vibe**: Modern SaaS dashboard (like Linear or Notion), not a game or a blog.

**Task**: Configure tailwind.config.ts and app/globals.css to enforce these styles.

### **Step 4: Backend Logic (AI Analysis \+ Scraping)**

**目标**：编写核心 Server Action，包含 Jina 抓取、LLM 分析 prompt、以及数据库存储。

Prompt:  
Create a Server Action analyzeJobDescription(input: string, type: 'url' | 'text').  
**Logic Flow:**

1. **Scraping**: If type is 'url', fetch the content using https://r.jina.ai/${input} to get clean markdown text. Handle fetch errors gracefully.  
2. **AI Analysis**: Send the text to the LLM (deepseek) with the specific System Prompt below.  
3. **Persistence**: Save the result to the Database using prisma.jobScan.create with nested writes for flags.  
4. **Return**: Return the JobScan object (including flags) to the frontend.

**System Prompt for LLM:**

Plaintext

Role: You are a senior HR Risk Auditor.  
Objective: Analyze the Job Description to identify potential risks (Red Flags) regarding work-life balance, toxicity, stability, or compensation.  
Tone: Professional, objective, and clear. NOT humorous, NOT mocking.  
Input Text: \[JD Content\]

Output: Return ONLY a valid JSON object with this structure:  
{  
"company\_name": "Name found in text or null",  
"job\_title": "Job title found in text or null",  
"overall\_score": (Integer 0-100, where 100 is perfectly safe, 0 is a scam),  
"summary": "A one-sentence punchy warning or summary of the vibe.",  
"red\_flags": \[  
{  
"severity": "High" | "Medium" | "Low",  
"category": "Culture" | "Workload" | "Pay" | "Management",  
"quote": "Exact phrase from JD triggering this flag",  
"reality": "Brief explanation of the hidden meaning/risk"  
}  
\],  
"share\_copy": "A short, witty first-person sentence for social media sharing (e.g., 'I scanned this JD and found...')."  
}

\*\*Task\*\*: Implement this server action using Zod for input validation. Ensure the OpenAI API call returns JSON mode.

### **Step 5: Frontend Implementation (Landing & Result)**

**目标**：构建前端页面，包含 Tab 输入框和结果表格。

Prompt:  
Build the main page (page.tsx) with two distinct states managed by React state: Input State and Result State.  
**1\. Input State (Hero Section):**

* **Headline**: "TL;DR for Job Descriptions." (Large, Bold, Slate-900).  
* **Subtext**: "Skip the corporate jargon. Decode hidden risks in seconds." (Slate-500).  
* **Input Component**: A centered card with Tabs ("Paste Link" / "Paste Text").  
  * Inside "Paste Link": Input field with placeholder "[https://linkedin.com/jobs/](https://www.google.com/search?q=https://linkedin.com/jobs/)..."  
  * Primary Action Button: "Analyze Risks" (Indigo-600).

**2\. Result State (The Dashboard):**

* **Header**: Display Risk Score (Large Badge) and Summary.  
* **Metadata**: Show Company Name and Job Title if available.  
* **The Analysis Table**:  
  * Use Shadcn Table component.  
  * Columns: Risk Level (Badge with color), Category, The Trap (Quote), The Reality (Interpretation).  
* **Action Bar**: Buttons for "Share Findings" and "Scan Another".

**Task**: Implement the UI. Connect it to the analyzeJobDescription server action. Handle "Loading" states with a skeleton UI or spinner.

### **Step 6: Social Sharing Feature**

**目标**：生成用于社交媒体传播的图片。

Prompt:  
Create a ShareCard component and a function to export it as an image.  
**Requirements:**

1. **Component**: A hidden div that is styled specifically for an image export (Aspect ratio 1.91:1).  
   * Background: Light Yellow or Light Red depending on score.  
   * Content: Big Risk Score, Job Title, and the Top 3 "High" severity flags.  
   * Footer: "Analyzed by redflag.buzz".  
2. **Functionality**: When user clicks "Share Findings":  
   * Use html2canvas (or similar library) to render the ShareCard to a PNG.  
   * Copy the shareCopy text from the DB to the clipboard.  
   * Show a toast notification: "Image generated & Text copied\!".

**Task**: Implement this sharing logic.

