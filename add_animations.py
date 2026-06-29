import os
import subprocess
import time

css_snippets = [
    "\n/* Animation 1 */\n.stat-item:hover { transform: translateY(-5px) scale(1.05); transition: transform 0.4s var(--ease); }\n",
    "\n/* Animation 2 */\n.nav-links a:hover { color: var(--cyan); text-shadow: 0 0 8px var(--cyan-glow); transition: all 0.3s ease; }\n",
    "\n/* Animation 3 */\n.featured-card:hover { transform: scale(1.02) translateY(-5px); transition: transform 0.4s var(--ease); }\n",
    "\n/* Animation 4 */\n.tech-tag:hover { background: var(--cyan-glow); color: #fff; transition: background 0.3s ease, color 0.3s ease; }\n",
    "\n/* Animation 5 */\n@keyframes floatSoft { 0% { transform: translateY(0px); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0px); } }\n.stat-icon { animation: floatSoft 3s ease-in-out infinite; }\n",
    "\n/* Animation 6 */\n@keyframes pulseGlow { 0% { text-shadow: 0 0 5px var(--purple-glow); } 50% { text-shadow: 0 0 20px var(--purple-glow); } 100% { text-shadow: 0 0 5px var(--purple-glow); } }\n.footer-name { animation: pulseGlow 2.5s infinite; }\n",
    "\n/* Animation 7 */\n.hero-card:hover { box-shadow: 0 0 30px var(--purple-glow); transition: box-shadow 0.4s ease; }\n",
    "\n/* Animation 8 */\n.featured-card-title:hover { text-shadow: 0 0 12px var(--cyan-glow); transition: text-shadow 0.3s ease; }\n"
]

file_path = "styles.css"
for i, snippet in enumerate(css_snippets):
    with open(file_path, "a") as f:
        f.write(snippet)
    
    subprocess.run(["git", "add", "styles.css"])
    subprocess.run(["git", "commit", "-m", f"Add attractive animation effect {i+1}"])
    subprocess.run(["git", "push"])
    time.sleep(2)
