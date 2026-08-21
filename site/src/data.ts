/** 站点内容：有层级、适度展开，突出重点 */

export const site = {
  name: '施宏威',
  title: 'Agent 开发工程师',
  tagline: '用 Agent 把产品从想法做成可交付工程',
  lead: '专注 AI Agent 工作流与多端交付。能独立覆盖产品方案、UI 设计与代码落地，代表作是开源的本地 App 生成工作流。',
  location: '湖北 · 远程协作',
  email: '15587742070@163.com',
  phone: '15587742070',
  github: 'https://github.com/sisioow',
  gitee: '',
  /**
   * 国内可预览入口：Cloudflare Pages
   */
  mirror: 'https://resume-due.pages.dev/',
  /** OSS 仅备份，默认域名无法在线预览 */
  ossBackup: 'https://shihongwei-resume.oss-cn-beijing.aliyuncs.com/index.html',

  resumePdf: './resume.pdf',
}

/** Hero 右侧：可切换 Agent 列表 / 其他项目 */
export type ShowcaseItem = { name: string; out: string }

export type ShowcaseTab = {
  id: 'agents' | 'others'
  label: string
  prefix: string
  items: ShowcaseItem[]
}

export const showcaseTabs: ShowcaseTab[] = [
  {
    id: 'agents',
    label: 'Agent 列表',
    prefix: 'Agent',
    items: [
      { name: 'Deep Research 深度调研', out: '带引用研究报告' },
      { name: '企业知识库客服 Agent', out: 'RAG 可溯源答复' },
      { name: 'python+harness架构agent', out: '端到端 Agent 链路就绪' },
      { name: 'n8n工作流', out: '自动化交付跑通' },
    ],
  },
  {
    id: 'others',
    label: '其他项目',
    prefix: '项目',
    items: [
      { name: 'CrewAI 多智能体编排', out: '协作交付可视化' },
      { name: 'Browser-Use 浏览器 Agent', out: '网页操作自动化' },
      { name: '多多答题cocos', out: 'Cocos 玩法跑通' },
      { name: 'android项目（已上架）', out: '多渠道稳定在架' },
      { name: '要素式诉讼文书辅助填写系统', out: '诉状一键导出' },
    ],
  },
]

export const experiences = [
  {
    company: '北京臻盛网络有限公司',
    role: 'Agent 开发工程师',
    period: '2026.01 — 至今',
    points: [
      '工作流设计与搭建：基于 n8n 构建端到端自动化开发工作流，覆盖产品方案 → UI 设计 → 代码生成 → 验收测试与打包，交付周期缩短约 90%',
      'AI 代码生成集成：深度集成 Cursor CLI 与 Claude Code，实现需求文档到 UniApp 项目代码自动生成，质量达到主流渠道 A 面上架标准',
      '自动化打包部署：搭建 CI/CD 流水线，支持 UniApp 多端（H5、小程序、App）一键打包与分发',
      '前端工程开发：负责 Agent 平台可视化工作流编辑器，支持拖拽节点编排与实时调试',
      'Cocos MCP + IDE/CLI：调研验证 AI 操控 Cocos Creator 创建节点、场景、预置体与脚本',
      'Skills + Google Stitch + Trae/Cursor/Claude：一句话产品名快速生成完整 H5 项目',
    ],
  },
  {
    company: '武汉百智诚远科技有限公司',
    role: 'AI 全栈开发工程师',
    period: '2025.02 — 2025.08',
    points: [
      '诉讼文书辅助填写系统：完成 11 类要素式起诉状前端与多方式填写、预览、HTML 转 Word/PDF 及扫码打印',
      '文书精灵：Prompt 设计、大模型服务部署与应用层集成，基于 Jinja2 开发动态文书生成组件',
      '独立实现判决书「当事人信息」「审理经过」等段落智能生成，落地鄂州梁子湖区法院、武汉东湖高新区法院',
    ],
  },
]

/** 技能：专业 / 办公 / 兴趣 / 证书（对齐简历） */
export type SkillGroup = {
  title: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: '专业技能',
    items: [
      'llm+rag',
      'herness',
      'skill',
      'mcp+tools',
      'Python',
      'Node.js',
      'HTML / CSS / JavaScript',
      'Vue',
      'Java + Spring Boot',
    ],
  },
  {
    title: '办公技能',
    items: ['Word', 'Excel', 'PowerPoint', 'Markdown', '飞书 / 钉钉', '剪映'],
  },
  {
    title: '兴趣爱好',
    items: ['工作流', '新 AI 技术或工具', '健身', '摄影'],
  },
  {
    title: '相关证书',
    items: ['CET-6', 'CET-4'],
  },
]

export type Impact = { value: string; label: string }

/** 重点区块：小标题 + 说明，形成层级 */
export type Focus = { title: string; body: string }

export type Project = {
  id: string
  name: string
  tag: string
  /** 副标题 / 价值主张 */
  hook: string
  /** 适度摘要（2–4 句） */
  description: string
  /** 分层重点 */
  focus?: Focus[]
  impact?: Impact[]
  repo?: string
  demo?: string
  video?: string
  docs?: string
  stack: string[]
  status: 'live' | 'wip' | 'archived'
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'workflow-uniapp',
    name: 'workflow_uniapp',
    tag: '代表作 · 开源',
    featured: true,
    status: 'live',
    hook: '本地 App 生成工作流：从产品名到可跑、可测、可发布的 UniApp 工程',
    description:
      '把原先依赖 n8n 的应用生成能力，重构为一套可本地运行的 Web 工作流。输入应用名称后，系统协助完成需求分析与方案确认，可选 Google Stitch 生成界面，再调用 Claude Code / Codex / Cursor Agent 生成代码，并支持 H5 自测与 Git 发布。目标很明确：让一个人也能稳定完成「产品 + 设计 + 开发」的交付闭环。',
    impact: [
      { value: '≈90%', label: '交付周期压缩' },
      { value: '1 人', label: '覆盖三角色' },
      { value: '开源', label: '完整可复现' },
    ],
    focus: [
      {
        title: '结果导向',
        body: '输出不是聊天记录，而是可编译的 UniApp 工程：带功能清单 README、可 H5 预览、可推到 Git 分支。',
      },
      {
        title: '能力编排',
        body: 'LLM 做需求分析，Stitch MCP 出多屏 UI（也可跳过设计），三套代码生成 CLI 可切换；长任务支持暂停，生成后还能补充对话继续改。',
      },
      {
        title: '工程落地',
        body: 'FastAPI + SSE 驱动向导与进度；会话落盘可恢复；HBuilderX 按会话独立端口做 H5 测试。主路径本地文件即可跑通，不绑云厂商。',
      },
    ],
    repo: 'https://github.com/sisioow/workflow_uniapp',
    docs: 'https://github.com/sisioow/workflow_uniapp/blob/main/docs/工作流说明.md',
    demo: '',
    video: './demos/workflow-uniapp.mp4',
    stack: ['Python', 'FastAPI', 'UniApp', 'Stitch MCP', 'Claude', 'Cursor', 'Codex'],
  },
  {
    id: 'deep-research',
    name: 'Deep Research 深度调研台',
    tag: '垂类 · 可演示',
    status: 'live',
    hook: '多智能体深度调研：拆解 → 并行检索 → 冲突裁决 → 带引用成稿',
    description:
      '面向技术选型与竞品情报的 Deep Research Agent 演示。模拟 Planner / Search Crew / Critic / Writer 全链路，实时展示证据池、冲突裁决次数与综合置信度，输出可溯源研究报告。用于体现 Multi-Agent、Planning、Citation 与轻量 Eval 能力。',
    focus: [
      { title: '竞争力点', body: '不是聊天问答，而是可交叉验证的调研闭环；报告带引用编号与风险标注。' },
      { title: '可交互', body: '网页内一键跑通，无需 API Key；支持框架选型 / 竞品定价 / MCP 生态三类课题。' },
    ],
    demo: './demos/deep-research/',
    stack: ['Multi-Agent', 'Planning', 'Citation', 'Eval'],
  },
  {
    id: 'kb-agent',
    name: '企业知识库客服 Agent',
    tag: '垂类 · RAG',
    status: 'live',
    hook: '生产向 RAG：混合检索 → Rerank → 带引用回答，并展示 Hit@3 / 忠实度',
    description:
      '企业知识库客服演示台。切换「产品手册 / 售后政策」知识库后提问，可视化展示切片命中分、重排 Top3，并生成带引用答复与简易评测指标。补齐 Agent 岗高频要求的 RAG、溯源与可观测表达。',
    focus: [
      { title: '可交互', body: '本地静态演示即可点测；预设高频售后/产品问题一键切换。' },
      { title: '工程表达', body: '把检索质量与回答忠实度做成可见指标，而不是只给一段答案。' },
    ],
    demo: './demos/kb-agent/',
    stack: ['RAG', 'Rerank', 'Citation', 'Eval'],
  },
  {
    id: 'crewai',
    name: 'CrewAI Mission Console',
    tag: '多智能体',
    status: 'live',
    hook: '多智能体顺序协作：检索 → 成稿 → 质检，工具调用与报告产物可视化',
    description:
      '基于 CrewAI 的协作控制台。启动后研究员、分析师、质检官依次执行，实时输出工具调用日志、事件流与结构化 Markdown 报告。',
    demo: './demos/crewai/',
    video: './demos/crewai.mp4',
    repo: 'https://github.com/sisioow/crewAI',
    stack: ['CrewAI', 'Multi-Agent', 'Python'],
  },
  {
    id: 'browser-use',
    name: 'Browser-Use Pilot',
    tag: '浏览器 Agent',
    status: 'live',
    hook: '自然语言驱动浏览器：导航、点击、填表与结构化抽取',
    description:
      'Browser-Use 浏览器操作台。Agent 在页面中完成导航、元素高亮、键入与抽取，覆盖竞品比价、表单填写、版本情报三类任务。',
    demo: './demos/browser-use/',
    video: './demos/browser-use.mp4',
    repo: 'https://github.com/sisioow/browser-use',
    stack: ['Browser-Use', 'CDP', 'Python'],
  },
  {
    id: 'wenshu-jingling',
    name: '文书精灵',
    tag: '法律 AI',
    hook: '垂类大模型生成法言法语文书，服务法院一线',
    description:
      '基于专项训练的法律大模型，完成案件信息抽取与民刑事核心段落生成。个人负责判决书等关键段落的 Prompt 与生成链路，准确率与可用性达到上线标准，并在基层法院真实使用。',
    focus: [
      { title: '落地效果', body: '服务鄂州梁子湖区法院、武汉东湖高新区法院等一线场景。' },
      { title: '技术重点', body: 'Python + Jinja2 动态文书组件，Prompt 与应用层集成。' },
    ],
    stack: ['Python', 'LLM', 'Jinja2'],
    status: 'archived',
  },
  {
    id: 'element-lawsuit',
    name: '要素式诉讼文书系统',
    tag: '全栈',
    hook: '引导式填写规范诉状，降低群众准备材料成本',
    description:
      '响应最高院要素式示范文本推广，做成结构化引导填写与智能转换。覆盖多类起诉状模板，支持预览修改与 PDF / Word 导出打印。',
    focus: [
      { title: '职责', body: '协同产品与 UI，基于 Vue3 + Node.js 完成核心模板与双端共享。' },
      { title: '结果', body: '支持起诉状一键导出 PDF / Word 并打印。' },
    ],
    stack: ['Vue3', 'Node.js'],
    status: 'archived',
  },
  {
    id: 'iaa-games',
    name: 'IAA 工具 / 策略 A 面',
    tag: '商业化',
    hook: '应用商店工具类 A 面，多渠道稳定在架',
    description:
      '面向华为、荣耀、小米、vivo、OPPO 等渠道的 A 面工程。独立完成方案、技术选型、UI、实现与打包部署，产出箭头类、螺丝类等多款产品并保持在架。',
    focus: [
      { title: '全流程', body: '从产品方案到多端实现（Vue / UniApp / Flutter 等）独立闭环。' },
      { title: '结果', body: '多款产品在主流安卓渠道稳定上架。' },
    ],
    stack: ['UniApp', 'Flutter', 'Vue'],
    status: 'live',
  },
  {
    id: 'duoduo-quiz',
    name: '多多答题',
    tag: '游戏',
    hook: '答题激励类 Cocos 重写，AI + 引擎加速交付',
    description:
      '将旧安卓答题返现项目用 Cocos Creator 重写。负责核心玩法、UI、接口与广告 SDK；通过 AI IDE / CLI + MCP 操控引擎完成节点与场景搭建。',
    focus: [
      { title: '范围', body: '玩法逻辑、动画、广告接入全覆盖。' },
      { title: '提效', body: 'MCP + Cocos 自动化建节点 / 场景，缩短重写周期。' },
    ],
    stack: ['Cocos Creator', 'MCP'],
    status: 'wip',
  },
]

export type Repo = {
  name: string
  description: string
  url: string
  language: string
}

export const repos: Repo[] = [
  {
    name: 'sisioow/workflow_uniapp',
    description: '本地 App 生成工作流源码（需求 → 设计 → 代码 → 测试发布）',
    url: 'https://github.com/sisioow/workflow_uniapp',
    language: 'Python',
  },
  {
    name: 'sisioow/crewAI',
    description: '多智能体协作演示控制台',
    url: 'https://github.com/sisioow/crewAI',
    language: 'JavaScript',
  },
  {
    name: 'sisioow/browser-use',
    description: '浏览器 Agent 演示控制台',
    url: 'https://github.com/sisioow/browser-use',
    language: 'JavaScript',
  },
  {
    name: 'sisioow/Resume',
    description: '个人作品集站点源码',
    url: 'https://github.com/sisioow/Resume',
    language: 'TypeScript',
  },
]

export type Demo = {
  title: string
  description: string
  src?: string
  external?: string
  poster?: string
}

export const demos: Demo[] = [
  {
    title: 'Deep Research',
    description: '多智能体深度调研：证据池 + 冲突裁决 + 带引用成稿。',
    external: './demos/deep-research/',
  },
  {
    title: '知识库客服 Agent',
    description: 'RAG 检索命中、Rerank 与带引用回答，可网页点测。',
    external: './demos/kb-agent/',
  },
  {
    title: 'workflow_uniapp',
    description: '从产品名到可交付 UniApp 工程。',
    src: './demos/workflow-uniapp.mp4',
    poster: './demos/workflow-uniapp-poster.jpg',
    external: 'https://github.com/sisioow/workflow_uniapp',
  },
  {
    title: 'CrewAI',
    description: '研究员 → 分析师 → 质检官协作与报告产出。',
    src: './demos/crewai.mp4',
    poster: './demos/crewai-poster.jpg',
    external: './demos/crewai/',
  },
  {
    title: 'Browser-Use',
    description: '浏览器导航、点击与结构化比价抽取。',
    src: './demos/browser-use.mp4',
    poster: './demos/browser-use-poster.jpg',
    external: './demos/browser-use/',
  },
]
