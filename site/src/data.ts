/** 站点内容配置 —— 后续只需改这个文件即可更新作品集 / 仓库 / 演示 */

export const site = {
  name: '施宏威',
  title: 'Agent 开发工程师',
  tagline: '用 AI Agent 把产品从一句话做到可上架交付',
  location: '湖北 · 远程协作',
  email: '15587742070@163.com',
  phone: '155-8774-2070',
  github: 'https://github.com/sisioow',
  gitee: '',
  resumePdf: './resume.pdf',
}

export const about = {
  summary:
    '数字媒体技术背景，专注 AI Agent 工作流、自动化代码生成与多端交付。擅长将 Cursor / Claude / n8n / MCP 串成端到端流水线，覆盖方案、UI、开发与验收。',
  highlights: [
    'n8n 端到端 Agent 工作流：方案 → UI → 代码 → 验收打包',
    'UniApp / Cocos 多端产品自动化交付与渠道上架',
    '法律 AI 文书系统落地法院场景',
  ],
  skills: [
    'Python',
    'Node.js',
    'Vue / UniApp',
    'HTML / CSS / JS',
    'n8n / MCP',
    'Cursor / Claude Code',
    'Cocos Creator',
    'CI/CD',
  ],
}

export const experiences = [
  {
    company: '北京臻盛网络有限公司',
    role: 'Agent 开发工程师',
    period: '2026.01 — 至今',
    points: [
      '基于 n8n 搭建端到端自动化开发工作流，覆盖方案、UI、代码生成与验收测试',
      '集成 Cursor CLI / Claude Code，实现需求到 UniApp 代码的自动产出',
      '负责 Agent 平台可视化工作流编辑器与 Cocos MCP 调研落地',
    ],
  },
  {
    company: '武汉百智诚远科技有限公司',
    role: 'AI 全栈开发工程师',
    period: '2025.02 — 2025.08',
    points: [
      '诉讼文书辅助填写系统：11 类要素式文书前端与导出能力',
      '文书精灵：Prompt、LLM 服务与 Jinja2 动态文书生成',
      '判决书核心段落智能生成，落地鄂州梁子湖区法院与武汉东湖高新区法院',
    ],
  },
]

export const education = {
  school: '桂林电子科技大学',
  major: '数字媒体技术 · 本科',
  period: '2021.09 — 2025.06',
}

/** 作品集 —— 占位，后续补充链接 / 封面 / 演示 */
export type Project = {
  id: string
  name: string
  tag: string
  description: string
  repo?: string
  demo?: string
  video?: string
  stack: string[]
  status: 'live' | 'wip' | 'archived'
}

export const projects: Project[] = [
  {
    id: 'agent-pipeline',
    name: 'Agent 自动化交付流水线',
    tag: 'Agent / n8n',
    description:
      '端到端自动化工作流：产品方案 → UI 设计 → 代码生成 → 验收测试 → 多端打包。占位条目，待补充仓库与演示。',
    repo: '',
    demo: '',
    video: '',
    stack: ['n8n', 'MCP', 'Cursor', 'UniApp'],
    status: 'wip',
  },
  {
    id: 'wenshu-jingling',
    name: '文书精灵',
    tag: '法律 AI',
    description:
      '基于垂类大模型的法律文书智能生成，覆盖民刑事核心段落，服务多家基层法院。占位条目，待补充材料。',
    repo: '',
    demo: '',
    video: '',
    stack: ['Python', 'Jinja2', 'LLM'],
    status: 'archived',
  },
  {
    id: 'element-lawsuit',
    name: '要素式诉讼文书辅助填写系统',
    tag: '全栈',
    description:
      '引导式结构化填写与诉状智能转换，支持预览、PDF/Word 导出与打印。占位条目，待补充链接。',
    repo: '',
    demo: '',
    video: '',
    stack: ['Vue3', 'Node.js'],
    status: 'archived',
  },
  {
    id: 'iaa-games',
    name: 'IAA 策略游戏 A 面工程',
    tag: '产品 / 多端',
    description:
      '应用商店工具类 A 面产品（箭头类、螺丝类等），覆盖华为 / 荣耀 / 小米 / vivo / OPPO。待补充商店链接与录屏。',
    repo: '',
    demo: '',
    video: '',
    stack: ['Vue', 'UniApp', 'Flutter'],
    status: 'live',
  },
  {
    id: 'duoduo-quiz',
    name: '多多答题 Cocos 游戏',
    tag: '游戏',
    description:
      '答题类激励返现策略游戏 Cocos 重写，覆盖玩法、动画与广告 SDK。待补充仓库与演示录屏。',
    repo: '',
    demo: '',
    video: '',
    stack: ['Cocos Creator', 'MCP'],
    status: 'wip',
  },
]

/** 公开仓库 —— 后续填真实地址 */
export type Repo = {
  name: string
  description: string
  url: string
  language: string
}

export const repos: Repo[] = [
  {
    name: 'sisioow/Resume',
    description: '本站源码（个人作品集站点）',
    url: 'https://github.com/sisioow/Resume',
    language: 'TypeScript',
  },
  {
    name: '待补充仓库',
    description: '把你的开源 / 演示仓库地址填到 src/data.ts',
    url: '',
    language: '—',
  },
]

/** 演示录屏 —— 可放本地 public/demos 或 B 站 / 腾讯视频外链 */
export type Demo = {
  title: string
  description: string
  /** 本地 mp4 路径，如 /demos/xxx.mp4；或留空 */
  src?: string
  /** 外链（B 站等） */
  external?: string
  poster?: string
}

export const demos: Demo[] = [
  {
    title: 'Agent 工作流演示',
    description: '从一句话需求到可运行 H5 / UniApp 工程的录屏占位。',
    src: '',
    external: '',
  },
  {
    title: 'Cocos MCP 自动建场景',
    description: 'AI 操控 Cocos Creator 创建节点 / 场景 / 脚本的演示占位。',
    src: '',
    external: '',
  },
]
