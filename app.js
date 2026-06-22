document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // Web Audio Synth Bleep Feedback
  // ==========================================================================
  let soundEnabled = true;
  const soundToggle = document.getElementById('sound-toggle');

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      const icon = soundToggle.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', soundEnabled ? 'volume-2' : 'volume-x');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });
  }

  function playSystemBeep(freq = 600, duration = 0.08, type = 'sine') {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext blocks sometimes before click
    }
  }

  // ==========================================================================
  // Boot Sequence Simulation Loader
  // ==========================================================================
  const bootOverlay = document.getElementById('boot-overlay');
  const bootLog = document.getElementById('boot-log-container');
  const bootAction = document.getElementById('boot-action-area');
  const bootBtn = document.getElementById('boot-button');
  const desktopWrapper = document.getElementById('desktop-wrapper');

  const bootLogs = [
    { text: "HETVI_OS Core Loader v2.6.4 initializing...", type: "info" },
    { text: "CPU Check: Core frequency 4.80 GHz ... OK", type: "info" },
    { text: "Memory allocation: 16 GB Synaptic RAM initialized", type: "info" },
    { text: "Neural modules check: [Programming, WebDev, AI, BigData] ... READY", type: "success" },
    { text: "Vector databases active (pgvector link established)", type: "info" },
    { text: "Secure communication handshake keys ... SECURE", type: "success" },
    { text: "Warning: Timeline odyssey indexes contain high time-dilation values.", type: "warning" },
    { text: "Encrypted vaults verification in progress...", type: "info" },
    { text: "Decrypting key verification success.", type: "success" },
    { text: "System engaged. Loading HETVI OS user profile.", type: "success" }
  ];

  let logIndex = 0;

  function typeBootLogs() {
    if (logIndex < bootLogs.length) {
      const log = bootLogs[logIndex];
      const div = document.createElement('div');
      div.className = `boot-log-line ${log.type}`;
      div.innerHTML = `<span>[${new Date().toLocaleTimeString()}]</span> ${log.text}`;
      if (bootLog) {
        bootLog.appendChild(div);
        bootLog.scrollTop = bootLog.scrollHeight;
      }
      playSystemBeep(500 + logIndex * 30, 0.05, 'square');
      logIndex++;
      setTimeout(typeBootLogs, Math.random() * 250 + 150);
    } else {
      if (bootAction) {
        bootAction.style.display = 'flex';
      }
    }
  }

  // Start log printing sequence
  if (bootOverlay) {
    setTimeout(typeBootLogs, 600);
  }

  // Boot Button Link Trigger
  if (bootBtn) {
    bootBtn.addEventListener('click', () => {
      playSystemBeep(880, 0.25, 'sine');
      setTimeout(() => playSystemBeep(1200, 0.15, 'sine'), 100);
      
      bootOverlay.style.opacity = '0';
      bootOverlay.style.transition = 'opacity 0.6s ease';
      
      setTimeout(() => {
        bootOverlay.style.display = 'none';
        desktopWrapper.style.display = 'flex';
        // Initialize active elements
        initializeClock();
        initializeDiagnosticsWave();
        initializeSkillsNeuralMap();
        initTimelineGalaxyOrbits();
        // Check URL parameter to open specific page directly
        checkDeepLinkParams();
      }, 600);
    });
  }

  // Active status clocks
  function initializeClock() {
    const clock = document.getElementById('taskbar-clock');
    if (clock) {
      setInterval(() => {
        clock.textContent = new Date().toLocaleTimeString();
      }, 1000);
    }

    // Ping telemetry fluctuation
    const pingDisplay = document.getElementById('telemetry-ping');
    setInterval(() => {
      if (pingDisplay) {
        pingDisplay.textContent = `${Math.floor(Math.random() * 6 + 10)} ms`;
      }
    }, 3000);
  }

  // Check query parameter redirection
  function checkDeepLinkParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const windowToOpen = urlParams.get('win');
    if (windowToOpen) {
      let winId = `win-${windowToOpen}`;
      if (windowToOpen === 'about') winId = 'win-resume'; // About and Resume merged in OS report
      const targetWindow = document.getElementById(winId);
      if (targetWindow) {
        openWindow(winId);
      }
    }
  }

  // ==========================================================================
  // Floating Draggable Window Management
  // ==========================================================================
  const workspace = document.querySelector('.os-workspace');
  const windows = document.querySelectorAll('.os-window');
  const shortcuts = document.querySelectorAll('.desktop-shortcut');
  const activeTabsContainer = document.getElementById('active-tabs-container');
  const osDockInner = document.getElementById('os-dock-inner');

  let activeZIndex = 300;

  // Make Windows Draggable
  windows.forEach(win => {
    const header = win.querySelector('.win-header');
    
    // Focus window on click
    win.addEventListener('mousedown', () => focusWindow(win));
    win.addEventListener('touchstart', () => focusWindow(win));

    // Handle drags
    if (header) {
      header.addEventListener('mousedown', (e) => startDrag(e, win));
      header.addEventListener('touchstart', (e) => startDrag(e, win), { passive: false });
    }

    // Action controls (Min/Max/Close)
    const minBtn = win.querySelector('.win-controls .min');
    const maxBtn = win.querySelector('.win-controls .max');
    const closeBtn = win.querySelector('.win-controls .close');

    if (minBtn) {
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        minimizeWindow(win);
      });
    }
    if (maxBtn) {
      maxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        maximizeWindow(win);
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWindow(win);
      });
    }
  });

  // Shortcut Link triggers
  shortcuts.forEach(sc => {
    sc.addEventListener('click', () => {
      const winId = sc.getAttribute('data-window');
      openWindow(winId);
    });
  });

  // Focus Window Z-index raise
  function focusWindow(win) {
    windows.forEach(w => w.classList.remove('active'));
    win.classList.add('active');
    activeZIndex += 1;
    win.style.zIndex = activeZIndex;
    
    // Update taskbar tabs active status
    updateTabsUI(win.id);
  }

  // Open window from dock or icon
  function openWindow(winId) {
    const win = document.getElementById(winId);
    if (!win) return;

    playSystemBeep(650, 0.08, 'sine');
    
    win.classList.remove('minimized');
    win.classList.add('open');
    focusWindow(win);

    // Create navigation tab in taskbar if not already present
    createTabNode(winId, win.querySelector('.win-title').textContent);
  }

  // Close window
  function closeWindow(win) {
    playSystemBeep(450, 0.1, 'sine');
    win.classList.remove('open');
    win.classList.remove('maximized');
    removeTabNode(win.id);
    removeDockNode(win.id);
  }

  // Minimize window (slides into dock)
  function minimizeWindow(win) {
    playSystemBeep(520, 0.08, 'sine');
    win.classList.add('minimized');
    win.classList.remove('active');
    
    // Create dock icon representation
    createDockNode(win.id, win.querySelector('.win-title').textContent, win.querySelector('.win-type-icon').getAttribute('data-lucide'));
  }

  // Maximize Window
  function maximizeWindow(win) {
    playSystemBeep(700, 0.08, 'sine');
    win.classList.toggle('maximized');
  }

  // Handle pointer drags
  function startDrag(e, win) {
    if (win.classList.contains('maximized')) return;
    
    // Prevent default touch scrolls
    if (e.type === 'touchstart') {
      e.preventDefault();
    }

    focusWindow(win);

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    const startX = clientX - win.offsetLeft;
    const startY = clientY - win.offsetTop;

    function doDrag(dragEvent) {
      const currentX = dragEvent.type === 'touchmove' ? dragEvent.touches[0].clientX : dragEvent.clientX;
      const currentY = dragEvent.type === 'touchmove' ? dragEvent.touches[0].clientY : dragEvent.clientY;

      let newX = currentX - startX;
      let newY = currentY - startY;

      // Bound windows inside viewport limits
      const maxLeft = window.innerWidth - 100;
      const maxTop = window.innerHeight - 80;

      newX = Math.max(-100, Math.min(newX, maxLeft));
      newY = Math.max(0, Math.min(newY, maxTop));

      win.style.left = `${newX}px`;
      win.style.top = `${newY}px`;
    }

    function stopDrag() {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', doDrag);
      document.removeEventListener('touchend', stopDrag);
    }

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', doDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);
  }

  // Taskbar Tab creation logic
  function createTabNode(winId, title) {
    let existingTab = document.querySelector(`.tab-btn[data-win="${winId}"]`);
    if (existingTab) return;

    const tab = document.createElement('button');
    tab.className = 'tab-btn active';
    tab.setAttribute('data-win', winId);
    tab.innerHTML = `<span class="status-dot online"></span> <span>${title.replace('HETVI_OS://', '')}</span>`;
    
    tab.addEventListener('click', () => {
      const win = document.getElementById(winId);
      if (win.classList.contains('minimized')) {
        openWindow(winId);
      } else if (win.classList.contains('active')) {
        minimizeWindow(win);
      } else {
        focusWindow(win);
      }
    });

    if (activeTabsContainer) {
      activeTabsContainer.appendChild(tab);
    }
  }

  function removeTabNode(winId) {
    const tab = document.querySelector(`.tab-btn[data-win="${winId}"]`);
    if (tab) tab.remove();
  }

  function updateTabsUI(activeWinId) {
    document.querySelectorAll('.tab-btn').forEach(tab => {
      if (tab.getAttribute('data-win') === activeWinId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  // Dock items logic
  function createDockNode(winId, title, iconName) {
    let existingNode = document.querySelector(`.dock-node[data-win="${winId}"]`);
    if (existingNode) return;

    const node = document.createElement('button');
    node.className = 'dock-node';
    node.setAttribute('data-win', winId);
    node.setAttribute('title', title);
    node.innerHTML = `<i data-lucide="${iconName || 'window'}"></i>`;
    
    node.addEventListener('click', () => {
      openWindow(winId);
      removeDockNode(winId);
    });

    if (osDockInner) {
      osDockInner.appendChild(node);
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }

  function removeDockNode(winId) {
    const node = document.querySelector(`.dock-node[data-win="${winId}"]`);
    if (node) node.remove();
  }

  // ==========================================================================
  // Command Terminal Operations Interpreter
  // ==========================================================================
  const terminalHistory = document.getElementById('terminal-history');
  const terminalInput = document.getElementById('terminal-textbox');

  const terminalCommands = {
    help: () => {
      return [
        "VALID SHELL COMMANDS ARRAY:",
        "  <span class='cmd-text'>help</span>         : Display current operations manual.",
        "  <span class='cmd-text'>about</span>        : Print background system specs of developer.",
        "  <span class='cmd-text'>projects</span>     : Trigger Process Manager (Featured Projects).",
        "  <span class='cmd-text'>skills</span>       : Launch Neural Skill node networks.",
        "  <span class='cmd-text'>vault</span>        : Unlock encrypted professional certificates vault.",
        "  <span class='cmd-text'>resume</span>       : Display executive CV academic records.",
        "  <span class='cmd-text'>contact</span>      : Open secure transmission channel (Contact).",
        "  <span class='cmd-text'>diagnostics</span>  : Show system health gauges.",
        "  <span class='cmd-text'>time-travel</span>  : Load Space-Time Odyssey timeline slides.",
        "  <span class='cmd-text'>neofetch</span>     : Fetch OS core attributes.",
        "  <span class='cmd-text'>clear</span>        : Flush terminal log history."
      ];
    },
    about: () => {
      return [
        "DEVELOPER DATA SUMMARY:",
        "  Name        : Hetvi Chirag Sheth",
        "  Origin      : Vadodara, Gujarat, India",
        "  Title       : AI & Full-Stack Systems Engineer",
        "  Education   : B.Tech Computer Engineering (Navrachana Univ, Vadodara)",
        "  Ambition    : Building scalable cognitive models and multi-agent workflows."
      ];
    },
    neofetch: () => {
      return [
        "               <span class='cmd-text'>.,-:-..</span>          root@hetvi_os",
        "          <span class='cmd-text'>,:/+/+++++++//:</span>        -------------",
        "        <span class='cmd-text'>.++++/////////++++.</span>      OS: HETVI OS v2.6.4 x86_64",
        "       <span class='cmd-text'>/+++/`         `++++/</span>     Kernel: WebKit-JS-v8",
        "      <span class='cmd-text'>++++/             /+++</span>     Uptime: 2 mins",
        "      <span class='cmd-text'>++++.             .+++</span>     Shell: Zsh (CoreTerminal)",
        "      <span class='cmd-text'>++++\             /+++</span>     CPU: Gemini Neural Core (8 Cores)",
        "       <span class='cmd-text'>\+++/`         `/+++/</span>     Memory: 7712MB / 16384MB",
        "        <span class='cmd-text'>.++++/////////++++.</span>      Secure Link: ESTABLISHED",
        "          <span class='cmd-text'>,:/+/+++++++//:`</span>",
        "               <span class='cmd-text'>.,-:-..</span>"
      ];
    },
    clear: () => {
      if (terminalHistory) terminalHistory.innerHTML = '';
      return [];
    },
    projects: () => { openWindow('win-processes'); return ["Opening HETVI_OS://Running_Processes panel..."]; },
    skills: () => { openWindow('win-skills'); return ["Launching HETVI_OS://Neural_Modules network..."]; },
    vault: () => { openWindow('win-vault'); return ["Redirecting to HETVI_OS://Encrypted_Vault..."]; },
    resume: () => { openWindow('win-resume'); return ["Generating HETVI_OS://System_Report_Viewer..."]; },
    contact: () => { openWindow('win-contact'); return ["Connecting to Secure Transmission Desk..."]; },
    diagnostics: () => { openWindow('win-diagnostics'); return ["Opening system telemetry indicators..."]; },
    "time-travel": () => { openWindow('win-timeline'); return ["Initiating chronological time warp link..."]; }
  };

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmdRaw = terminalInput.value.trim();
        terminalInput.value = '';

        if (!cmdRaw) return;

        playSystemBeep(580, 0.05, 'triangle');

        // Display command in history
        const userLine = document.createElement('div');
        userLine.innerHTML = `<span class="terminal-prompt">root@hetvi_os:~$</span> ${cmdRaw}`;
        terminalHistory.appendChild(userLine);

        const cmdArg = cmdRaw.toLowerCase();
        let logs = [];

        if (terminalCommands[cmdArg]) {
          logs = terminalCommands[cmdArg]();
        } else {
          logs = [
            `sh: command not found: ${cmdRaw}`,
            "Type <span class='cmd-text'>help</span> to check available actions."
          ];
        }

        // Print outputs
        logs.forEach(line => {
          const logLine = document.createElement('div');
          logLine.innerHTML = line;
          terminalHistory.appendChild(logLine);
        });

        terminalHistory.scrollTop = terminalHistory.scrollHeight;
      }
    });

    // Keep focus on input
    const terminalWindow = document.getElementById('win-terminal');
    if (terminalWindow) {
      terminalWindow.addEventListener('click', () => {
        terminalInput.focus();
      });
    }
  }

  // ==========================================================================
  // Telemetry Diagnostics Canvas Graphs
  // ==========================================================================
  let diagCanvas = document.getElementById('diagnostics-chart');
  let diagCtx = diagCanvas ? diagCanvas.getContext('2d') : null;
  let waveOffset = 0;

  function initializeDiagnosticsWave() {
    if (!diagCanvas || !diagCtx) return;

    const resizeChart = () => {
      const container = diagCanvas.parentElement;
      diagCanvas.width = container.clientWidth;
      diagCanvas.height = container.clientHeight;
    };
    resizeChart();
    window.addEventListener('resize', resizeChart);

    function drawWave() {
      if (!diagCtx || !diagCanvas) return;
      diagCtx.clearRect(0, 0, diagCanvas.width, diagCanvas.height);

      diagCtx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
      diagCtx.lineWidth = 2;
      diagCtx.shadowBlur = 6;
      diagCtx.shadowColor = 'rgba(0, 242, 254, 0.5)';

      // Outer wave line
      diagCtx.beginPath();
      const middleY = diagCanvas.height / 2;
      const w = diagCanvas.width;

      for (let x = 0; x < w; x++) {
        const angle = (x / w) * Math.PI * 4 + waveOffset;
        const y = middleY + Math.sin(angle) * 18 * Math.sin(waveOffset * 0.5);
        if (x === 0) diagCtx.moveTo(x, y);
        else diagCtx.lineTo(x, y);
      }
      diagCtx.stroke();

      // Shadow overlay line
      diagCtx.strokeStyle = 'rgba(157, 78, 221, 0.4)';
      diagCtx.shadowColor = 'rgba(157, 78, 221, 0.3)';
      diagCtx.beginPath();
      for (let x = 0; x < w; x++) {
        const angle = (x / w) * Math.PI * 6 - waveOffset;
        const y = middleY + Math.cos(angle) * 12 * Math.sin(waveOffset * 0.3);
        if (x === 0) diagCtx.moveTo(x, y);
        else diagCtx.lineTo(x, y);
      }
      diagCtx.stroke();

      diagCtx.shadowBlur = 0; // Reset blur

      waveOffset += 0.05;
      requestAnimationFrame(drawWave);
    }
    drawWave();

    // Fluctuating dial displays
    const cpuGauge = document.getElementById('cpu-gauge');
    const memGauge = document.getElementById('mem-gauge');
    const cpuVal = document.getElementById('cpu-val-display');
    const memVal = document.getElementById('mem-val-display');
    const bandVal = document.getElementById('bandwidth-val');
    const sysTemp = document.getElementById('diag-temp');

    setInterval(() => {
      const cpu = Math.floor(Math.random() * 16 + 12); // 12-28
      const mem = Math.floor(Math.random() * 4 + 46);  // 46-50
      
      if (cpuGauge) {
        cpuGauge.style.setProperty('--gauge-percentage', cpu);
        cpuVal.textContent = `${cpu}%`;
      }
      if (memGauge) {
        memGauge.style.setProperty('--gauge-percentage', mem);
        memVal.textContent = `${mem}%`;
      }
      if (bandVal) {
        bandVal.textContent = `${(Math.random() * 1.5 + 2.1).toFixed(2)} Gbps`;
      }
      if (sysTemp) {
        sysTemp.textContent = `${Math.floor(Math.random() * 3 + 37)}°C`;
      }
    }, 2000);
  }

  // ==========================================================================
  // Projects running process managers
  // ==========================================================================
  const projectsData = [
    { pid: 901, name: "Saarthi_AI_Assistant.bin", cpu: "14.2%", mem: "256MB", status: "RUNNING", category: "aiagent", url: "https://github.com/Hetvi16-05/Personal-AI-Assistant", tech: ["FastAPI", "Streamlit", "Gemini", "Supabase", "pgvector"], logs: ["Semantic chat memory via pgvector", "Multi-agent planner & recommendation engine", "Goal roadmaps & milestone tracking", "JWT auth with multi-user isolation"] },
    { pid: 902, name: "Travia_Travel_Planner.app", cpu: "8.5%", mem: "180MB", status: "RUNNING", category: "fullstack", url: "https://github.com/Hetvi16-05/Travel", tech: ["React.js", "Node.js", "PostgreSQL", "JWT", "Leaflet"], logs: ["AI-powered itinerary generation", "Interactive map visualization (Leaflet)", "Secure authentication (JWT)", "Responsive multi-user database"] },
    { pid: 903, name: "Supplier_Ranking_Model.py", cpu: "5.1%", mem: "120MB", status: "RUNNING", category: "datascience", url: "https://github.com/Hetvi16-05", tech: ["Python", "Machine Learning", "Web Scraping", "Regression Models"], logs: ["Regression-based scoring models", "Real-time web scraping pipeline", "Reliability rating algorithms", "Appreciated by CEO of Mesh Works"] },
    { pid: 904, name: "RAINWISE_Threat_Core.bin", cpu: "18.9%", mem: "420MB", status: "RUNNING", category: "computervision", url: "https://github.com/Hetvi16-05/rainwise", tech: ["PyTorch", "SegFormer", "YOLO-World", "LSTM", "OpenCV"], logs: ["Flood segmentation (SegFormer-B0)", "Zero-shot threat detection (YOLO-World)", "Time-series prediction (LSTM)", "98.89% detection accuracy"] },
    { pid: 905, name: "BigData_Flood_Alerts.jar", cpu: "12.0%", mem: "512MB", status: "RUNNING", category: "bigdata", url: "https://github.com/Hetvi16-05/flood-monitoring-ai", tech: ["TensorFlow", "Hadoop", "Spark", "Kafka", "MongoDB"], logs: ["Time-series forecasting (TFT)", "Distributed pipelines (Hadoop & Spark)", "Real-time data streaming (Kafka)", "Tableau & Power BI visualizations"] },
    { pid: 906, name: "Hindi_Transliterator_DL.py", cpu: "9.2%", mem: "380MB", status: "RUNNING", category: "nlp", url: "https://github.com/Hetvi16-05/Transliterator", tech: ["TensorFlow", "NLP Model", "Seq2Seq", "FastAPI", "Beam Search"], logs: ["Seq2Seq + Attention architectures", "Trained on 84K Hindi-Hinglish pairs", "Metrics metrics evaluation (CER, WER, BLEU)", "FastAPI backend integration"] },
    { pid: 907, name: "GreenSort_IoT_Sorter.elf", cpu: "4.8%", mem: "64MB", status: "RUNNING", category: "iot", url: "https://github.com/snehadpatel/greensort", tech: ["YOLO", "Arduino", "Raspberry Pi", "IoT Protocols", "OpenCV"], logs: ["YOLO & Random Forest classification", "Raspberry Pi & servo sorting mechanics", "Published paper at SustainX 2026", "Approximately 75% sorting accuracy"] }
  ];

  const processesTableBody = document.getElementById('processes-tbody');
  const processInspector = document.getElementById('process-inspector');
  const inspectPid = document.getElementById('inspect-pid');
  const inspectTitle = document.getElementById('inspect-title');
  const inspectLogs = document.getElementById('inspect-logs');
  const inspectTech = document.getElementById('inspect-tech');
  const closeInspectorBtn = document.getElementById('close-inspector-btn');

  function renderProcesses() {
    if (!processesTableBody) return;
    processesTableBody.innerHTML = '';

    projectsData.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="process-pid">${p.pid}</td>
        <td><strong>${p.name}</strong></td>
        <td class="process-cpu">${p.status === 'RUNNING' ? p.cpu : '0.0%'}</td>
        <td>${p.mem}</td>
        <td>
          <span class="status-pill ${p.status === 'RUNNING' ? 'run' : 'killed'}">
            <span class="status-indicator"></span> ${p.status}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline inspect-proc-btn" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; margin-right: 0.3rem;">INSPECT</button>
          <button class="btn btn-sm btn-primary kill-proc-btn" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; background:${p.status === 'RUNNING' ? '' : '#10b981'}">${p.status === 'RUNNING' ? 'KILL' : 'BOOT'}</button>
          <a href="${p.url}" target="_blank" class="btn btn-sm btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;"><i data-lucide="external-link" style="width:10px;height:10px;"></i></a>
        </td>
      `;

      // Actions hooks
      const inspectBtn = tr.querySelector('.inspect-proc-btn');
      const killBtn = tr.querySelector('.kill-proc-btn');

      inspectBtn.addEventListener('click', () => {
        playSystemBeep(700, 0.05, 'sine');
        inspectProcess(p);
      });

      killBtn.addEventListener('click', () => {
        playSystemBeep(p.status === 'RUNNING' ? 300 : 800, 0.1, 'square');
        p.status = p.status === 'RUNNING' ? 'TERMINATED' : 'RUNNING';
        renderProcesses();
      });

      processesTableBody.appendChild(tr);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function inspectProcess(p) {
    if (!processInspector) return;
    processInspector.style.display = 'flex';
    
    inspectPid.textContent = `THREAD ID: ${p.pid}`;
    inspectTitle.textContent = `PROCESS LOGS: ${p.name}`;
    
    // Fill Features Logs
    inspectLogs.innerHTML = '';
    p.logs.forEach(log => {
      const li = document.createElement('li');
      li.textContent = log;
      inspectLogs.appendChild(li);
    });

    // Fill Tech heap
    inspectTech.innerHTML = '';
    p.tech.forEach(tech => {
      const span = document.createElement('span');
      span.className = 'skill-pill';
      span.textContent = tech;
      inspectTech.appendChild(span);
    });
  }

  if (closeInspectorBtn) {
    closeInspectorBtn.addEventListener('click', () => {
      playSystemBeep(400, 0.05, 'sine');
      processInspector.style.display = 'none';
    });
  }

  // Populate first run
  renderProcesses();

  // Periodically fluctuate CPU of active items
  setInterval(() => {
    projectsData.forEach(p => {
      if (p.status === 'RUNNING') {
        const current = parseFloat(p.cpu);
        const change = (Math.random() - 0.5) * 3;
        p.cpu = `${Math.max(2, Math.min(25, current + change)).toFixed(1)}%`;
      }
    });
    // Check if window is open/visible to avoid redrawing DOM while minimized
    const win = document.getElementById('win-processes');
    if (win && win.classList.contains('open') && !win.classList.contains('minimized')) {
      renderProcesses();
    }
  }, 3000);


  // ==========================================================================
  // Skills interactive Canvas Neural Node Network
  // ==========================================================================
  const skillCanvas = document.getElementById('skills-neural-canvas');
  let skillCtx = skillCanvas ? skillCanvas.getContext('2d') : null;
  let skillsNodes = [];

  const skillGroups = [
    { label: "PYTHON", cat: "AI", x: 0.5, y: 0.35 },
    { label: "ML", cat: "AI", x: 0.65, y: 0.25 },
    { label: "PYTORCH", cat: "AI", x: 0.72, y: 0.4 },
    { label: "NLP", cat: "AI", x: 0.58, y: 0.55 },
    { label: "JS", cat: "Web", x: 0.32, y: 0.4 },
    { label: "REACT", cat: "Web", x: 0.2, y: 0.3 },
    { label: "NODE.JS", cat: "Web", x: 0.25, y: 0.55 },
    { label: "SQL", cat: "Database", x: 0.45, y: 0.78 },
    { label: "MONGODB", cat: "Database", x: 0.3, y: 0.8 },
    { label: "GIT", cat: "Tools", x: 0.82, y: 0.7 },
    { label: "VS CODE", cat: "Tools", x: 0.7, y: 0.82 }
  ];

  function initializeSkillsNeuralMap() {
    if (!skillCanvas || !skillCtx) return;

    const resizeSkills = () => {
      const wrapper = skillCanvas.parentElement;
      skillCanvas.width = wrapper.clientWidth;
      skillCanvas.height = wrapper.clientHeight;
      buildSkillCoordinates();
    };

    function buildSkillCoordinates() {
      const w = skillCanvas.width;
      const h = skillCanvas.height;
      skillsNodes = skillGroups.map((g, idx) => ({
        id: idx,
        label: g.label,
        cat: g.cat,
        x: g.x * w,
        y: g.y * h,
        radius: 26,
        color: g.cat === 'AI' ? '#00f2fe' : (g.cat === 'Web' ? '#9d4edd' : '#10b981'),
        pulse: 0,
        hovered: false
      }));
    }

    resizeSkills();
    window.addEventListener('resize', resizeSkills);

    let activeHoverNode = null;

    skillCanvas.addEventListener('mousemove', (e) => {
      const rect = skillCanvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let foundNode = null;
      skillsNodes.forEach(node => {
        const dx = node.x - mx;
        const dy = node.y - my;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < node.radius) {
          foundNode = node;
          node.hovered = true;
        } else {
          node.hovered = false;
        }
      });

      if (foundNode !== activeHoverNode) {
        if (foundNode) playSystemBeep(440 + foundNode.id * 20, 0.03, 'sine');
        activeHoverNode = foundNode;
      }
    });

    function drawNeuralNetwork() {
      if (!skillCtx || !skillCanvas) return;
      skillCtx.clearRect(0, 0, skillCanvas.width, skillCanvas.height);

      // Draw vectors between nodes of same category
      skillsNodes.forEach((n1, idx1) => {
        skillsNodes.forEach((n2, idx2) => {
          if (idx1 < idx2 && (n1.cat === n2.cat || n1.label === 'PYTHON' || n1.label === 'JS')) {
            skillCtx.beginPath();
            skillCtx.moveTo(n1.x, n1.y);
            skillCtx.lineTo(n2.x, n2.y);
            
            const isHighlighted = n1.hovered || n2.hovered;
            skillCtx.strokeStyle = isHighlighted ? 'rgba(0, 242, 254, 0.4)' : 'rgba(255, 255, 255, 0.05)';
            skillCtx.lineWidth = isHighlighted ? 1.5 : 0.8;
            
            if (isHighlighted) {
              skillCtx.shadowBlur = 6;
              skillCtx.shadowColor = '#00f2fe';
            }
            skillCtx.stroke();
            skillCtx.shadowBlur = 0;
          }
        });
      });

      // Draw circular nodes
      skillsNodes.forEach(node => {
        // Draw pulse circle
        node.pulse = (node.pulse + 0.05) % (Math.PI * 2);
        const pulseR = node.radius + Math.sin(node.pulse) * 4;

        skillCtx.beginPath();
        skillCtx.arc(node.x, node.y, pulseR, 0, Math.PI * 2);
        skillCtx.strokeStyle = node.color;
        skillCtx.globalAlpha = 0.15;
        skillCtx.lineWidth = 1;
        skillCtx.stroke();
        skillCtx.globalAlpha = 1.0;

        // Draw solid node
        skillCtx.beginPath();
        skillCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        skillCtx.fillStyle = '#060b18';
        skillCtx.strokeStyle = node.hovered ? '#fff' : node.color;
        skillCtx.lineWidth = node.hovered ? 2 : 1;
        
        if (node.hovered) {
          skillCtx.shadowBlur = 10;
          skillCtx.shadowColor = node.color;
        }
        
        skillCtx.fill();
        skillCtx.stroke();
        skillCtx.shadowBlur = 0;

        // Text labels inside nodes
        skillCtx.fillStyle = '#fff';
        skillCtx.font = `bold 9px var(--font-display)`;
        skillCtx.textAlign = 'center';
        skillCtx.textBaseline = 'middle';
        skillCtx.fillText(node.label, node.x, node.y);
      });

      requestAnimationFrame(drawNeuralNetwork);
    }
    drawNeuralNetwork();
  }

  // ==========================================================================
  // Certificates Decryption vault
  // ==========================================================================
  const decryptBtn = document.getElementById('decrypt-vault-btn');
  const lockedScreen = document.getElementById('vault-locked-screen');
  const unlockedScreen = document.getElementById('vault-unlocked-screen');
  const certsListContainer = document.getElementById('certs-list-container');
  const lockIcon = document.getElementById('lock-icon');

  const certificatesData = [
    { title: "Python for Data Science", org: "IBM", file: "pythonfordatascience_IBM.pdf" },
    { title: "Python 101 for Data Science", org: "Cognitive Class (IBM Network)", file: "PythonforDatascience_cognitiveclass.pdf" },
    { title: "AWS Machine Learning Foundations", org: "AWS Academy Graduate", file: "AWSmachinelearning.pdf" },
    { title: "Artificial Intelligence Fundamentals", org: "IBM SkillsBuild", file: "FundamentalodAI_IBM.pdf" },
    { title: "AWS Data Engineering", org: "AWS Academy Graduate", file: "AWSDataengineering.pdf" },
    { title: "Data Analysis with Python", org: "Cognitive Class (IBM Network)", file: "dataanalysisforpython_cognitiveclass.pdf" },
    { title: "Introduction to IoT", org: "Cisco Networking Academy", file: "introductiontoIot_IBM.pdf" }
  ];

  if (decryptBtn) {
    decryptBtn.addEventListener('click', () => {
      playSystemBeep(200, 0.4, 'sawtooth');
      decryptBtn.disabled = true;
      decryptBtn.textContent = "RUNNING CIPHER LINK...";

      if (lockIcon) {
        lockIcon.setAttribute('data-lucide', 'unlock');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }

      // Simulate character scramble decrypt loops
      setTimeout(() => {
        playSystemBeep(880, 0.15, 'sine');
        if (lockedScreen) lockedScreen.style.display = 'none';
        if (unlockedScreen) unlockedScreen.style.display = 'flex';
        
        // Populates certificates list with decode animations
        populateCertificates();
      }, 2000);
    });
  }

  function populateCertificates() {
    if (!certsListContainer) return;
    certsListContainer.innerHTML = '';

    certificatesData.forEach((cert, index) => {
      const row = document.createElement('div');
      row.className = 'cert-os-row';
      row.innerHTML = `
        <div class="cert-info-left">
          <span class="cert-val-title" id="cert-title-${index}">DECRYPTING...</span>
          <span class="cert-val-org">${cert.org}</span>
        </div>
        <a href="${cert.file}" target="_blank" class="btn btn-sm btn-primary">
          <i data-lucide="external-link" style="width:12px; height:12px;"></i>
          <span>VIEW</span>
        </a>
      `;

      certsListContainer.appendChild(row);
      
      // Animate text decode scramble
      setTimeout(() => {
        scrambleTextEffect(document.getElementById(`cert-title-${index}`), cert.title);
      }, index * 200 + 100);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function scrambleTextEffect(element, finalVal) {
    if (!element) return;
    let original = finalVal;
    let chars = '!@#$%^&*()_+{}[]|:;?><';
    let iterations = 0;

    let interval = setInterval(() => {
      let temp = '';
      for (let i = 0; i < original.length; i++) {
        if (original[i] === ' ') {
          temp += ' ';
          continue;
        }
        if (i < iterations) {
          temp += original[i];
        } else {
          temp += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      element.textContent = temp;

      if (iterations >= original.length) {
        clearInterval(interval);
      }
      iterations += 1;
    }, 30);
  }

  // ==========================================================================
  // Timeline Space Scroll Odyssey Parallax
  // ==========================================================================
  const scrollArea = document.getElementById('timeline-scroll-area');
  const slides = document.querySelectorAll('.timeline-scroll-slide');
  const winTimeline = document.getElementById('win-timeline');

  // Warp parameters based on timeline year
  const eraWarpColors = {
    present: 'radial-gradient(circle at 50% 50%, rgba(10, 20, 40, 0.4), #02040b)',
    2026: 'radial-gradient(circle at 50% 50%, rgba(255, 0, 127, 0.15), #02040b)',
    2025: 'radial-gradient(circle at 50% 50%, rgba(157, 78, 221, 0.15), #02040b)',
    2024: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), #02040b)',
    2023: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15), #02040b)',
    galaxy: 'radial-gradient(circle at 50% 50%, rgba(255, 170, 0, 0.15), #02040b)'
  };

  if (scrollArea) {
    scrollArea.addEventListener('scroll', () => {
      // Find active slide based on scroll midpoint
      const midPoint = scrollArea.scrollTop + scrollArea.clientHeight / 2;
      let activeSlide = slides[0];

      slides.forEach(slide => {
        if (midPoint >= slide.offsetTop && midPoint < slide.offsetTop + slide.clientHeight) {
          activeSlide = slide;
        }
      });

      const era = activeSlide.getAttribute('data-slide-era');
      if (winTimeline && eraWarpColors[era]) {
        winTimeline.style.background = eraWarpColors[era];
      }
      
      // Trigger tiny drift sound on slide warp transition
      if (!activeSlide.classList.contains('active')) {
        slides.forEach(s => s.classList.remove('active'));
        activeSlide.classList.add('active');
        playSystemBeep(220 + slides.length * 10, 0.05, 'sine');
      }
    }, { passive: true });
  }

  // Populates floating star fields inside space slide
  function initTimelineGalaxyOrbits() {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) return;
    starsContainer.innerHTML = '';
    
    // Create floating HTML stars (representing GitHub commits)
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 3 + 1}px`;
      star.style.height = star.style.width;
      star.style.backgroundColor = '#fff';
      star.style.borderRadius = '50%';
      star.style.opacity = Math.random().toFixed(2);
      
      // Floating animation delay
      star.style.animation = `pulse ${Math.random() * 3 + 2}s infinite alternate`;
      starsContainer.appendChild(star);
    }

    // Spiral Galaxy SVG orbits generator
    const galaxySvg = document.getElementById('spiral-galaxy-svg');
    if (galaxySvg) {
      for (let i = 0; i < 80; i++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 35 + 8;
        // Compute spiral coordinates
        const cx = 50 + Math.cos(angle + dist * 0.1) * dist;
        const cy = 50 + Math.sin(angle + dist * 0.1) * dist;
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', Math.random() * 0.85 + 0.35);
        circle.setAttribute('class', 'galaxy-star');
        circle.setAttribute('fill', Math.random() > 0.5 ? '#00f2fe' : '#8f00ff');
        galaxySvg.appendChild(circle);
      }
    }
  }

  // ==========================================================================
  // Core AI Assistant Dialogue responses chatbot
  // ==========================================================================
  const aiChatHistory = document.getElementById('ai-chat-history');
  const promptPills = document.querySelectorAll('.ai-prompt-pill');

  const aiAnswers = {
    background: "HETVI CHIRAG SHETH is an aspiring Computer Engineering student currently pursuing a B.Tech degree at Navrachana University, Vadodara (2023 - 2027) with an outstanding CGPA of 8.54. Prior to B.Tech, she completed her Computer Engineering Diploma at Sigma Institute (GTU) with a near-perfect CGPA of 9.86, ranking at the top of her class across all six semesters.",
    skills: "HER PRINCIPAL TECHNICAL ABILITIES INCORPORATE:\n• Languages: Python, Java, JavaScript, C, SQL.\n• Libraries/Frameworks: PyTorch, TensorFlow, React.js, Node.js, FastAPI, OpenCV, Pandas.\n• Distributed Big Data: Hadoop, Apache Spark, Apache Kafka, MongoDB.",
    saarthi: "SAARTHI AI is a sophisticated personal mentor chatbot developed by Hetvi. Key specifications include:\n• Vector Database integration (pgvector) inside Supabase for long-term semantic user memory.\n• Orchestrates multi-agent pipelines to outline learning roadmaps.\n• Uses JWT authentication protocols for multi-tenant isolation.",
    contact: "TO ESTABLISH A COMM LINK WITH THE DEVELOPER:\n• Secure Email: shethhetvi11@gmail.com / hetvi.c.sheth@nuv.ac.in\n• Mobile Node: +91 9924559139\n• GitHub: github.com/Hetvi16-05\n• LinkedIn: linkedin.com/in/hetvi-sheth-4116a3346"
  };

  promptPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const type = pill.getAttribute('data-prompt');
      if (!aiAnswers[type]) return;

      playSystemBeep(720, 0.08, 'sine');

      // Append User message bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'ai-bubble user-msg';
      userBubble.textContent = pill.textContent;
      aiChatHistory.appendChild(userBubble);
      aiChatHistory.scrollTop = aiChatHistory.scrollHeight;

      // Disable pill temporarily
      pill.disabled = true;

      // Simulate AI typing stream delay
      setTimeout(() => {
        const aiBubble = document.createElement('div');
        aiBubble.className = 'ai-bubble ai-msg';
        aiChatHistory.appendChild(aiBubble);
        
        typeStreamString(aiBubble, aiAnswers[type], () => {
          pill.disabled = false;
        });
      }, 600);
    });
  });

  function typeStreamString(element, text, callback) {
    let index = 0;
    let speed = 15;

    function run() {
      if (index < text.length) {
        // Handle linebreaks
        if (text.substr(index, 1) === '\n') {
          element.innerHTML += '<br>';
        } else {
          element.innerHTML += text[index];
        }
        index++;
        aiChatHistory.scrollTop = aiChatHistory.scrollHeight;
        
        if (index % 3 === 0) playSystemBeep(1100, 0.01, 'triangle');
        
        setTimeout(run, speed);
      } else {
        if (callback) callback();
      }
    }
    run();
  }

  // ==========================================================================
  // Secure Communication Transmission channel contact form submission
  // ==========================================================================
  const contactForm = document.getElementById('secure-contact-form');
  const transmitBtn = document.getElementById('btn-transmit');
  const transmitLogs = document.getElementById('comm-feedback-logs');
  const transmitIcon = document.getElementById('transmit-icon');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameVal = document.getElementById('name').value;
      const emailVal = document.getElementById('email').value;
      const messageVal = document.getElementById('message').value;

      playSystemBeep(440, 0.15, 'sawtooth');

      // Update feedback loading states
      transmitBtn.disabled = true;
      transmitLogs.className = 'terminal-log-output warning';
      transmitLogs.textContent = "ENCRYPTING DATA TRANSCRIPT...";
      
      if (transmitIcon) {
        transmitIcon.setAttribute('data-lucide', 'loader-2');
        transmitIcon.classList.add('spin-animation');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }

      setTimeout(() => {
        transmitLogs.textContent = "ESTABLISHING UPLINK PACKETS...";
        
        fetch('https://formsubmit.co/ajax/shethhetvi11@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            message: messageVal
          })
        })
        .then(response => response.json())
        .then(data => {
          transmitBtn.disabled = false;
          if (transmitIcon) {
            transmitIcon.setAttribute('data-lucide', 'send');
            transmitIcon.classList.remove('spin-animation');
            if (typeof lucide !== 'undefined') lucide.createIcons();
          }

          if (data.success === 'true' || data.success === true) {
            playSystemBeep(980, 0.25, 'sine');
            transmitLogs.className = 'terminal-log-output success';
            transmitLogs.textContent = "TRANSMISSION SECURELY BROADCASTED!";
            contactForm.reset();
          } else {
            playSystemBeep(250, 0.35, 'square');
            transmitLogs.className = 'terminal-log-output error';
            transmitLogs.textContent = "TRANSMISSION MISALIGNED (ERROR)";
          }

          setTimeout(() => {
            transmitLogs.className = 'terminal-log-output';
            transmitLogs.textContent = "READY FOR BROADCASTING...";
          }, 6000);
        })
        .catch(err => {
          transmitBtn.disabled = false;
          if (transmitIcon) {
            transmitIcon.setAttribute('data-lucide', 'send');
            transmitIcon.classList.remove('spin-animation');
            if (typeof lucide !== 'undefined') lucide.createIcons();
          }
          transmitLogs.className = 'terminal-log-output error';
          transmitLogs.textContent = "UPLINK FAILURE (NET ERROR)";
          
          setTimeout(() => {
            transmitLogs.className = 'terminal-log-output';
            transmitLogs.textContent = "READY FOR BROADCASTING...";
          }, 6000);
        });
      }, 1500);
    });
  }

  // ==========================================================================
  // Signature Neural Mesh Background Canvas
  // ==========================================================================
  const canvas = document.getElementById('neural-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: null, y: null, radius: 140, isActive: false };
    let particles = [];

    const getParticleCount = () => {
      if (window.innerWidth < 768) return 40;
      return 80;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 1;
        this.color = Math.random() > 0.5 ? '#00f2fe' : '#9d4edd';
        this.depth = Math.random() * 0.6 + 0.2;
        this.alpha = Math.random() * 0.35 + 0.15;
      }

      draw(scrollY) {
        const drawY = (this.y - scrollY * this.depth) % height;
        const adjustedY = drawY < 0 ? height + drawY : drawY;

        ctx.beginPath();
        ctx.arc(this.x, adjustedY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        if (mouse.isActive && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / distance) * force * 0.4;
            this.y += (dy / distance) * force * 0.4;
          }
        }
      }
    }

    const initParticles = () => {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = (scrollY) => {
      const maxDistance = 120;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const p1Y = ((p1.y - scrollY * p1.depth) % height + height) % height;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const p2Y = ((p2.y - scrollY * p2.depth) % height + height) % height;

          const dx = p1.x - p2.x;
          const dy = p1Y - p2Y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1Y);
            ctx.lineTo(p2.x, p2Y);

            const linkAlpha = (1 - distance / maxDistance) * 0.05;
            ctx.strokeStyle = p1.color === p2.color ? p1.color : 'rgba(0,242,254,0.3)';
            ctx.lineWidth = 0.6;
            ctx.globalAlpha = linkAlpha;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const scrollY = window.scrollY;

      particles.forEach(p => {
        p.update();
        p.draw(scrollY);
      });

      connectParticles(scrollY);
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
    });

    window.addEventListener('mouseleave', () => {
      mouse.isActive = false;
    });

    initParticles();
    animate();
  }

});
