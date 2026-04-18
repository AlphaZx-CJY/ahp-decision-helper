# AHP Decision Helper

一个基于 **层次分析法（AHP, Analytic Hierarchy Process）** 的 AI Agent Skill，帮助你在多个备选方案中做出科学、理性的最优选择。

## 功能简介

当面对多个选择犹豫不决时，这个 Skill 会引导你：
1. 明确决策场景和备选方案
2. 根据场景选择合适的评估准则（如价格、质量、便利性等）
3. 通过两两对比确定各准则和方案的优先级权重
4. 自动计算综合得分并给出一致性检验
5. 告诉你**当下最值得选择的方案**

## 适用场景

| 场景 | 评估维度示例 |
|------|-------------|
| 🏠 买房/租房 | 价格、地段、面积、配套、交通、学区 |
| 🚗 买车 | 价格、油耗/续航、空间、品牌、安全性、保值率 |
| 💼 找工作/选 Offer | 薪资、发展空间、工作强度、通勤、团队氛围 |
| 📱 选手机/数码 | 价格、性能、续航、拍照、屏幕、品牌 |
| 🏙️ 选城市/定居 | 生活成本、就业机会、气候、医疗教育、房价 |
| 📚 选课程/培训 | 价格、师资、口碑、课程质量、就业前景 |
| ✈️ 旅游/出行 | 预算、风景、舒适度、安全性、便利性 |
| 🎯 通用决策 | 成本、收益、风险、时间、质量、满意度 |

## 安装

### 通过 Skills CLI（推荐）

```bash
npx skills add AlphaZx-CJY/ahp-decision-helper
```

### 手动安装

```bash
# 克隆仓库
git clone https://github.com/AlphaZx-CJY/ahp-decision-helper.git

# 复制到你的 skills 目录
# Kimi CLI: ~/.agents/skills/ 或 ~/.kimi/skills/
# Claude Code: ~/.claude/skills/
cp -r ahp-decision-helper ~/.agents/skills/
```

### 通过 .skill 文件安装

下载 [ahp-decision-helper.skill](./ahp-decision-helper.skill)，然后在你的 Agent 设置中导入。

## 使用方法

安装后，用以下任意方式触发 Skill：

- "帮我选一下这几个房子哪个好"
- "帮我分析一下这两个 offer"
- "用 AHP 方法帮我决定买哪款手机"
- "哪个更值得选择？"
- "帮我做一个决策分析"

Agent 会引导你完成整个 AHP 分析流程，最终给出推荐结果。

## 项目结构

```
ahp-decision-helper/
├── SKILL.md                    # Skill 定义（供 AI Agent 读取）
├── scripts/
│   └── ahp-calculator.js       # AHP 计算核心（Node.js）
└── README.md                   # 本文件
```

## 技术说明

- **AHP 算法**：采用特征向量法计算权重，包含一致性检验（CR < 0.1）
- **脚本依赖**：Node.js（无第三方依赖）
- **对比标度**：1-9 标度法，支持中间值和倒数

## 触发关键词

| 中文 | 英文 |
|------|------|
| 帮我选 | help me choose |
| 哪个更好 | which is better |
| 帮我分析 | analyze for me |
| 帮我决定 | help me decide |
| 优先级 | priority |
| 对比 | compare |
| 层次分析法 | AHP |

## License

MIT
