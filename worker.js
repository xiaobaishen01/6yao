export default {
  async fetch(request) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>大衍筮法 · 周易占卜</title>
    <style>
        /* 全局重置与基础设定 */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary-color: #8B4513;
            --secondary-color: #D4A574;
            --bg-color: #1a1a2e;
            --text-color: #f5f5dc;
            --accent-color: #ffd700;
            --card-bg: rgba(139, 69, 19, 0.2);
        }

        html, body {
            height: 100%;
            width: 100%;
            overflow: hidden !important; /* 强制禁止滚动 */
            font-size: 16px; /* 基准字体 */
        }

        body {
            font-family: 'Noto Serif SC', 'SimSun', serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: var(--text-color);
        }

        /* 装饰背景 - 降低层级避免干扰 */
        .bg-pattern {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(circle at 20% 80%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(212, 165, 116, 0.1) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
        }

        /* 主容器 - Flex列布局，撑满全屏 */
        .container {
            width: 100%;
            height: 100vh;
            max-width: 1600px;
            margin: 0 auto;
            padding: 1vh 2vw;
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        /* 头部区域 - 尽可能紧凑 */
        header {
            text-align: center;
            padding: 0.5vh 0;
            border-bottom: 1px solid rgba(212, 165, 116, 0.3);
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }

        .header-content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        h1 {
            font-size: 2.5vh;
            color: var(--accent-color);
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
            letter-spacing: 0.2em;
            line-height: 1.2;
        }

        .subtitle {
            color: var(--secondary-color);
            font-size: 1.2vh;
            opacity: 0.8;
            line-height: 1.2;
        }

        .taiji {
            width: 4vh;
            height: 4vh;
            animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* 步骤指示器 */
        .step-indicator {
            display: flex;
            justify-content: center;
            gap: 1vw;
            padding: 1vh 0;
            flex-shrink: 0;
        }

        .step-dot {
            width: 3vh;
            height: 3vh;
            border-radius: 50%;
            background: var(--card-bg);
            border: 1px solid var(--secondary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2vh;
            transition: all 0.3s ease;
        }

        .step-dot.active {
            background: var(--accent-color);
            color: #1a1a2e;
            transform: scale(1.1);
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .step-dot.completed {
            background: var(--primary-color);
            border-color: var(--accent-color);
        }

        /* 主内容卡片 - 占据所有剩余空间 */
        .main-content {
            background: var(--card-bg);
            border-radius: 12px;
            padding: 1.5vh 2vw;
            border: 1px solid rgba(212, 165, 116, 0.3);
            backdrop-filter: blur(10px);
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden; /* 内部也不允许滚动 */
            min-height: 0; /* 关键：允许flex子项缩小 */
        }

        .section-title {
            text-align: center;
            font-size: 2.2vh;
            color: var(--accent-color);
            padding-bottom: 1vh;
            border-bottom: 1px solid rgba(212, 165, 116, 0.2);
            flex-shrink: 0;
        }

        /* 内容区域 - 自适应填满 */
        .content-scroll {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding: clamp(0.8vh, 1vh, 1.5vh) 0;
            min-height: 0;
            gap: clamp(0.8vh, 1vh, 1.2vh);
        }
        
        .content-scroll::-webkit-scrollbar {
            width: 5px;
        }
        
        .content-scroll::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
        }
        
        .content-scroll::-webkit-scrollbar-thumb {
            background: rgba(212, 165, 116, 0.5);
            border-radius: 3px;
        }

        /* 提问界面 */
        .question-section {
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center; /* 确保子元素水平居中 */
            height: 100%;
        }

        .instruction {
            color: var(--secondary-color);
            font-size: 2.2vh;
            margin-bottom: 2vh;
            line-height: 1.6;
            text-align: center;
            width: 100%;
            min-height: 8vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            gap: 0.5vh;
        }

        .highlight-text {
            color: var(--accent-color);
            font-weight: bold;
            font-size: 1.1em;
            display: inline; /* 关键修改：避免断行 */
        }

        .question-input {
            width: 80%;
            max-width: 600px;
            padding: 1.5vh 1vw;
            font-size: 2vh;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid var(--secondary-color);
            border-radius: 8px;
            color: var(--text-color);
            font-family: inherit;
            margin: 0 auto;
        }

        /* 演算界面布局 - 固定各区块高度 */
        .yarrow-display {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2vw;
            margin: 0 auto;
            width: 100%;
            max-width: 800px;
            /* 固定高度 */
            height: 12vh;
            align-content: center; 
            flex-shrink: 0;
        }

        .yarrow-pile {
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: flex-end; /* 底部对齐，数字向上长 */
        }

        .pile-label {
            font-size: 1.5vh;
            color: var(--secondary-color);
            margin-bottom: 0.5vh;
        }

        .pile-count {
            font-size: 4vh;
            color: var(--accent-color);
            font-weight: bold;
            line-height: 1.2;
            /* text-shadow: 0 0 10px rgba(255, 215, 0, 0.3); */ /* 移除此行 */
            height: 5vh; /* 固定数字高度区域 */
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .yarrow-sticks {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 2px;
            margin: 0.5vh auto;
            height: 2vh;
            min-width: 100%;
            overflow: hidden;
        }

        .stick {
            width: 3px;
            height: 2vh; /* 稍微调小以适应 */
            background: linear-gradient(to bottom, #D4A574, #8B4513);
            /* border-radius: 1px; */ /* 移除此行 */
        }

        .hand-section {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            padding: 1vh 1vw;
            margin: 0 auto;
            width: 100%;
            max-width: 800px;
            text-align: center;
            /* 固定高度 */
            height: 10vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex-shrink: 0;
        }

        .hand-label {
            color: var(--secondary-color);
            font-size: 1.5vh;
            text-align: center;
            margin-bottom: 0.5vh;
        }

        .hand-sticks {
            display: flex;
            justify-content: center;
            gap: 2vw;
            /* flex-wrap: wrap; */ /* 移除此行 */
            height: 5vh; /* 固定高度 */
            align-items: center;
        }

        .finger-gap {
            background: rgba(139, 69, 19, 0.3);
            padding: 0.5vh 1vw;
            border-radius: 6px;
            min-width: 4vw;
            text-align: center;
            height: 100%; /* 撑满父容器 */
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .finger-gap div:first-child {
            font-size: 1.2vh;
            color: var(--secondary-color);
        }

        .finger-gap .count {
            font-size: 2vh;
            color: var(--accent-color);
        }

        .change-info {
            text-align: center;
            padding: 0.5vh;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 6px;
            margin: 0;
            width: 100%; /* 确保全宽 */
            /* 固定高度 */
            height: 6vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex-shrink: 0;
        }

        .change-number {
             font-size: 1.8vh;
             color: var(--accent-color);
             display: block; /* 独占一行确保居中 */
        }
        
        .change-detail {
            font-size: 1.2vh;
            color: var(--secondary-color);
            display: block; /* 独占一行 */
        }

        /* 爻显示区域 */
        .yao-display {
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            justify-content: center;
            gap: clamp(0.5vh, 0.8vh, 1vh);
            flex: 1;
            padding: clamp(0.8vh, 1vh, 1.5vh);
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            margin: 0;
            min-height: 0;
            height: auto;
            max-height: none;
            flex-shrink: 1;
            overflow-y: auto;
        }

        .yao-row {
            display: flex;
            align-items: center;
            gap: 1vw;
            height: 2.5vh; /* 固定高度 */
        }

        .yao-label {
            width: 3vw;
            text-align: right;
            color: var(--secondary-color);
            font-size: 1.5vh;
        }

        .yao-line {
            display: flex;
            gap: 0;
        }
        
        .yao-line.yin-line {
            gap: 0.8vw;
        }

        .yao-segment {
            width: 6vw;
            height: 1.2vh;
            background: var(--accent-color);
            border-radius: 2px;
            transition: all 0.3s ease;
        }

        .yao-segment.pending {
            background: rgba(212, 165, 116, 0.3);
        }
        
        .yao-value {
             width: 3vw;
             font-size: 1.5vh;
             text-align: center;
             color: var(--accent-color);
             font-weight: bold;
        }

        .yao-moving {
            font-size: 1.2vh;
            color: #ff6b6b;
        }

        /* 结果页布局 - 核心两列布局逻辑 */
        .result-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto 1fr;
            gap: clamp(1vh, 1.5vh, 2vh) clamp(1.5vw, 2vw, 2.5vw);
            flex: 1;
            width: 100%;
            overflow: hidden;
            min-height: 0;
        }

        @media (min-width: 1600px) {
            .result-section {
                max-width: 1400px;
                margin: 0 auto;
            }
        }

        .result-main {
            grid-column: 1 / -1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: clamp(1.5vw, 2vw, 2.5vw);
            background: rgba(0,0,0,0.2);
            padding: clamp(0.8vh, 1.2vh, 1.5vh);
            border-radius: 10px;
            max-height: none;
            flex-shrink: 0;
            flex-wrap: wrap;
        }

        .gua-symbol {
            font-size: 6vh;
            line-height: 1;
            filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.3));
        }

        .gua-name {
            font-size: 4vh;
            color: var(--accent-color);
            font-weight: bold;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }

        .result-right {
            display: flex;
            flex-direction: column;
            gap: 1.5vh;
            overflow: hidden;
            height: 100%;
            min-height: 0;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 12px;
            padding: 1.5vh;
            border: 1px solid rgba(212, 165, 116, 0.1);
        }

        .result-right > .column-title {
            flex-shrink: 0;
        }

        .result-right > #yaoTextSection {
            flex: 1;
            min-height: 0;
            overflow-y: auto;
        }

        .result-right > .bian-gua {
            flex-shrink: 0;
            max-height: 35%;
            overflow-y: auto;
        }
        
        .column-title {
            text-align: center;
            font-size: 2vh;
            color: var(--secondary-color);
            border-bottom: 2px solid rgba(212, 165, 116, 0.3);
            padding-bottom: 0.8vh;
            margin-bottom: 0.5vh;
            font-weight: bold;
            letter-spacing: 0.1em;
            flex-shrink: 0;
        }
        
        /* 如果内容过多，使用 Flex 压缩 */
        .gua-judgment, .gua-explanation, .yao-text, .bian-gua {
            background: var(--card-bg); /* 复用背景 */
            padding: 1.5vh;
            border-radius: 8px;
            text-align: left;
            flex-shrink: 1; /* 允许压缩 */
            overflow: hidden; /* 防止溢出 */
            display: flex;
            flex-direction: column;
            min-height: 0;
        }
        
        /* 变卦区域特殊处理 */
        .bian-gua {
            border-top: 1px solid rgba(212, 165, 116, 0.3);
            margin-top: 1vh;
            padding-top: 1.2vh;
            padding-bottom: 0.5vh;
        }

        .bian-gua h3 {
            margin-bottom: 0.5vh;
            font-size: 1.8vh;
        }

        .bian-gua .gua-symbol {
            font-size: 3vh;
            margin: 0.5vh 0;
        }

        .bian-gua .gua-judgment {
            padding: 0.8vh;
            margin: 0;
        }

        .result-left h3, .result-right h3 {
            color: var(--secondary-color);
            font-size: 2vh;
            margin-bottom: 0.5vh;
            text-align: center;
            flex-shrink: 0;
        }

        .result-left p, .result-right p, .yao-text div {
             font-size: 1.6vh;
             line-height: 1.4;
             color: var(--text-color);
             overflow: hidden;
             text-overflow: ellipsis; 
             display: -webkit-box;
             -webkit-line-clamp: 10; /* 限制行数 */
             -webkit-box-orient: vertical;
        }
        
        #yaoTextSection {
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            gap: clamp(0.4vh, 0.6vh, 0.8vh);
            min-height: 0;
            flex: 1;
        }
        
        .yao-text {
            padding: 0.8vh;
            background: rgba(0,0,0,0.3);
            flex-shrink: 1;
        }
        
        .yao-text .yao-title {
             color: var(--accent-color);
             font-weight: bold;
             font-size: 1.6vh;
             margin-bottom: 0.3vh;
        }

        /* 按钮区域 */
        .btn-container {
            padding-top: 1vh;
            border-top: 1px solid rgba(212, 165, 116, 0.2);
            flex-shrink: 0;
            margin-top: auto;
        }

        .btn-group {
            display: flex;
            justify-content: center;
            gap: 1vw;
            flex-wrap: wrap;
        }

        .btn {
            padding: 1vh 2vw;
            font-size: 2vh;
            font-family: inherit;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 0.4vh;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary-color), #A0522D);
            color: var(--text-color);
            border: 1px solid var(--secondary-color);
        }

        .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(139, 69, 19, 0.4);
        }
        
        .btn-accent {
            background: linear-gradient(135deg, #ffd700, #ffaa00);
            color: #1a1a2e;
            font-weight: bold;
        }

        .btn-accent:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
        }

        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .progress-bar {
            width: 100%;
            height: 0.5vh;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 3px;
            margin: 0.8vh 0;
            overflow: hidden;
            flex-shrink: 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            border-radius: 2px;
            transition: width 0.5s ease;
        }

        .hidden {
            display: none !important;
        }

        .bg-pattern { opacity: 0.5; }

        footer {
            text-align: center;
            padding: 0.5vh;
            color: var(--secondary-color);
            opacity: 0.6;
            font-size: 1.2vh;
            flex-shrink: 0;
            line-height: 1.4;
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            .container { padding: 0.5vh 1vw; }
            
            header {
                gap: 10px;
            }
            h1 { font-size: 2.2vh; }
            .subtitle { font-size: 1vh; }
            .taiji { width: 3vh; height: 3vh; }

            .step-dot {
                width: 2.5vh;
                height: 2.5vh;
                font-size: 1vh;
            }
            
            .section-title { font-size: 2vh; }
            .instruction { 
                font-size: 1.8vh; 
                margin-bottom: 1.5vh; 
                min-height: 10vh; /* 移动端文字可能折行，留高一点 */
            }
            .question-input { font-size: 1.8vh; padding: 1.2vh 1vw; }

            .yarrow-display {
                height: 10vh; /* 移动端稍微调小 */
            }
            .pile-label { font-size: 1.2vh; }
            .pile-count { font-size: 3vh; height: 4vh; }
            .stick { height: 2vh; }
            
            .hand-section {
                height: 8vh;
            }
            .hand-label { font-size: 1.2vh; }
            .hand-sticks { height: 4vh; }
            .finger-gap { padding: 0.4vh 0.8vw; min-width: 6vw; }
            .finger-gap div:first-child { font-size: 1vh; }
            .finger-gap .count { font-size: 1.8vh; }
            
            .change-info {
                height: 5vh;
            }
            .change-number { font-size: 1.6vh; }
            .change-detail { font-size: 1vh; }

            .yao-display {
                height: 20vh; /* 移动端调小爻区域高度 */
                max-height: 20vh;
            }
            .yao-label { font-size: 1.2vh; width: 4vw; }
            .yao-segment { width: 10vw; height: 1vh; }
            .yao-line.yin-line { gap: 0.6vw; }
            .yao-value { font-size: 1.2vh; width: 4vw; }
            .yao-moving { font-size: 1vh; }
            
            /* 移动端强制紧凑单列，但使用vh控制高度不溢出 */
            .result-section {
                display: flex;
                flex-direction: column;
                gap: clamp(0.8vh, 1.2vh, 1.5vh);
                overflow-y: auto;
            }
            
            .result-left {
                flex: 0 0 auto;
                max-height: 40vh;
                overflow-y: auto;
                gap: clamp(0.5vh, 0.8vh, 1vh);
            }

            .result-right {
                flex: 1;
                min-height: 0;
                gap: clamp(0.5vh, 0.8vh, 1vh);
            }

            .result-right > .column-title {
                flex-shrink: 0;
            }

            .result-right > #yaoTextSection {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
            }

            .result-right > .bian-gua {
                flex-shrink: 0;
                max-height: 30vh;
                overflow-y: auto;
            }

            .gua-explanation {
                max-height: none;
                overflow: visible;
                flex-shrink: 1;
            }

            .gua-judgment {
                max-height: none;
                overflow: visible;
                flex-shrink: 1;
            }

            .yao-display {
                height: auto;
                max-height: none;
                flex-shrink: 1;
            }
            
            .result-main {
                flex-shrink: 0;
                padding: 0.5vh;
                max-height: 8vh;
                gap: 1vw;
            }
            
            .gua-symbol { font-size: 4vh; }
            .gua-name { font-size: 3vh; }
            
            .result-left, .result-right {
                flex: 1;
                min-height: 0;
                gap: 0.5vh;
            }
            
            
            .gua-judgment {
                flex: 0 0 auto;
                max-height: 25vh; /* 限制高度，允许滚动 */
                overflow-y: auto;
            }
            
            .result-right {
                flex: 2; /* 变爻更为重要 */
            }
            
            /* 调整字号 */
            .result-left h3, .result-right h3 { font-size: 1.8vh; }
            .result-left p, .result-right p, .yao-text div {
                 font-size: 1.4vh;
                 -webkit-line-clamp: 5;
            }
            .yao-text .yao-title { font-size: 1.4vh; }
            .bian-gua h3 { font-size: 1.8vh; }
            .bian-gua .gua-symbol { font-size: 3vh; }
            .bian-gua .gua-judgment p { font-size: 1.4vh; }

            .btn {
                padding: 0.8vh 1.5vw;
                font-size: 1.8vh;
            }
            .btn-group { gap: 0.8vw; }
            
            .yarrow-sticks {
                height: 1.5vh;
                overflow: hidden;
            }

            .hand-section {
                margin-top: 1vh;
            }
        }
    </style>
</head>
<body>
    <div class="bg-pattern"></div>
    
    <div class="container">
        <header>
            <svg class="taiji" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="#D4A574" stroke-width="2"/>
                <path d="M50 2 A48 48 0 0 1 50 98 A24 24 0 0 1 50 50 A24 24 0 0 0 50 2" fill="#f5f5dc"/>
                <path d="M50 98 A48 48 0 0 1 50 2 A24 24 0 0 1 50 50 A24 24 0 0 0 50 98" fill="#1a1a2e"/>
                <circle cx="50" cy="26" r="6" fill="#1a1a2e"/>
                <circle cx="50" cy="74" r="6" fill="#f5f5dc"/>
            </svg>
            <h1>大衍筮法</h1>
            <p class="subtitle">大衍之数五十，其用四十有九</p>
        </header>

        <div class="step-indicator" id="stepIndicator">
            <div class="step-dot active" data-step="1">问</div>
            <div class="step-dot" data-step="2">一</div>
            <div class="step-dot" data-step="3">二</div>
            <div class="step-dot" data-step="4">三</div>
            <div class="step-dot" data-step="5">四</div>
            <div class="step-dot" data-step="6">五</div>
            <div class="step-dot" data-step="7">六</div>
            <div class="step-dot" data-step="8">卦</div>
        </div>

          <div class="main-content" id="step1">
            <h2 class="section-title">诚心问事</h2>
            <div class="content-scroll">
                <div class="question-section">
                    <div class="instruction">
                        <div>请静心凝神，在心中默想您要占问之事。</div>
                        <div><span class="highlight-text">一卦只问一事，心诚则灵。</span></div>
                    </div>
                    <input type="text" class="question-input" id="questionInput" 
                           placeholder="请输入您要占问的事情（可选）">
                </div>
            </div>
            <div class="btn-container">
                <div class="btn-group">
                    <button class="btn btn-accent" onclick="startDivination()">开始起卦</button>
                </div>
            </div>
        </div>

          <div class="main-content hidden" id="divinationStep">
            <h2 class="section-title">
                第 <span id="currentYao">一</span> 爻 · 第 <span id="currentChange">一</span> 变
            </h2>
            
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill" style="width: 0%"></div>
            </div>

            <div class="content-scroll">
                <p class="instruction" id="stepInstruction">
                    点击"分二"将四十九根蓍草随意分成两堆
                </p>

                <div class="yarrow-display">
                    <div class="yarrow-pile">
                        <div class="pile-label">左堆（天）</div>
                        <div class="pile-count" id="leftCount">0</div>
                        <div class="yarrow-sticks" id="leftSticks"></div>
                    </div>
                    <div class="yarrow-pile">
                        <div class="pile-label">未分</div>
                        <div class="pile-count" id="centerCount">49</div>
                        <div class="yarrow-sticks" id="centerSticks"></div>
                    </div>
                    <div class="yarrow-pile">
                        <div class="pile-label">右堆（地）</div>
                        <div class="pile-count" id="rightCount">0</div>
                        <div class="yarrow-sticks" id="rightSticks"></div>
                    </div>
                </div>

                <div class="hand-section" id="handSection">
                    <div class="hand-label">归奇明细</div>
                    <div class="hand-sticks">
                        <div class="finger-gap">
                            <div>挂一</div>
                            <div class="count" id="guaYiCount">0</div>
                        </div>
                        <div class="finger-gap">
                            <div>左余</div>
                            <div class="count" id="leftRemCount">0</div>
                        </div>
                        <div class="finger-gap">
                            <div>右余</div>
                            <div class="count" id="rightRemCount">0</div>
                        </div>
                        <div class="finger-gap">
                            <div>归奇</div>
                            <div class="count" id="totalRemCount">-</div>
                        </div>
                    </div>
                </div>

                <div class="change-info hidden" id="changeInfo">
                    <div class="change-number">本变归奇：<span id="changeResult">0</span> 根</div>
                    <div class="change-detail" id="changeDetail"></div>
                </div>

                <div class="yao-display" id="yaoDisplay">
                    <div class="yao-row" id="yaoRow6">
                        <span class="yao-label">上爻</span>
                        <div class="yao-line">
                            <div class="yao-segment pending"></div>
                            <div class="yao-segment pending"></div>
                        </div>
                        <span class="yao-value">-</span>
                    </div>
                    <div class="yao-row" id="yaoRow5">
                        <span class="yao-label">五爻</span>
                        <div class="yao-line">
                            <div class="yao-segment pending"></div>
                            <div class="yao-segment pending"></div>
                        </div>
                        <span class="yao-value">-</span>
                    </div>
                    <div class="yao-row" id="yaoRow4">
                        <span class="yao-label">四爻</span>
                        <div class="yao-line">
                            <div class="yao-segment pending"></div>
                            <div class="yao-segment pending"></div>
                        </div>
                        <span class="yao-value">-</span>
                    </div>
                    <div class="yao-row" id="yaoRow3">
                        <span class="yao-label">三爻</span>
                        <div class="yao-line">
                            <div class="yao-segment pending"></div>
                            <div class="yao-segment pending"></div>
                        </div>
                        <span class="yao-value">-</span>
                    </div>
                    <div class="yao-row" id="yaoRow2">
                        <span class="yao-label">二爻</span>
                        <div class="yao-line">
                            <div class="yao-segment pending"></div>
                            <div class="yao-segment pending"></div>
                        </div>
                        <span class="yao-value">-</span>
                    </div>
                    <div class="yao-row" id="yaoRow1">
                        <span class="yao-label">初爻</span>
                        <div class="yao-line">
                            <div class="yao-segment pending"></div>
                            <div class="yao-segment pending"></div>
                        </div>
                        <span class="yao-value">-</span>
                    </div>
                </div>
            </div>

            <div class="btn-container">
                <div class="btn-group" id="actionButtons">
                    <button class="btn btn-primary" id="btnFenEr" onclick="fenEr()">分二（象两仪）</button>
                    <button class="btn btn-primary hidden" id="btnGuaYi" onclick="guaYi()">挂一（象三才）</button>
                    <button class="btn btn-primary hidden" id="btnDieSi" onclick="dieSi()">揲四（象四时）</button>
                    <button class="btn btn-accent hidden" id="btnNextChange" onclick="nextChange()">下一变</button>
                    <button class="btn btn-accent hidden" id="btnNextYao" onclick="nextYao()">确定此爻，继续下一爻</button>
                    <button class="btn btn-accent hidden" id="btnShowResult" onclick="showResult()">查看结果</button>
                </div>
            </div>
        </div>
            
          <div class="main-content hidden" id="resultSection">
            <h2 class="section-title">卦象已成</h2>
            
            <div class="content-scroll">
                <div class="result-section">
                    <div class="result-main">
                        <div class="gua-symbol" id="guaSymbol">☰</div>
                        <div class="gua-name" id="guaName">乾为天</div>
                    </div>
                    <div class="result-left">
                        <div class="column-title">本卦详解</div>
                        <div class="gua-judgment">
                            <h3>【卦辞】</h3>
                            <p id="guaCi"></p>
                        </div>
                        <div class="gua-explanation">
                            <h3>【解释】</h3>
                            <p id="guaExplanation"></p>
                        </div>
                    </div>
                    <div class="result-right">
                        <div class="column-title">变化推演</div>
                        <div id="yaoTextSection"></div>
                        <div class="bian-gua hidden" id="bianGuaSection">
                            <h3>【变卦】<span id="bianGuaName"></span></h3>
                            <div class="gua-symbol" id="bianGuaSymbol" style="font-size: 1.5em;"></div>
                            <div class="gua-judgment" id="bianGuaCi"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="btn-container">
                <div class="btn-group">
                    <button class="btn btn-accent" onclick="restart()">重新起卦</button>
                </div>
            </div>
        </div>

        <footer>
            <p>大衍筮法 · 源自《周易·系辞传》</p>
            <p>「大衍之数五十，其用四十有九。分而为二以象两，挂一以象三，揲之以四以象四时，归奇于扐以象闰。」</p>
        </footer>
    </div>

    <script>
        var hexagramData = {
            "111111": {
                name: "乾为天",
                symbol: "☰",
                judgment: "元亨利贞。",
                explanation: "乾卦象征天，代表刚健、进取、创造。此卦大吉，表示事业亨通，但需坚守正道。君子应效法天道，自强不息，奋发向上。",
                yaoText: [
                    { title: "初九", text: "潜龙勿用。（时机未到，宜韬光养晦，积蓄力量）" },
                    { title: "九二", text: "见龙在田，利见大人。（崭露头角，可寻求贵人相助）" },
                    { title: "九三", text: "君子终日乾乾，夕惕若厉，无咎。（勤勉谨慎，方可无过）" },
                    { title: "九四", text: "或跃在渊，无咎。（进退有据，审时度势）" },
                    { title: "九五", text: "飞龙在天，利见大人。（大展宏图，事业巅峰）" },
                    { title: "上九", text: "亢龙有悔。（盛极必衰，宜知进退）" }
                ]
            },
            "000000": {
                name: "坤为地",
                symbol: "☷",
                judgment: "元亨，利牝马之贞。君子有攸往，先迷后得主，利。西南得朋，东北丧朋。安贞吉。",
                explanation: "坤卦象征地，代表柔顺、包容、承载。此卦宜顺势而为，不宜强出头。以柔克刚，厚德载物，顺从正道则吉。",
                yaoText: [
                    { title: "初六", text: "履霜，坚冰至。（见微知著，防患未然）" },
                    { title: "六二", text: "直方大，不习无不利。（正直方正，自然亨通）" },
                    { title: "六三", text: "含章可贞，或从王事，无成有终。（韬光养晦，辅佐他人）" },
                    { title: "六四", text: "括囊，无咎无誉。（谨言慎行，明哲保身）" },
                    { title: "六五", text: "黄裳，元吉。（居中守正，大吉大利）" },
                    { title: "上六", text: "龙战于野，其血玄黄。（阴阳相争，两败俱伤）" }
                ]
            },
            "100010": {
                name: "水雷屯",
                symbol: "☵☳",
                judgment: "元亨利贞，勿用有攸往，利建侯。",
                explanation: "屯卦象征初生，如草木破土而出，艰难但充满希望。创业维艰，宜稳扎稳打，不可冒进。",
                yaoText: [
                    { title: "初九", text: "磐桓，利居贞，利建侯。" },
                    { title: "六二", text: "屯如邅如，乘马班如。匪寇婚媾，女子贞不字，十年乃字。" },
                    { title: "六三", text: "即鹿无虞，惟入于林中，君子几不如舍，往吝。" },
                    { title: "六四", text: "乘马班如，求婚媾，往吉无不利。" },
                    { title: "九五", text: "屯其膏，小贞吉，大贞凶。" },
                    { title: "上六", text: "乘马班如，泣血涟如。" }
                ]
            },
            "010001": {
                name: "山水蒙",
                symbol: "☶☵",
                judgment: "亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。",
                explanation: "蒙卦象征启蒙教育，如山下有泉，清澈待引。宜虚心求教，不耻下问。",
                yaoText: [
                    { title: "初六", text: "发蒙，利用刑人，用说桎梏，以往吝。" },
                    { title: "九二", text: "包蒙吉，纳妇吉，子克家。" },
                    { title: "六三", text: "勿用取女，见金夫，不有躬，无攸利。" },
                    { title: "六四", text: "困蒙，吝。" },
                    { title: "六五", text: "童蒙，吉。" },
                    { title: "上九", text: "击蒙，不利为寇，利御寇。" }
                ]
            },
            "111010": {
                name: "水天需",
                symbol: "☵☰",
                judgment: "有孚，光亨，贞吉。利涉大川。",
                explanation: "需卦象征等待，云在天上，待时而雨。事情需要耐心等待时机成熟，不可操之过急。",
                yaoText: [
                    { title: "初九", text: "需于郊，利用恒，无咎。" },
                    { title: "九二", text: "需于沙，小有言，终吉。" },
                    { title: "九三", text: "需于泥，致寇至。" },
                    { title: "六四", text: "需于血，出自穴。" },
                    { title: "九五", text: "需于酒食，贞吉。" },
                    { title: "上六", text: "入于穴，有不速之客三人来，敬之终吉。" }
                ]
            },
            "010111": {
                name: "天水讼",
                symbol: "☰☵",
                judgment: "有孚窒惕，中吉，终凶。利见大人，不利涉大川。",
                explanation: "讼卦象征争讼，天水相违，上下不和。争讼之事宜适可而止，不可穷追猛打。",
                yaoText: [
                    { title: "初六", text: "不永所事，小有言，终吉。" },
                    { title: "九二", text: "不克讼，归而逋，其邑人三百户，无眚。" },
                    { title: "六三", text: "食旧德，贞厉，终吉，或从王事，无成。" },
                    { title: "九四", text: "不克讼，复即命，渝安贞，吉。" },
                    { title: "九五", text: "讼，元吉。" },
                    { title: "上九", text: "或锡之鞶带，终朝三褫之。" }
                ]
            },
            "010000": {
                name: "地水师",
                symbol: "☷☵",
                judgment: "贞，丈人吉，无咎。",
                explanation: "师卦象征军队、众人。地中有水，蓄势待发。行动需有正当理由，需德高望重之人领导。",
                yaoText: [
                    { title: "初六", text: "师出以律，否臧凶。" },
                    { title: "九二", text: "在师中吉，无咎，王三锡命。" },
                    { title: "六三", text: "师或舆尸，凶。" },
                    { title: "六四", text: "师左次，无咎。" },
                    { title: "六五", text: "田有禽，利执言，无咎。长子帅师，弟子舆尸，贞凶。" },
                    { title: "上六", text: "大君有命，开国承家，小人勿用。" }
                ]
            },
            "000010": {
                name: "水地比",
                symbol: "☵☷",
                judgment: "吉。原筮元永贞，无咎。不宁方来，后夫凶。",
                explanation: "比卦象征亲近、辅佐。水在地上，相互依存。宜亲近贤人，团结合作。",
                yaoText: [
                    { title: "初六", text: "有孚比之，无咎。有孚盈缶，终来有它，吉。" },
                    { title: "六二", text: "比之自内，贞吉。" },
                    { title: "六三", text: "比之匪人。" },
                    { title: "六四", text: "外比之，贞吉。" },
                    { title: "九五", text: "显比，王用三驱，失前禽。邑人不诫，吉。" },
                    { title: "上六", text: "比之无首，凶。" }
                ]
            },
            "111011": {
                name: "风天小畜",
                symbol: "☴☰",
                judgment: "亨。密云不雨，自我西郊。",
                explanation: "小畜卦象征小有积蓄。风行天上，云气聚集但未成雨。力量尚小，宜继续积累。",
                yaoText: [
                    { title: "初九", text: "复自道，何其咎，吉。" },
                    { title: "九二", text: "牵复，吉。" },
                    { title: "九三", text: "舆说辐，夫妻反目。" },
                    { title: "六四", text: "有孚，血去惕出，无咎。" },
                    { title: "九五", text: "有孚挛如，富以其邻。" },
                    { title: "上九", text: "既雨既处，尚德载，妇贞厉。月几望，君子征凶。" }
                ]
            },
            "110111": {
                name: "天泽履",
                symbol: "☰☱",
                judgment: "履虎尾，不咥人，亨。",
                explanation: "履卦象征践行、礼仪。如踩虎尾而不被咬，需小心谨慎。行事应循规蹈矩。",
                yaoText: [
                    { title: "初九", text: "素履往，无咎。" },
                    { title: "九二", text: "履道坦坦，幽人贞吉。" },
                    { title: "六三", text: "眇能视，跛能履，履虎尾，咥人，凶。武人为于大君。" },
                    { title: "九四", text: "履虎尾，愬愬终吉。" },
                    { title: "九五", text: "夬履，贞厉。" },
                    { title: "上九", text: "视履考祥，其旋元吉。" }
                ]
            },
            "111000": {
                name: "地天泰",
                symbol: "☷☰",
                judgment: "小往大来，吉亨。",
                explanation: "泰卦象征通泰、和谐。天地交感，阴阳和合，万物通泰。大吉之卦，但盛极必衰，宜居安思危。",
                yaoText: [
                    { title: "初九", text: "拔茅茹，以其汇，征吉。" },
                    { title: "九二", text: "包荒，用冯河，不遐遗，朋亡，得尚于中行。" },
                    { title: "九三", text: "无平不陂，无往不复。艰贞无咎。" },
                    { title: "六四", text: "翩翩不富，以其邻，不戒以孚。" },
                    { title: "六五", text: "帝乙归妹，以祉元吉。" },
                    { title: "上六", text: "城复于隍，勿用师。自邑告命，贞吝。" }
                ]
            },
            "000111": {
                name: "天地否",
                symbol: "☰☷",
                judgment: "否之匪人，不利君子贞，大往小来。",
                explanation: "否卦象征闭塞不通。天地不交，阴阳隔绝。时运不济，宜韬光养晦，等待时机转变。",
                yaoText: [
                    { title: "初六", text: "拔茅茹，以其汇，贞吉亨。" },
                    { title: "六二", text: "包承，小人吉，大人否亨。" },
                    { title: "六三", text: "包羞。" },
                    { title: "九四", text: "有命无咎，畴离祉。" },
                    { title: "九五", text: "休否，大人吉。其亡其亡，系于苞桑。" },
                    { title: "上九", text: "倾否，先否后喜。" }
                ]
            },
            "101111": {
                name: "天火同人",
                symbol: "☰☲",
                judgment: "同人于野，亨。利涉大川，利君子贞。",
                explanation: "同人卦象征志同道合。天与火同性上升，象征团结。宜广结善缘，与人合作。",
                yaoText: [
                    { title: "初九", text: "同人于门，无咎。" },
                    { title: "六二", text: "同人于宗，吝。" },
                    { title: "九三", text: "伏戎于莽，升其高陵，三岁不兴。" },
                    { title: "九四", text: "乘其墉，弗克攻，吉。" },
                    { title: "九五", text: "同人，先号啕而后笑，大师克相遇。" },
                    { title: "上九", text: "同人于郊，无悔。" }
                ]
            },
            "111101": {
                name: "火天大有",
                symbol: "☲☰",
                judgment: "元亨。",
                explanation: "大有卦象征丰收、富有。火在天上，光明普照。大吉之卦，事业兴旺，财运亨通。",
                yaoText: [
                    { title: "初九", text: "无交害，匪咎，艰则无咎。" },
                    { title: "九二", text: "大车以载，有攸往，无咎。" },
                    { title: "九三", text: "公用亨于天子，小人弗克。" },
                    { title: "九四", text: "匪其彭，无咎。" },
                    { title: "六五", text: "厥孚交如，威如，吉。" },
                    { title: "上九", text: "自天祐之，吉无不利。" }
                ]
            },
            "001000": {
                name: "地山谦",
                symbol: "☷☶",
                judgment: "亨，君子有终。",
                explanation: "谦卦象征谦虚。山在地下，高而不显。谦虚使人进步，此卦大吉，谦逊者终有善报。",
                yaoText: [
                    { title: "初六", text: "谦谦君子，用涉大川，吉。" },
                    { title: "六二", text: "鸣谦，贞吉。" },
                    { title: "九三", text: "劳谦，君子有终，吉。" },
                    { title: "六四", text: "无不利，撝谦。" },
                    { title: "六五", text: "不富以其邻，利用侵伐，无不利。" },
                    { title: "上六", text: "鸣谦，利用行师，征邑国。" }
                ]
            },
            "000100": {
                name: "雷地豫",
                symbol: "☳☷",
                judgment: "利建侯行师。",
                explanation: "豫卦象征欢乐、安逸。雷出地上，万物欣豫。宜把握时机，有所作为。",
                yaoText: [
                    { title: "初六", text: "鸣豫，凶。" },
                    { title: "六二", text: "介于石，不终日，贞吉。" },
                    { title: "六三", text: "盱豫，悔。迟有悔。" },
                    { title: "九四", text: "由豫，大有得。勿疑。朋盍簪。" },
                    { title: "六五", text: "贞疾，恒不死。" },
                    { title: "上六", text: "冥豫，成有渝，无咎。" }
                ]
            },
            "100110": {
                name: "泽雷随",
                symbol: "☱☳",
                judgment: "元亨利贞，无咎。",
                explanation: "随卦象征跟随、顺从。泽中有雷，随时而动。宜顺应时势，择善而从。",
                yaoText: [
                    { title: "初九", text: "官有渝，贞吉。出门交有功。" },
                    { title: "六二", text: "系小子，失丈夫。" },
                    { title: "六三", text: "系丈夫，失小子。随有求得，利居贞。" },
                    { title: "九四", text: "随有获，贞凶。有孚在道，以明，何咎。" },
                    { title: "九五", text: "孚于嘉，吉。" },
                    { title: "上六", text: "拘系之，乃从维之。王用亨于西山。" }
                ]
            },
            "011001": {
                name: "山风蛊",
                symbol: "☶☴",
                judgment: "元亨，利涉大川。先甲三日，后甲三日。",
                explanation: "蛊卦象征整治弊病。山下有风，万物败坏。事情已经败坏，需要整顿革新。",
                yaoText: [
                    { title: "初六", text: "干父之蛊，有子，考无咎，厉终吉。" },
                    { title: "九二", text: "干母之蛊，不可贞。" },
                    { title: "九三", text: "干父之蛊，小有悔，无大咎。" },
                    { title: "六四", text: "裕父之蛊，往见吝。" },
                    { title: "六五", text: "干父之蛊，用誉。" },
                    { title: "上九", text: "不事王侯，高尚其事。" }
                ]
            },
            "110000": {
                name: "地泽临",
                symbol: "☷☱",
                judgment: "元亨利贞。至于八月有凶。",
                explanation: "临卦象征亲临、监督。地上有泽，居高临下。宜亲力亲为，关怀下属。",
                yaoText: [
                    { title: "初九", text: "咸临，贞吉。" },
                    { title: "九二", text: "咸临，吉无不利。" },
                    { title: "六三", text: "甘临，无攸利。既忧之，无咎。" },
                    { title: "六四", text: "至临，无咎。" },
                    { title: "六五", text: "知临，大君之宜，吉。" },
                    { title: "上六", text: "敦临，吉，无咎。" }
                ]
            },
            "000011": {
                name: "风地观",
                symbol: "☴☷",
                judgment: "盥而不荐，有孚颙若。",
                explanation: "观卦象征观察、示范。风行地上，遍观万物。宜观察形势，以身作则。",
                yaoText: [
                    { title: "初六", text: "童观，小人无咎，君子吝。" },
                    { title: "六二", text: "窥观，利女贞。" },
                    { title: "六三", text: "观我生，进退。" },
                    { title: "六四", text: "观国之光，利用宾于王。" },
                    { title: "九五", text: "观我生，君子无咎。" },
                    { title: "上九", text: "观其生，君子无咎。" }
                ]
            },
            "100101": {
                name: "火雷噬嗑",
                symbol: "☲☳",
                judgment: "亨。利用狱。",
                explanation: "噬嗑卦象征咬合、刑罚。口中有物，必须咬碎。宜果断处理障碍，明辨是非。",
                yaoText: [
                    { title: "初九", text: "屦校灭趾，无咎。" },
                    { title: "六二", text: "噬肤灭鼻，无咎。" },
                    { title: "六三", text: "噬腊肉，遇毒；小吝，无咎。" },
                    { title: "九四", text: "噬干胏，得金矢，利艰贞，吉。" },
                    { title: "六五", text: "噬干肉，得黄金，贞厉，无咎。" },
                    { title: "上九", text: "何校灭耳，凶。" }
                ]
            },
            "101001": {
                name: "山火贲",
                symbol: "☶☲",
                judgment: "亨。小利有攸往。",
                explanation: "贲卦象征文饰、装饰。山下有火，光彩照人。宜注重外表修饰，但不可华而不实。",
                yaoText: [
                    { title: "初九", text: "贲其趾，舍车而徒。" },
                    { title: "六二", text: "贲其须。" },
                    { title: "九三", text: "贲如濡如，永贞吉。" },
                    { title: "六四", text: "贲如皤如，白马翰如。匪寇婚媾。" },
                    { title: "六五", text: "贲于丘园，束帛戋戋，吝，终吉。" },
                    { title: "上九", text: "白贲，无咎。" }
                ]
            },
            "000001": {
                name: "山地剥",
                symbol: "☶☷",
                judgment: "不利有攸往。",
                explanation: "剥卦象征剥落、衰败。山附于地，根基动摇。时运衰退，宜静守待时。",
                yaoText: [
                    { title: "初六", text: "剥床以足，蔑贞凶。" },
                    { title: "六二", text: "剥床以辨，蔑贞凶。" },
                    { title: "六三", text: "剥之，无咎。" },
                    { title: "六四", text: "剥床以肤，凶。" },
                    { title: "六五", text: "贯鱼，以宫人宠，无不利。" },
                    { title: "上九", text: "硕果不食，君子得舆，小人剥庐。" }
                ]
            },
            "100000": {
                name: "地雷复",
                symbol: "☷☳",
                judgment: "亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。",
                explanation: "复卦象征回复、复兴。雷在地下，阳气初生。否极泰来，一阳来复。",
                yaoText: [
                    { title: "初九", text: "不远复，无祗悔，元吉。" },
                    { title: "六二", text: "休复，吉。" },
                    { title: "六三", text: "频复，厉无咎。" },
                    { title: "六四", text: "中行独复。" },
                    { title: "六五", text: "敦复，无悔。" },
                    { title: "上六", text: "迷复，凶，有灾眚。" }
                ]
            },
            "100111": {
                name: "天雷无妄",
                symbol: "☰☳",
                judgment: "元亨利贞。其匪正有眚，不利有攸往。",
                explanation: "无妄卦象征真实无妄。天下雷行，万物自然。宜顺其自然，不可妄为。",
                yaoText: [
                    { title: "初九", text: "无妄，往吉。" },
                    { title: "六二", text: "不耕获，不菑畲，则利有攸往。" },
                    { title: "六三", text: "无妄之灾，或系之牛，行人之得，邑人之灾。" },
                    { title: "九四", text: "可贞，无咎。" },
                    { title: "九五", text: "无妄之疾，勿药有喜。" },
                    { title: "上九", text: "无妄，行有眚，无攸利。" }
                ]
            },
            "111001": {
                name: "山天大畜",
                symbol: "☶☰",
                judgment: "利贞，不家食吉，利涉大川。",
                explanation: "大畜卦象征大的积蓄。天在山中，蓄养贤才。宜积蓄力量，培养人才。",
                yaoText: [
                    { title: "初九", text: "有厉利已。" },
                    { title: "九二", text: "舆说辐。" },
                    { title: "九三", text: "良马逐，利艰贞。曰闲舆卫，利有攸往。" },
                    { title: "六四", text: "童牛之牿，元吉。" },
                    { title: "六五", text: "豮豕之牙，吉。" },
                    { title: "上九", text: "何天之衢，亨。" }
                ]
            },
            "100001": {
                name: "山雷颐",
                symbol: "☶☳",
                judgment: "贞吉。观颐，自求口实。",
                explanation: "颐卦象征颐养、饮食。山下有雷，口中咀嚼。宜注重养生，谨慎言语。",
                yaoText: [
                    { title: "初九", text: "舍尔灵龟，观我朵颐，凶。" },
                    { title: "六二", text: "颠颐，拂经，于丘颐，征凶。" },
                    { title: "六三", text: "拂颐，贞凶，十年勿用。无攸利。" },
                    { title: "六四", text: "颠颐吉，虎视眈眈，其欲逐逐，无咎。" },
                    { title: "六五", text: "拂经，居贞吉，不可涉大川。" },
                    { title: "上九", text: "由颐，厉吉，利涉大川。" }
                ]
            },
            "011110": {
                name: "泽风大过",
                symbol: "☱☴",
                judgment: "栋桡，利有攸往，亨。",
                explanation: "大过卦象征大的过度。泽灭木，栋梁弯曲。事情过度，宜当机立断。",
                yaoText: [
                    { title: "初六", text: "藉用白茅，无咎。" },
                    { title: "九二", text: "枯杨生稊，老夫得其女妻，无不利。" },
                    { title: "九三", text: "栋桡，凶。" },
                    { title: "九四", text: "栋隆，吉；有它吝。" },
                    { title: "九五", text: "枯杨生华，老妇得士夫，无咎无誉。" },
                    { title: "上六", text: "过涉灭顶，凶，无咎。" }
                ]
            },
            "010010": {
                name: "坎为水",
                symbol: "☵",
                judgment: "习坎，有孚，维心亨，行有尚。",
                explanation: "坎卦象征险陷、水。水流不息，重重险阻。处境艰难，但坚持不懈，终能度过。",
                yaoText: [
                    { title: "初六", text: "习坎，入于坎窞，凶。" },
                    { title: "九二", text: "坎有险，求小得。" },
                    { title: "六三", text: "来之坎坎，险且枕，入于坎窞，勿用。" },
                    { title: "六四", text: "樽酒簋贰，用缶，纳约自牖，终无咎。" },
                    { title: "九五", text: "坎不盈，祗既平，无咎。" },
                    { title: "上六", text: "系用徽纆，寘于丛棘，三岁不得，凶。" }
                ]
            },
            "101101": {
                name: "离为火",
                symbol: "☲",
                judgment: "利贞，亨。畜牝牛，吉。",
                explanation: "离卦象征附丽、光明。火焰明亮，依附燃料。宜依附正道，发挥光明。",
                yaoText: [
                    { title: "初九", text: "履错然，敬之无咎。" },
                    { title: "六二", text: "黄离，元吉。" },
                    { title: "九三", text: "日昃之离，不鼓缶而歌，则大耋之嗟，凶。" },
                    { title: "九四", text: "突如其来如，焚如，死如，弃如。" },
                    { title: "六五", text: "出涕沱若，戚嗟若，吉。" },
                    { title: "上九", text: "王用出征，有嘉折首，获匪其丑，无咎。" }
                ]
            },
            "001110": {
                name: "泽山咸",
                symbol: "☱☶",
                judgment: "亨，利贞，取女吉。",
                explanation: "咸卦象征感应、交感。山上有泽，阴阳交感。宜以诚感人，婚姻感情大吉。",
                yaoText: [
                    { title: "初六", text: "咸其拇。" },
                    { title: "六二", text: "咸其腓，凶，居吉。" },
                    { title: "九三", text: "咸其股，执其随，往吝。" },
                    { title: "九四", text: "贞吉悔亡，憧憧往来，朋从尔思。" },
                    { title: "九五", text: "咸其脢，无悔。" },
                    { title: "上六", text: "咸其辅颊舌。" }
                ]
            },
            "011100": {
                name: "雷风恒",
                symbol: "☳☴",
                judgment: "亨，无咎，利贞，利有攸往。",
                explanation: "恒卦象征恒久、持久。雷风相与，长久不息。宜持之以恒，坚守正道。",
                yaoText: [
                    { title: "初六", text: "浚恒，贞凶，无攸利。" },
                    { title: "九二", text: "悔亡。" },
                    { title: "九三", text: "不恒其德，或承之羞，贞吝。" },
                    { title: "九四", text: "田无禽。" },
                    { title: "六五", text: "恒其德，贞，妇人吉，夫子凶。" },
                    { title: "上六", text: "振恒，凶。" }
                ]
            },
            "001111": {
                name: "天山遁",
                symbol: "☰☶",
                judgment: "亨，小利贞。",
                explanation: "遁卦象征退避、隐遁。天下有山，君子远小人。时机不利，宜暂时退避。",
                yaoText: [
                    { title: "初六", text: "遁尾，厉，勿用有攸往。" },
                    { title: "六二", text: "执之用黄牛之革，莫之胜说。" },
                    { title: "九三", text: "系遁，有疾厉，畜臣妾吉。" },
                    { title: "九四", text: "好遁，君子吉，小人否。" },
                    { title: "九五", text: "嘉遁，贞吉。" },
                    { title: "上九", text: "肥遁，无不利。" }
                ]
            },
            "111100": {
                name: "雷天大壮",
                symbol: "☳☰",
                judgment: "利贞。",
                explanation: "大壮卦象征强盛、壮大。雷在天上，声威远震。力量强盛，但需守正道。",
                yaoText: [
                    { title: "初九", text: "壮于趾，征凶，有孚。" },
                    { title: "九二", text: "贞吉。" },
                    { title: "九三", text: "小人用壮，君子用罔，贞厉。羝羊触藩，羸其角。" },
                    { title: "九四", text: "贞吉悔亡，藩决不羸，壮于大舆之輹。" },
                    { title: "六五", text: "丧羊于易，无悔。" },
                    { title: "上六", text: "羝羊触藩，不能退，不能遂，无攸利，艰则吉。" }
                ]
            },
            "000101": {
                name: "火地晋",
                symbol: "☲☷",
                judgment: "康侯用锡马蕃庶，昼日三接。",
                explanation: "晋卦象征晋升、进步。火出地上，光明上进。事业上升，宜积极进取。",
                yaoText: [
                    { title: "初六", text: "晋如，摧如，贞吉。罔孚，裕无咎。" },
                    { title: "六二", text: "晋如，愁如，贞吉。受兹介福，于其王母。" },
                    { title: "六三", text: "众允，悔亡。" },
                    { title: "九四", text: "晋如鼫鼠，贞厉。" },
                    { title: "六五", text: "悔亡，失得勿恤，往吉无不利。" },
                    { title: "上九", text: "晋其角，维用伐邑，厉吉无咎，贞吝。" }
                ]
            },
            "101000": {
                name: "地火明夷",
                symbol: "☷☲",
                judgment: "利艰贞。",
                explanation: "明夷卦象征光明受损。火入地中，光明隐没。处境艰难，宜韬光养晦。",
                yaoText: [
                    { title: "初九", text: "明夷于飞，垂其翼。君子于行，三日不食。" },
                    { title: "六二", text: "明夷，夷于左股，用拯马壮，吉。" },
                    { title: "九三", text: "明夷于南狩，得其大首，不可疾贞。" },
                    { title: "六四", text: "入于左腹，获明夷之心，出于门庭。" },
                    { title: "六五", text: "箕子之明夷，利贞。" },
                    { title: "上六", text: "不明晦，初登于天，后入于地。" }
                ]
            },
            "101011": {
                name: "风火家人",
                symbol: "☴☲",
                judgment: "利女贞。",
                explanation: "家人卦象征家庭。风自火出，由内及外。宜齐家治国，先正己身，家和万事兴。",
                yaoText: [
                    { title: "初九", text: "闲有家，悔亡。" },
                    { title: "六二", text: "无攸遂，在中馈，贞吉。" },
                    { title: "九三", text: "家人嗃嗃，悔厉吉；妇子嘻嘻，终吝。" },
                    { title: "六四", text: "富家，大吉。" },
                    { title: "九五", text: "王假有家，勿恤吉。" },
                    { title: "上九", text: "有孚威如，终吉。" }
                ]
            },
            "110101": {
                name: "火泽睽",
                symbol: "☲☱",
                judgment: "小事吉。",
                explanation: "睽卦象征乖离、背离。火炎上，泽润下，方向相反。意见分歧，宜求同存异。",
                yaoText: [
                    { title: "初九", text: "悔亡，丧马勿逐，自复；见恶人无咎。" },
                    { title: "九二", text: "遇主于巷，无咎。" },
                    { title: "六三", text: "见舆曳，其牛掣，其人天且劓，无初有终。" },
                    { title: "九四", text: "睽孤，遇元夫，交孚，厉无咎。" },
                    { title: "六五", text: "悔亡，厥宗噬肤，往何咎。" },
                    { title: "上九", text: "睽孤，见豕负涂，载鬼一车，先张之弧，后说之弧，匪寇婚媾，往遇雨则吉。" }
                ]
            },
            "001010": {
                name: "水山蹇",
                symbol: "☵☶",
                judgment: "利西南，不利东北；利见大人，贞吉。",
                explanation: "蹇卦象征艰难、跛行。山上有水，行走艰难。前路坎坷，宜反省自身，寻求帮助。",
                yaoText: [
                    { title: "初六", text: "往蹇，来誉。" },
                    { title: "六二", text: "王臣蹇蹇，匪躬之故。" },
                    { title: "九三", text: "往蹇来反。" },
                    { title: "六四", text: "往蹇来连。" },
                    { title: "九五", text: "大蹇朋来。" },
                    { title: "上六", text: "往蹇来硕，吉；利见大人。" }
                ]
            },
            "010100": {
                name: "雷水解",
                symbol: "☳☵",
                judgment: "利西南，无所往，其来复吉。有攸往，夙吉。",
                explanation: "解卦象征解除、缓解。雷雨交作，万物舒解。困难即将解除，宜把握时机。",
                yaoText: [
                    { title: "初六", text: "无咎。" },
                    { title: "九二", text: "田获三狐，得黄矢，贞吉。" },
                    { title: "六三", text: "负且乘，致寇至，贞吝。" },
                    { title: "九四", text: "解而拇，朋至斯孚。" },
                    { title: "六五", text: "君子维有解，吉；有孚于小人。" },
                    { title: "上六", text: "公用射隼于高墉之上，获之，无不利。" }
                ]
            },
            "110001": {
                name: "山泽损",
                symbol: "☶☱",
                judgment: "有孚，元吉，无咎，可贞，利有攸往。",
                explanation: "损卦象征减损、损失。山下有泽，损下益上。宜减损私欲，克己奉公。",
                yaoText: [
                    { title: "初九", text: "已事遄往，无咎，酌损之。" },
                    { title: "九二", text: "利贞，征凶，弗损益之。" },
                    { title: "六三", text: "三人行，则损一人；一人行，则得其友。" },
                    { title: "六四", text: "损其疾，使遄有喜，无咎。" },
                    { title: "六五", text: "或益之十朋之龟弗克违，元吉。" },
                    { title: "上九", text: "弗损益之，无咎，贞吉，利有攸往，得臣无家。" }
                ]
            },
            "100011": {
                name: "风雷益",
                symbol: "☴☳",
                judgment: "利有攸往，利涉大川。",
                explanation: "益卦象征增益、利益。风雷相助，万物受益。宜积极进取，利人利己。",
                yaoText: [
                    { title: "初九", text: "利用为大作，元吉，无咎。" },
                    { title: "六二", text: "或益之十朋之龟弗克违，永贞吉。王用享于帝，吉。" },
                    { title: "六三", text: "益之用凶事，无咎。有孚中行，告公用圭。" },
                    { title: "六四", text: "中行，告公从。利用为依迁国。" },
                    { title: "九五", text: "有孚惠心，勿问元吉。有孚惠我德。" },
                    { title: "上九", text: "莫益之，或击之，立心勿恒，凶。" }
                ]
            },
            "111110": {
                name: "泽天夬",
                symbol: "☱☰",
                judgment: "扬于王庭，孚号，有厉，告自邑，不利即戎，利有攸往。",
                explanation: "夬卦象征决断、决裂。泽上于天，水将溃决。宜当机立断，除恶务尽。",
                yaoText: [
                    { title: "初九", text: "壮于前趾，往不胜为咎。" },
                    { title: "九二", text: "惕号，莫夜有戎，勿恤。" },
                    { title: "九三", text: "壮于頄，有凶。君子夬夬，独行遇雨，若濡有愠，无咎。" },
                    { title: "九四", text: "臀无肤，其行次且。牵羊悔亡，闻言不信。" },
                    { title: "九五", text: "苋陆夬夬，中行无咎。" },
                    { title: "上六", text: "无号，终有凶。" }
                ]
            },
            "011111": {
                name: "天风姤",
                symbol: "☰☴",
                judgment: "女壮，勿用取女。",
                explanation: "姤卦象征相遇、邂逅。天下有风，无处不遇。意外相遇，宜谨慎对待。",
                yaoText: [
                    { title: "初六", text: "系于金柅，贞吉，有攸往，见凶。" },
                    { title: "九二", text: "包有鱼，无咎，不利宾。" },
                    { title: "九三", text: "臀无肤，其行次且，厉，无大咎。" },
                    { title: "九四", text: "包无鱼，起凶。" },
                    { title: "九五", text: "以杞包瓜，含章，有陨自天。" },
                    { title: "上九", text: "姤其角，吝，无咎。" }
                ]
            },
            "000110": {
                name: "泽地萃",
                symbol: "☱☷",
                judgment: "亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。",
                explanation: "萃卦象征聚集、荟萃。泽上于地，水聚成泽。宜聚集人才，团结力量。",
                yaoText: [
                    { title: "初六", text: "有孚不终，乃乱乃萃，若号一握为笑，勿恤，往无咎。" },
                    { title: "六二", text: "引吉，无咎，孚乃利用禴。" },
                    { title: "六三", text: "萃如，嗟如，无攸利，往无咎，小吝。" },
                    { title: "九四", text: "大吉，无咎。" },
                    { title: "九五", text: "萃有位，无咎。匪孚，元永贞，悔亡。" },
                    { title: "上六", text: "赍咨涕洟，无咎。" }
                ]
            },
            "011000": {
                name: "地风升",
                symbol: "☷☴",
                judgment: "元亨，用见大人，勿恤，南征吉。",
                explanation: "升卦象征上升、晋升。地中生木，向上生长。事业上升，宜积极进取。",
                yaoText: [
                    { title: "初六", text: "允升，大吉。" },
                    { title: "九二", text: "孚乃利用禴，无咎。" },
                    { title: "九三", text: "升虚邑。" },
                    { title: "六四", text: "王用亨于岐山，吉，无咎。" },
                    { title: "六五", text: "贞吉，升阶。" },
                    { title: "上六", text: "冥升，利于不息之贞。" }
                ]
            },
            "010110": {
                name: "泽水困",
                symbol: "☱☵",
                judgment: "亨，贞，大人吉，无咎，有言不信。",
                explanation: "困卦象征困顿、穷困。泽无水，困顿之象。处境艰难，宜坚守正道。",
                yaoText: [
                    { title: "初六", text: "臀困于株木，入于幽谷，三岁不觌。" },
                    { title: "九二", text: "困于酒食，朱绂方来，利用享祀，征凶，无咎。" },
                    { title: "六三", text: "困于石，据于蒺藜，入于其宫，不见其妻，凶。" },
                    { title: "九四", text: "来徐徐，困于金车，吝，有终。" },
                    { title: "九五", text: "劓刖，困于赤绂，乃徐有说，利用祭祀。" },
                    { title: "上六", text: "困于葛藟，于臲卼，曰动悔。有悔，征吉。" }
                ]
            },
            "011010": {
                name: "水风井",
                symbol: "☵☴",
                judgment: "改邑不改井，无丧无得，往来井井。汔至，亦未繘井，羸其瓶，凶。",
                explanation: "井卦象征水井、养人。木入水中，汲水而上。宜修身养德，泽被众人。",
                yaoText: [
                    { title: "初六", text: "井泥不食，旧井无禽。" },
                    { title: "九二", text: "井谷射鲋，瓮敝漏。" },
                    { title: "九三", text: "井渫不食，为我心恻，可用汲，王明，并受其福。" },
                    { title: "六四", text: "井甃，无咎。" },
                    { title: "九五", text: "井冽，寒泉食。" },
                    { title: "上六", text: "井收勿幕，有孚元吉。" }
                ]
            },
            "101110": {
                name: "泽火革",
                symbol: "☱☲",
                judgment: "己日乃孚，元亨利贞，悔亡。",
                explanation: "革卦象征变革、革命。泽中有火，水火相息。宜顺应时势，推行变革。",
                yaoText: [
                    { title: "初九", text: "巩用黄牛之革。" },
                    { title: "六二", text: "己日乃革之，征吉，无咎。" },
                    { title: "九三", text: "征凶，贞厉，革言三就，有孚。" },
                    { title: "九四", text: "悔亡，有孚改命，吉。" },
                    { title: "九五", text: "大人虎变，未占有孚。" },
                    { title: "上六", text: "君子豹变，小人革面，征凶，居贞吉。" }
                ]
            },
            "011101": {
                name: "火风鼎",
                symbol: "☲☴",
                judgment: "元吉，亨。",
                explanation: "鼎卦象征鼎器、革新。木上有火，烹饪之象。宜革故鼎新，培养人才。",
                yaoText: [
                    { title: "初六", text: "鼎颠趾，利出否，得妾以其子，无咎。" },
                    { title: "九二", text: "鼎有实，我仇有疾，不我能即，吉。" },
                    { title: "九三", text: "鼎耳革，其行塞，雉膏不食，方雨亏悔，终吉。" },
                    { title: "九四", text: "鼎折足，覆公餗，其形渥，凶。" },
                    { title: "六五", text: "鼎黄耳金铉，利贞。" },
                    { title: "上九", text: "鼎玉铉，大吉，无不利。" }
                ]
            },
            "100100": {
                name: "震为雷",
                symbol: "☳",
                judgment: "亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。",
                explanation: "震卦象征雷、震动。雷声震动，万物惊醒。宜警醒自省，居安思危。",
                yaoText: [
                    { title: "初九", text: "震来虩虩，后笑言哑哑，吉。" },
                    { title: "六二", text: "震来厉，亿丧贝，跻于九陵，勿逐，七日得。" },
                    { title: "六三", text: "震苏苏，震行无眚。" },
                    { title: "九四", text: "震遂泥。" },
                    { title: "六五", text: "震往来厉，亿无丧，有事。" },
                    { title: "上六", text: "震索索，视矍矍，征凶。震不于其躬，于其邻，无咎。" }
                ]
            },
            "001001": {
                name: "艮为山",
                symbol: "☶",
                judgment: "艮其背，不获其身，行其庭，不见其人，无咎。",
                explanation: "艮卦象征山、止。两山重叠，止而又止。宜适可而止，知止不殆。",
                yaoText: [
                    { title: "初六", text: "艮其趾，无咎，利永贞。" },
                    { title: "六二", text: "艮其腓，不拯其随，其心不快。" },
                    { title: "九三", text: "艮其限，列其夤，厉薰心。" },
                    { title: "六四", text: "艮其身，无咎。" },
                    { title: "六五", text: "艮其辅，言有序，悔亡。" },
                    { title: "上九", text: "敦艮，吉。" }
                ]
            },
            "001011": {
                name: "风山渐",
                symbol: "☴☶",
                judgment: "女归吉，利贞。",
                explanation: "渐卦象征渐进、循序。山上有木，渐渐生长。宜循序渐进，不可急躁。",
                yaoText: [
                    { title: "初六", text: "鸿渐于干，小子厉，有言，无咎。" },
                    { title: "六二", text: "鸿渐于磐，饮食衎衎，吉。" },
                    { title: "九三", text: "鸿渐于陆，夫征不复，妇孕不育，凶；利御寇。" },
                    { title: "六四", text: "鸿渐于木，或得其桷，无咎。" },
                    { title: "九五", text: "鸿渐于陵，妇三岁不孕，终莫之胜，吉。" },
                    { title: "上九", text: "鸿渐于陆，其羽可用为仪，吉。" }
                ]
            },
            "110100": {
                name: "雷泽归妹",
                symbol: "☳☱",
                judgment: "征凶，无攸利。",
                explanation: "归妹卦象征少女出嫁。泽上有雷，少女从兄。婚姻之事需谨慎，不可轻率。",
                yaoText: [
                    { title: "初九", text: "归妹以娣，跛能履，征吉。" },
                    { title: "九二", text: "眇能视，利幽人之贞。" },
                    { title: "六三", text: "归妹以须，反归以娣。" },
                    { title: "九四", text: "归妹愆期，迟归有时。" },
                    { title: "六五", text: "帝乙归妹，其君之袂，不如其娣之袂良，月几望，吉。" },
                    { title: "上六", text: "女承筐无实，士刲羊无血，无攸利。" }
                ]
            },
            "101100": {
                name: "雷火丰",
                symbol: "☳☲",
                judgment: "亨，王假之，勿忧，宜日中。",
                explanation: "丰卦象征丰盛、盛大。雷电皆至，光明盛大。事业鼎盛，但盛极必衰。",
                yaoText: [
                    { title: "初九", text: "遇其配主，虽旬无咎，往有尚。" },
                    { title: "六二", text: "丰其蔀，日中见斗，往得疑疾，有孚发若，吉。" },
                    { title: "九三", text: "丰其沛，日中见沬，折其右肱，无咎。" },
                    { title: "九四", text: "丰其蔀，日中见斗，遇其夷主，吉。" },
                    { title: "六五", text: "来章，有庆誉，吉。" },
                    { title: "上六", text: "丰其屋，蔀其家，窥其户，阒其无人，三岁不觌，凶。" }
                ]
            },
            "001101": {
                name: "火山旅",
                symbol: "☲☶",
                judgment: "小亨，旅贞吉。",
                explanation: "旅卦象征旅行、羁旅。山上有火，行旅之象。宜谨慎行事，不可久留。",
                yaoText: [
                    { title: "初六", text: "旅琐琐，斯其所取灾。" },
                    { title: "六二", text: "旅即次，怀其资，得童仆贞。" },
                    { title: "九三", text: "旅焚其次，丧其童仆，贞厉。" },
                    { title: "九四", text: "旅于处，得其资斧，我心不快。" },
                    { title: "六五", text: "射雉一矢亡，终以誉命。" },
                    { title: "上九", text: "鸟焚其巢，旅人先笑后号啕。丧牛于易，凶。" }
                ]
            },
            "011011": {
                name: "巽为风",
                symbol: "☴",
                judgment: "小亨，利攸往，利见大人。",
                explanation: "巽卦象征风、顺从。风行草偃，无孔不入。宜顺势而为，柔顺谦逊。",
                yaoText: [
                    { title: "初六", text: "进退，利武人之贞。" },
                    { title: "九二", text: "巽在床下，用史巫纷若，吉无咎。" },
                    { title: "九三", text: "频巽，吝。" },
                    { title: "六四", text: "悔亡，田获三品。" },
                    { title: "九五", text: "贞吉悔亡，无不利。无初有终，先庚三日，后庚三日，吉。" },
                    { title: "上九", text: "巽在床下，丧其资斧，贞凶。" }
                ]
            },
            "110110": {
                name: "兑为泽",
                symbol: "☱",
                judgment: "亨，利贞。",
                explanation: "兑卦象征泽、喜悦。两泽相连，互相滋润。宜和悦待人，广结善缘。",
                yaoText: [
                    { title: "初九", text: "和兑，吉。" },
                    { title: "九二", text: "孚兑，吉，悔亡。" },
                    { title: "六三", text: "来兑，凶。" },
                    { title: "九四", text: "商兑未宁，介疾有喜。" },
                    { title: "九五", text: "孚于剥，有厉。" },
                    { title: "上六", text: "引兑。" }
                ]
            },
            "010011": {
                name: "风水涣",
                symbol: "☴☵",
                judgment: "亨，王假有庙，利涉大川，利贞。",
                explanation: "涣卦象征涣散、离散。风行水上，涣散之象。宜凝聚人心，化解分歧。",
                yaoText: [
                    { title: "初六", text: "用拯马壮，吉。" },
                    { title: "九二", text: "涣奔其机，悔亡。" },
                    { title: "六三", text: "涣其躬，无悔。" },
                    { title: "六四", text: "涣其群，元吉。涣有丘，匪夷所思。" },
                    { title: "九五", text: "涣汗其大号，涣王居，无咎。" },
                    { title: "上九", text: "涣其血，去逖出，无咎。" }
                ]
            },
            "110010": {
                name: "水泽节",
                symbol: "☵☱",
                judgment: "亨，苦节不可贞。",
                explanation: "节卦象征节制、节约。泽上有水，节制之象。宜适度节制，不可过度。",
                yaoText: [
                    { title: "初九", text: "不出户庭，无咎。" },
                    { title: "九二", text: "不出门庭，凶。" },
                    { title: "六三", text: "不节若，则嗟若，无咎。" },
                    { title: "六四", text: "安节，亨。" },
                    { title: "九五", text: "甘节，吉；往有尚。" },
                    { title: "上六", text: "苦节，贞凶，悔亡。" }
                ]
            },
            "110011": {
                name: "风泽中孚",
                symbol: "☴☱",
                judgment: "豚鱼吉，利涉大川，利贞。",
                explanation: "中孚卦象征诚信、信任。风行泽上，诚信感人。宜以诚待人，言而有信。",
                yaoText: [
                    { title: "初九", text: "虞吉，有它不燕。" },
                    { title: "九二", text: "鸣鹤在阴，其子和之，我有好爵，吾与尔靡之。" },
                    { title: "六三", text: "得敌，或鼓或罢，或泣或歌。" },
                    { title: "六四", text: "月几望，马匹亡，无咎。" },
                    { title: "九五", text: "有孚挛如，无咎。" },
                    { title: "上九", text: "翰音登于天，贞凶。" }
                ]
            },
            "001100": {
                name: "雷山小过",
                symbol: "☳☶",
                judgment: "亨，利贞，可小事，不可大事。飞鸟遗之音，不宜上宜下，大吉。",
                explanation: "小过卦象征小有过越。山上有雷，小过之象。宜谨小慎微，小事可为，大事不宜。",
                yaoText: [
                    { title: "初六", text: "飞鸟以凶。" },
                    { title: "六二", text: "过其祖，遇其妣；不及其君，遇其臣；无咎。" },
                    { title: "九三", text: "弗过防之，从或戕之，凶。" },
                    { title: "九四", text: "无咎，弗过遇之。往厉必戒，勿用永贞。" },
                    { title: "六五", text: "密云不雨，自我西郊，公弋取彼在穴。" },
                    { title: "上六", text: "弗遇过之，飞鸟离之，凶，是谓灾眚。" }
                ]
            },
            "101010": {
                name: "水火既济",
                symbol: "☵☲",
                judgment: "亨，小利贞，初吉终乱。",
                explanation: "既济卦象征已经完成。水在火上，烹饪已成。事情已成，但需防微杜渐。",
                yaoText: [
                    { title: "初九", text: "曳其轮，濡其尾，无咎。" },
                    { title: "六二", text: "妇丧其茀，勿逐，七日得。" },
                    { title: "九三", text: "高宗伐鬼方，三年克之，小人勿用。" },
                    { title: "六四", text: "繻有衣袽，终日戒。" },
                    { title: "九五", text: "东邻杀牛，不如西邻之禴祭，实受其福。" },
                    { title: "上六", text: "濡其首，厉。" }
                ]
            },
            "010101": {
                name: "火水未济",
                symbol: "☲☵",
                judgment: "亨，小狐汔济，濡其尾，无攸利。",
                explanation: "未济卦象征尚未完成。火在水上，未能相交。事情尚未成功，宜继续努力。",
                yaoText: [
                    { title: "初六", text: "濡其尾，吝。" },
                    { title: "九二", text: "曳其轮，贞吉。" },
                    { title: "六三", text: "未济，征凶，利涉大川。" },
                    { title: "九四", text: "贞吉，悔亡，震用伐鬼方，三年有赏于大国。" },
                    { title: "六五", text: "贞吉，无悔，君子之光，有孚，吉。" },
                    { title: "上九", text: "有孚于饮酒，无咎，濡其首，有孚失是。" }
                ]
            }
        };

        var yaoNumNames = ["一", "二", "三", "四", "五", "六"];
        var changeNames = ["一", "二", "三"];

        var currentYao = 1;
        var currentChange = 1;
        var totalSticks = 49;
        var leftPile = 0;
        var rightPile = 0;
        var guaYiVal = 0;
        var leftRemainder = 0;
        var rightRemainder = 0;
        var changeResults = [];
        var yaoResults = [];

        function init() {
            updateStickDisplay('centerSticks', 49);
            document.getElementById('centerCount').textContent = '49';
        }

        function startDivination() {
            document.getElementById('step1').classList.add('hidden');
            document.getElementById('divinationStep').classList.remove('hidden');
            resetForNewYao();
            updateStepIndicator(2);
        }

        function fenEr() {
            leftPile = Math.floor(Math.random() * (totalSticks - 2)) + 1;
            rightPile = totalSticks - leftPile;
            
            document.getElementById('leftCount').textContent = leftPile;
            document.getElementById('rightCount').textContent = rightPile;
            document.getElementById('centerCount').textContent = '0';
            
            updateStickDisplay('leftSticks', leftPile);
            updateStickDisplay('rightSticks', rightPile);
            updateStickDisplay('centerSticks', 0);
            
            document.getElementById('stepInstruction').innerHTML = '<span>已将蓍草分为左右两堆。<br>点击"挂一"从右堆取出一根夹于指间。</span>';
            
            document.getElementById('btnFenEr').classList.add('hidden');
            document.getElementById('btnGuaYi').classList.remove('hidden');
        }

        function guaYi() {
            guaYiVal = 1;
            rightPile -= 1;
            
            document.getElementById('rightCount').textContent = rightPile;
            document.getElementById('guaYiCount').textContent = guaYiVal;
            updateStickDisplay('rightSticks', rightPile);
            
            document.getElementById('stepInstruction').innerHTML = '<span>已从右堆取出一根夹于小指间。<br>点击"揲四"将左右两堆各以四根为一组数之。</span>';
            
            document.getElementById('btnGuaYi').classList.add('hidden');
            document.getElementById('btnDieSi').classList.remove('hidden');
        }

        function dieSi() {
            leftRemainder = leftPile % 4;
            if (leftRemainder === 0) leftRemainder = 4;
            
            rightRemainder = rightPile % 4;
            if (rightRemainder === 0) rightRemainder = 4;
            
            var totalRemainder = guaYiVal + leftRemainder + rightRemainder;
            
            document.getElementById('leftRemCount').textContent = leftRemainder;
            document.getElementById('rightRemCount').textContent = rightRemainder;
            document.getElementById('totalRemCount').textContent = totalRemainder;
            
            changeResults.push(totalRemainder);
            totalSticks = totalSticks - totalRemainder;
            
            document.getElementById('changeInfo').classList.remove('hidden');
            document.getElementById('changeResult').textContent = totalRemainder;
            
            var detail = currentChange === 1 ? 
                '第一变归奇数为 ' + totalRemainder + '（应为5或9）' :
                '第' + changeNames[currentChange-1] + '变归奇数为 ' + totalRemainder + '（应为4或8）';
            document.getElementById('changeDetail').textContent = detail;
            
            document.getElementById('btnDieSi').classList.add('hidden');
            
            if (currentChange < 3) {
                document.getElementById('stepInstruction').innerHTML = 
                    '<span>本变完成，归奇 <span class="highlight-text">' + totalRemainder + '</span> 根。<br>剩余 <span class="highlight-text">' + totalSticks + '</span> 根蓍草，点击继续下一变。</span>';
                document.getElementById('btnNextChange').classList.remove('hidden');
            } else {
                var yaoValue = totalSticks / 4;
                var yaoType = getYaoType(yaoValue);
                yaoResults.push({ value: yaoValue, type: yaoType });
                
                updateYaoDisplay(currentYao, yaoValue, yaoType);
                
                document.getElementById('stepInstruction').innerHTML = 
                    '<span>三变完成！剩余 <span class="highlight-text">' + totalSticks + '</span> 根，除以4得 <span class="highlight-text">' + yaoValue + '</span>。<br>' +
                    '此爻为 <span class="highlight-text">' + yaoType.name + '</span>（' + yaoType.symbol + '）</span>';
                
                if (currentYao < 6) {
                    document.getElementById('btnNextYao').classList.remove('hidden');
                } else {
                    document.getElementById('stepInstruction').innerHTML = 
                        '<span>六爻已成！<br>点击下方按钮查看卦象详情。</span>';
                    document.getElementById('btnShowResult').classList.remove('hidden');
                }
            }
            
            updateProgress();
        }

        function nextChange() {
            currentChange++;
            document.getElementById('currentChange').textContent = changeNames[currentChange - 1];
            
            leftPile = 0;
            rightPile = 0;
            guaYiVal = 0;
            leftRemainder = 0;
            rightRemainder = 0;
            
            document.getElementById('leftCount').textContent = '0';
            document.getElementById('rightCount').textContent = '0';
            document.getElementById('centerCount').textContent = totalSticks;
            document.getElementById('guaYiCount').textContent = '0';
            document.getElementById('leftRemCount').textContent = '0';
            document.getElementById('rightRemCount').textContent = '0';
            document.getElementById('totalRemCount').textContent = '0';
            
            updateStickDisplay('leftSticks', 0);
            updateStickDisplay('rightSticks', 0);
            updateStickDisplay('centerSticks', totalSticks);
            
            document.getElementById('changeInfo').classList.add('hidden');
            document.getElementById('btnNextChange').classList.add('hidden');
            document.getElementById('btnFenEr').classList.remove('hidden');
            
            document.getElementById('stepInstruction').innerHTML = 
                '<span>第' + changeNames[currentChange - 1] + '变开始，当前有 <span class="highlight-text">' + totalSticks + '</span> 根蓍草。<br>点击"分二"继续。</span>';
        }

        function nextYao() {
            currentYao++;
            currentChange = 1;
            changeResults = [];
            totalSticks = 49;
            
            document.getElementById('currentYao').textContent = yaoNumNames[currentYao - 1];
            document.getElementById('currentChange').textContent = changeNames[0];
            
            resetForNewYao();
            updateStepIndicator(currentYao + 1);
            
            document.getElementById('btnNextYao').classList.add('hidden');
            document.getElementById('btnFenEr').classList.remove('hidden');
            
            document.getElementById('stepInstruction').innerHTML = 
                '<span>开始第' + yaoNumNames[currentYao - 1] + '爻的演算。<br>点击"分二"将四十九根蓍草分成两堆。</span>';
        }

        function resetForNewYao() {
            leftPile = 0;
            rightPile = 0;
            guaYiVal = 0;
            leftRemainder = 0;
            rightRemainder = 0;
            
            document.getElementById('leftCount').textContent = '0';
            document.getElementById('rightCount').textContent = '0';
            document.getElementById('centerCount').textContent = '49';
            document.getElementById('guaYiCount').textContent = '0';
            document.getElementById('leftRemCount').textContent = '0';
            document.getElementById('rightRemCount').textContent = '0';
            document.getElementById('totalRemCount').textContent = '0';
            
            updateStickDisplay('leftSticks', 0);
            updateStickDisplay('rightSticks', 0);
            updateStickDisplay('centerSticks', 49);
            
            document.getElementById('changeInfo').classList.add('hidden');
        }

        function getYaoType(value) {
            switch(value) {
                case 6: return { name: "老阴", symbol: "✕", isYang: false, isMoving: true };
                case 7: return { name: "少阳", symbol: "—", isYang: true, isMoving: false };
                case 8: return { name: "少阴", symbol: "- -", isYang: false, isMoving: false };
                case 9: return { name: "老阳", symbol: "○", isYang: true, isMoving: true };
                default: return { name: "未知", symbol: "?", isYang: false, isMoving: false };
            }
        }

        function updateYaoDisplay(yaoNum, value, type) {
			var row = document.getElementById('yaoRow' + yaoNum);
			var segments = row.querySelectorAll('.yao-segment');
			var valueSpan = row.querySelector('.yao-value');
			var yaoLine = row.querySelector('.yao-line');

			for (var i = 0; i < segments.length; i++) {
				segments[i].classList.remove('pending');
			}

			yaoLine.classList.remove('yin-line');
			if (!type.isYang) {
				yaoLine.classList.add('yin-line');
			}

			var displayText = value.toString();
			if (type.isMoving) {
				displayText += ' <span class="yao-moving">动</span>';
			}
			valueSpan.innerHTML = displayText;
		}

        function updateStickDisplay(containerId, count) {
            var container = document.getElementById(containerId);
            container.innerHTML = '';
            var displayCount = Math.min(count, 50);
            for (var i = 0; i < displayCount; i++) {
                var stick = document.createElement('div');
                stick.className = 'stick';
                container.appendChild(stick);
            }
        }

        function updateProgress() {
            var totalSteps = 18;
            var currentStep = (currentYao - 1) * 3 + currentChange;
            var progress = (currentStep / totalSteps) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
        }

        function updateStepIndicator(step) {
            var dots = document.querySelectorAll('.step-dot');
            for (var i = 0; i < dots.length; i++) {
                dots[i].classList.remove('active', 'completed');
                if (i + 1 < step) {
                    dots[i].classList.add('completed');
                } else if (i + 1 === step) {
                    dots[i].classList.add('active');
                }
            }
        }

        function showResult() {
            document.getElementById('divinationStep').classList.add('hidden');
            document.getElementById('resultSection').classList.remove('hidden');
            updateStepIndicator(8);
            
            var hexagramBinary = '';
            for (var i = 0; i < yaoResults.length; i++) {
                hexagramBinary += yaoResults[i].type.isYang ? '1' : '0';
            }
            
            var hexagram = hexagramData[hexagramBinary];
            if (!hexagram) {
                hexagram = {
                    name: "未知卦",
                    symbol: "?",
                    judgment: "卦象数据未找到",
                    explanation: "请检查卦象数据是否完整。",
                    yaoText: []
                };
            }
            
            document.getElementById('guaName').textContent = hexagram.name;
            document.getElementById('guaSymbol').textContent = hexagram.symbol;
            document.getElementById('guaCi').textContent = hexagram.judgment;
            document.getElementById('guaExplanation').textContent = hexagram.explanation;
            
            var movingYaos = [];
            for (var i = 0; i < yaoResults.length; i++) {
                if (yaoResults[i].type.isMoving) {
                    movingYaos.push(i);
                }
            }
            
            var yaoTextSection = document.getElementById('yaoTextSection');
            yaoTextSection.innerHTML = '';
            
            // 根据动爻数量动态显示
            if (movingYaos.length === 0) {
                yaoTextSection.innerHTML = '<div class="gua-explanation" style="opacity:0.8;"><p>本卦无动爻，占断完成。</p></div>';
                document.getElementById('bianGuaSection').classList.add('hidden');
                
            } else if (movingYaos.length === 1 || movingYaos.length === 2) {
                // 1-2个动爻：显示动爻爻辞
                var yaoHtml = '';
                for (var j = 0; j < movingYaos.length; j++) {
                    var index = movingYaos[j];
                    if (hexagram.yaoText[index]) {
                        var yaoInfo = hexagram.yaoText[index];
                        yaoHtml += '<div class="yao-text">' +
                            '<div class="yao-title">' + yaoInfo.title + '（动爻）</div>' +
                            '<div>' + yaoInfo.text + '</div>' +
                        '</div>';
                    }
                }
                yaoTextSection.innerHTML = yaoHtml;
                
                // 显示变卦
                var bianBinary = '';
                for (var k = 0; k < yaoResults.length; k++) {
                    if (yaoResults[k].type.isMoving) {
                        bianBinary += yaoResults[k].type.isYang ? '0' : '1';
                    } else {
                        bianBinary += yaoResults[k].type.isYang ? '1' : '0';
                    }
                }
                var bianHexagram = hexagramData[bianBinary];
                if (bianHexagram) {
                    document.getElementById('bianGuaSection').classList.remove('hidden');
                    document.getElementById('bianGuaName').textContent = bianHexagram.name;
                    document.getElementById('bianGuaSymbol').textContent = bianHexagram.symbol;
                    document.getElementById('bianGuaCi').innerHTML = 
                        '<strong>【卦辞】</strong><p>' + bianHexagram.judgment + '</p>' +
                        '<strong>【解释】</strong><p>' + bianHexagram.explanation + '</p>';
                }
                
            } else if (movingYaos.length === 3) {
                // 3个动爻：只显示变卦卦辞
                yaoTextSection.innerHTML = '<div class="gua-explanation" style="opacity:0.8;"><p>三个动爻，参考变卦。</p></div>';
                
                var bianBinary = '';
                for (var k = 0; k < yaoResults.length; k++) {
                    if (yaoResults[k].type.isMoving) {
                        bianBinary += yaoResults[k].type.isYang ? '0' : '1';
                    } else {
                        bianBinary += yaoResults[k].type.isYang ? '1' : '0';
                    }
                }
                var bianHexagram = hexagramData[bianBinary];
                if (bianHexagram) {
                    document.getElementById('bianGuaSection').classList.remove('hidden');
                    document.getElementById('bianGuaName').textContent = bianHexagram.name;
                    document.getElementById('bianGuaSymbol').textContent = bianHexagram.symbol;
                    document.getElementById('bianGuaCi').innerHTML = 
                        '<strong>【卦辞】</strong><p>' + bianHexagram.judgment + '</p>' +
                        '<strong>【解释】</strong><p>' + bianHexagram.explanation + '</p>';
                }
                
            } else if (movingYaos.length >= 4) {
                // 4-6个动爻：显示变卦及其静爻爻辞
                var bianBinary = '';
                for (var k = 0; k < yaoResults.length; k++) {
                    if (yaoResults[k].type.isMoving) {
                        bianBinary += yaoResults[k].type.isYang ? '0' : '1';
                    } else {
                        bianBinary += yaoResults[k].type.isYang ? '1' : '0';
                    }
                }
                var bianHexagram = hexagramData[bianBinary];
                if (bianHexagram) {
                    document.getElementById('bianGuaSection').classList.remove('hidden');
                    document.getElementById('bianGuaName').textContent = bianHexagram.name;
                    document.getElementById('bianGuaSymbol').textContent = bianHexagram.symbol;
                    document.getElementById('bianGuaCi').innerHTML = 
                        '<strong>【卦辞】</strong><p>' + bianHexagram.judgment + '</p>' +
                        '<strong>【解释】</strong><p>' + bianHexagram.explanation + '</p>';
                    
                    // 显示变卦的静爻
                    var staticYaoHtml = '';
                    for (var n = 0; n < 6; n++) {
                        if (!movingYaos.includes(n) && bianHexagram.yaoText[n]) {
                            staticYaoHtml += '<div class="yao-text">' +
                                '<div class="yao-title">' + bianHexagram.yaoText[n].title + '（静爻）</div>' +
                                '<div>' + bianHexagram.yaoText[n].text + '</div>' +
                            '</div>';
                        }
                    }
                    yaoTextSection.innerHTML = staticYaoHtml;
                }
            }
            
            // 解读指引
            var guide = '';
            switch(movingYaos.length) {
                case 0: guide = '【解读】无动爻，直接参考本卦卦辞。'; break;
                case 1: guide = '【解读】一个动爻，以本卦动爻爻辞为主要参考。'; break;
                case 2: guide = '【解读】两个动爻，参考两条动爻爻辞，上爻为主。'; break;
                case 3: guide = '【解读】三个动爻，本卦卦辞与变卦卦辞综合参考。'; break;
                case 4: guide = '【解读】四个动爻，参考变卦的两条静爻爻辞。'; break;
                case 5: guide = '【解读】五个动爻，参考变卦唯一静爻爻辞。'; break;
                case 6: guide = '【解读】六爻皆动，参考变卦卦辞。'; break;
            }
            
            var guideHtml = '<div class="gua-judgment" style="margin-top: 1.5vh; padding: 1vh; opacity: 0.9;">' +
                '<p style="color: var(--secondary-color); font-size: 1.4vh; margin: 0;">' + guide + '</p>' +
            '</div>';
            
            yaoTextSection.innerHTML += guideHtml;
        }

        function restart() {
            currentYao = 1;
            currentChange = 1;
            totalSticks = 49;
            changeResults = [];
            yaoResults = [];
            
            // 隐藏所有结果相关元素
            document.getElementById('resultSection').classList.add('hidden');
            document.getElementById('divinationStep').classList.add('hidden');
            document.getElementById('bianGuaSection').classList.add('hidden');
            
            // 显示第一步
            document.getElementById('step1').classList.remove('hidden');
            
            document.getElementById('questionInput').value = '';
            document.getElementById('currentYao').textContent = '一';
            document.getElementById('currentChange').textContent = '一';
            document.getElementById('progressFill').style.width = '0%';
            
            for (var i = 1; i <= 6; i++) {
				var row = document.getElementById('yaoRow' + i);
				var segments = row.querySelectorAll('.yao-segment');
				var valueSpan = row.querySelector('.yao-value');
				var yaoLine = row.querySelector('.yao-line');
				for (var j = 0; j < segments.length; j++) {
					segments[j].classList.add('pending');
				}
				yaoLine.classList.remove('yin-line');
				valueSpan.innerHTML = '-';
			}
            
            document.getElementById('btnFenEr').classList.remove('hidden');
            document.getElementById('btnGuaYi').classList.add('hidden');
            document.getElementById('btnDieSi').classList.add('hidden');
            document.getElementById('btnNextChange').classList.add('hidden');
            document.getElementById('btnNextChange').classList.add('hidden');
            document.getElementById('btnNextYao').classList.add('hidden');
            document.getElementById('btnShowResult').classList.add('hidden');
            
            updateStepIndicator(1);
            init();
        }

        document.addEventListener('DOMContentLoaded', init);
    </script>
</body>
</html>`;
    
    return new Response(html, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    });
  },
};
