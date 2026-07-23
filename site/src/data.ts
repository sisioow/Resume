/** 站点内容：有层级、适度展开，突出重点 */

export const site = {
  name: '施宏威',
  title: 'Agent 开发工程师',
  tagline: '用 Agent 把产品从想法做成可交付工程',
  lead: '专注 AI Agent 工作流与多端交付。能独立覆盖产品方案、UI 设计与代码落地，代表作是开源的本地 App 生成工作流。',
  location: '湖北 · 远程协作',
  email: '15587742070@163.com',
  phone: '155-8774-2070',
  github: 'https://github.com/sisioow',
  gitee: '',
  /**
   * 国内可预览入口：Gitee Pages
   * 例：https://你的用户名.gitee.io/Resume/
   */
  mirror: '',
  /** OSS 仅备份，默认域名无法在线预览 */
  ossBackup: 'https://shihongwei-resume.oss-cn-beijing.aliyuncs.com/index.html',

  resumePdf: './resume.pdf',
}

/** Hero 交互演示 */
export const magicPrompts = [
  { name: '藏品库', out: 'UniApp 工程就绪' },
  { name: '我爱打螺丝', out: '渠道可上架包' },
  { name: '文书精灵', out: '法院场景可用' },
  { name: '多多答题', out: 'Cocos 玩法跑通' },
]

export const about = {
  summary:
    '桂林电子科技大学数字媒体技术背景，现任 Agent 开发工程师。擅长把 LLM、MCP、代码生成 CLI 编排成可落地的交付链路，也有法院场景与应用商店多端上架经验。',
  highlights: [
    '代表作 workflow_uniapp：本地 Agent 从需求到 UniApp 工程闭环',
    '可独立承担产品方案、UI 与多端开发，交付效率显著提升',
    '法律 AI 落地法院；多款 IAA / 工具类产品稳定在架',
  ],
  skills: [
    'Agent 编排',
    'Claude / Cursor / Codex',
    'Stitch MCP',
    'UniApp / Vue',
    'Python / FastAPI',
    'Cocos',
    '多端上架',
  ],
}

export const experiences = [
  {
    company: '北京臻盛网络有限公司',
    role: 'Agent 开发工程师',
    period: '2026.01 — 至今',
    points: [
      '搭建端到端 Agent 交付能力：方案、设计、代码生成与验收测试',
      '落地 workflow_uniapp，集成 Claude / Cursor / Codex 与 Stitch MCP',
    ],
  },
  {
    company: '武汉百智诚远科技有限公司',
    role: 'AI 全栈开发工程师',
    period: '2025.02 — 2025.08',
    points: [
      '文书精灵核心段落智能生成，落地基层法院一线使用',
      '要素式诉状系统：引导填写到 PDF / Word 导出',
    ],
  },
]

export const education = {
  school: '桂林电子科技大学',
  major: '数字媒体技术 · 本科',
  period: '2021.09 — 2025.06',
}

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
        body: '输出不是聊天记录，而是可编译的 UniApp 工程：带功能清单 README、可 H5 预览、可推到 Git 分支。面试官打开仓库就能顺着文档跑起来。',
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
    video: '',
    stack: ['Python', 'FastAPI', 'UniApp', 'Stitch MCP', 'Claude', 'Cursor', 'Codex'],
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
      { title: '个人职责', body: '协同产品与 UI，基于 Vue3 + Node.js 完成核心模板与双端共享能力。' },
      { title: '业务价值', body: '让普通人按步骤填完，就能产出可用诉讼材料。' },
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
    hook: '答题激励类 Cocos 重写，验证 AI + 引擎提效',
    description:
      '将旧安卓答题返现项目用 Cocos Creator 重写。个人负责核心玩法、UI、接口与广告 SDK，并验证 AI IDE / CLI + MCP 操控引擎的快速交付能力。',
    focus: [
      { title: '交付范围', body: '玩法逻辑、动画、广告接入全覆盖。' },
      { title: '方法验证', body: 'MCP + Cocos 自动化建节点 / 场景，缩短重写周期。' },
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
    title: 'workflow_uniapp 演示',
    description: '录屏位预留。可先通过仓库 README 与工作流说明了解完整能力。',
    src: '',
    external: 'https://github.com/sisioow/workflow_uniapp',
  },
]
