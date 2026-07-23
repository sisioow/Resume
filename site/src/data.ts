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
    '数字媒体技术背景，专注 AI Agent 工作流、自动化代码生成与多端交付。擅长将 Cursor / Claude / n8n / MCP 串成端到端流水线，覆盖方案、UI、开发与验收。代表作：开源本地 App 生成工作流 workflow_uniapp。',
  highlights: [
    'workflow_uniapp：n8n 流水线本地化，8 步向导从需求到 UniApp 交付',
    '集成 Stitch MCP + Claude / Codex / Cursor CLI 自动化设计与代码生成',
    '法律 AI 文书系统落地法院场景；UniApp / Cocos 多端产品上架经验',
  ],
  skills: [
    'Python / FastAPI',
    'Vue / UniApp',
    'Node.js',
    'n8n / MCP',
    'Claude Code / Cursor / Codex',
    'Google Stitch',
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
      '将流水线重构为本地 Web 应用 workflow_uniapp，集成 Cursor CLI / Claude Code 产出 UniApp 工程',
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
  /** 一句话摘要 */
  description: string
  /** 详细介绍段落 */
  details?: string[]
  /** 能力 / 亮点列表 */
  highlights?: string[]
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
    name: 'workflow_uniapp · App 生成本地工作流',
    tag: '最新 · Agent / UniApp',
    featured: true,
    status: 'live',
    description:
      '将原先基于 n8n 的「应用生成」流水线重构为可本地运行的 Web 工作流：输入应用名称后，自动完成需求分析、人工审核、UI 风格与 Stitch 设计、方案确认、uni-app 工程初始化、AI 代码生成，以及整理 / H5 测试 / Git 发布。',
    details: [
      '定位与价值：把「产品经理 + UI + 开发」串成可观测、可暂停、可恢复的 8 步向导，降低从一句话需求到可跑 UniApp 工程的交付成本。主路径为 Python FastAPI + 本地文件会话持久化（默认端口 8765）；可选 Spring Boot + MySQL 后端（8766）便于库表运维，与 Python 会话数据隔离。',
      '端到端流程：① 应用信息 → ② LLM 需求分析（OpenAI 兼容接口，产出多套 4 页功能方案）→ ③ 人工审核与编辑 → ④ 选择 UI 风格（Stitch 设计或跳过设计）→ ⑤ 多风格并行 Stitch MCP 出稿（并发上限 3）→ ⑥ 选定方案与代码生成工具 → ⑦ 拷贝 uni-app 模板并由 Claude Code / Codex / Cursor Agent 流式生成代码（支持暂停与补充对话）→ ⑧ 生成 README 功能清单、HBuilderX 独立端口 H5 测试、Git 分支发布、用 Cursor 打开工程。',
      '技术架构：Web 向导经 HTTP / SSE 对接 FastAPI；WorkflowOrchestrator 负责状态机、提示词与 CLI 编排；会话状态落盘于 .runtime/sessions/<id>/state.json；Stitch 经 MCP（create_project / generate_screen_from_text / get_screen）拉设计图与 HTML 至 static/stitch/；长任务支持协作式取消并杀掉子进程。同时提供 cli.py 无 UI 命令行路径，以及侧栏多项目管理（组号筛选、删除并终止相关进程）。',
    ],
    highlights: [
      '8 步可视化向导 + 侧栏多会话：步骤可切换查看，设计 / 代码生成可暂停，失败可定位 error_step 重试',
      '双设计路线：Google Stitch MCP 并行出 4 屏 UI，或跳过设计直接按需求与风格 codegen',
      '三工具代码生成：Claude Code（默认）/ Codex / Cursor Agent，日志 SSE 实时推送，支持右侧补充对话改需求 / 修 Bug',
      '交付闭环：README 功能清单、HBuilderX H5（会话独立端口 8100–8999）、Git worktree 发分支、Cursor 一键打开',
      '配置分层：local_config.yaml 管密钥与路径，config.yaml 管风格列表；密钥不进仓库',
      '开源仓库含完整文档：工作流说明、优化分析、Architecture / Stitch MCP 规范与 harness skills',
    ],
    repo: 'https://github.com/sisioow/workflow_uniapp',
    docs: 'https://github.com/sisioow/workflow_uniapp/blob/main/docs/工作流说明.md',
    demo: '',
    video: '',
    stack: [
      'Python',
      'FastAPI',
      'SSE',
      'UniApp',
      'Stitch MCP',
      'Claude Code',
      'Codex',
      'Cursor Agent',
      'HBuilderX',
    ],
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
    name: 'sisioow/workflow_uniapp',
    description: 'App 生成本地工作流：需求 → Stitch → UniApp 代码 → H5 测试 / Git 发布',
    url: 'https://github.com/sisioow/workflow_uniapp',
    language: 'Python',
  },
  {
    name: 'sisioow/Resume',
    description: '本站源码（个人作品集站点）',
    url: 'https://github.com/sisioow/Resume',
    language: 'TypeScript',
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
    title: 'workflow_uniapp 端到端演示',
    description:
      '从应用名称到 UniApp 工程：需求分析、Stitch 设计、代码生成与 H5 测试。录屏待补充，可先看仓库文档。',
    src: '',
    external: 'https://github.com/sisioow/workflow_uniapp',
  },
  {
    title: 'Cocos MCP 自动建场景',
    description: 'AI 操控 Cocos Creator 创建节点 / 场景 / 脚本的演示占位。',
    src: '',
    external: '',
  },
]
