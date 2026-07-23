/** 站点内容 —— 偏「结果与冲击力」，细节见仓库文档 */

export const site = {
  name: '施宏威',
  title: 'Agent 开发工程师',
  /** Hero 主句：要能让 HR 停住 */
  tagline: '一句话产品名，吐出可上架 App',
  lead: '我把产品、设计、开发收成一条本地 Agent。不是演示 PPT——是真能跑、能测、能推仓库的交付机。',
  location: '湖北 · 远程协作',
  email: '15587742070@163.com',
  phone: '155-8774-2070',
  github: 'https://github.com/sisioow',
  gitee: '',
  resumePdf: './resume.pdf',
}

/** Hero 里循环演示的「产品名 → 工程」 */
export const magicPrompts = [
  { name: '藏品库', out: 'UniApp 工程就绪' },
  { name: '我爱打螺丝', out: '渠道可上架包' },
  { name: '文书精灵', out: '法院场景可用' },
  { name: '多多答题', out: 'Cocos 玩法跑通' },
]

export const about = {
  summary:
    '数字媒体出身，现在专干一件事：用 Agent 把「想法」压成「可交付产品」。能独立扛产品方案、UI、多端代码与上架节奏。',
  highlights: [
    '一个人顶产品 + UI + 开发，交付周期可压到原来约 1/10',
    '代表作开源：workflow_uniapp —— 本地 App 生成工作流',
    '法律 AI 落地法院；多款 IAA / 工具 App 稳定在架',
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
      '搭本地 Agent 交付机：从产品名直达 UniApp，覆盖方案、设计、代码与验收',
      '深度集成 Claude / Cursor / Codex 与 Stitch，把「能吹」变成「能交」',
    ],
  },
  {
    company: '武汉百智诚远科技有限公司',
    role: 'AI 全栈开发工程师',
    period: '2025.02 — 2025.08',
    points: [
      '法律 AI 文书落地法院一线，法官真在用',
      '要素式诉状系统：引导填写到 PDF/Word 一键导出',
    ],
  },
]

export const education = {
  school: '桂林电子科技大学',
  major: '数字媒体技术 · 本科',
  period: '2021.09 — 2025.06',
}

export type Impact = { value: string; label: string }

export type Project = {
  id: string
  name: string
  tag: string
  /** 一句话钩子 */
  hook: string
  description: string
  /** 吹牛向短句，最多 3 条 */
  boasts?: string[]
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
    hook: '输入产品名。出去的是可跑工程。',
    description:
      '本地 Agent 交付机：自动想清楚做什么、长什么样、代码怎么写，再测一遍、推进仓库。PM / UI / 开发 —— 我一个人用 Agent 全包了。',
    boasts: [
      '不是聊天机器人，是能交活的生产线',
      '设计稿 + 代码 + H5 自测，一条龙本地闭环',
      'Claude / Codex / Cursor 随手换，挑最狠的那把刀',
    ],
    impact: [
      { value: '≈90%', label: '交付周期压缩' },
      { value: '1→3', label: '一人顶三角色' },
      { value: '开源', label: '完整可复现' },
    ],
    repo: 'https://github.com/sisioow/workflow_uniapp',
    docs: 'https://github.com/sisioow/workflow_uniapp/blob/main/docs/工作流说明.md',
    demo: '',
    video: '',
    stack: ['Agent', 'Stitch', 'Claude', 'Cursor', 'UniApp', 'FastAPI'],
  },
  {
    id: 'wenshu-jingling',
    name: '文书精灵',
    tag: '法律 AI',
    hook: '法言法语，法官真在用。',
    description: '垂类大模型写核心文书段落，落地基层法院一线。',
    stack: ['Python', 'LLM', 'Jinja2'],
    status: 'archived',
  },
  {
    id: 'element-lawsuit',
    name: '要素式诉讼文书系统',
    tag: '全栈',
    hook: '普通人也能填出规范诉状。',
    description: '引导式填写到 PDF / Word 导出，贴合最高院示范文本。',
    stack: ['Vue3', 'Node.js'],
    status: 'archived',
  },
  {
    id: 'iaa-games',
    name: 'IAA 工具 / 策略 A 面',
    tag: '商业化',
    hook: '多渠道在架，不是 Demo。',
    description: '箭头类、螺丝类等产品，覆盖华为 / 荣耀 / 小米 / vivo / OPPO。',
    stack: ['UniApp', 'Flutter'],
    status: 'live',
  },
  {
    id: 'duoduo-quiz',
    name: '多多答题',
    tag: '游戏',
    hook: 'AI + Cocos，旧安卓重写成新游。',
    description: '答题激励玩法全量实现，验证 MCP 操控引擎的落地速度。',
    stack: ['Cocos', 'MCP'],
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
    description: '一句话 → 可跑 UniApp。开源本地 Agent 交付机。',
    url: 'https://github.com/sisioow/workflow_uniapp',
    language: 'Python',
  },
  {
    name: 'sisioow/Resume',
    description: '本站源码',
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
    title: '代表作实录',
    description: '录屏稍后补上。想先看硬货，直接进仓库。',
    src: '',
    external: 'https://github.com/sisioow/workflow_uniapp',
  },
]
