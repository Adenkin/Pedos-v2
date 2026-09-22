/* PE-DOS V2 Offline PWA - Full Demo Application */

const STORAGE_KEY = 'pedos_v2_full_data';

const DEFAULT_DATA = {
  profile: { name: 'EXAMPLE USER', role: 'Aspiring Executive / Founder' },
  vision: 'Become a highly competent executive leader and business builder capable of leading complex organisations, creating significant value, and developing other leaders — with strong commercial judgment, negotiation mastery and disciplined execution.',
  competencies: [
    { id: 'c1', domain: 'Self-Leadership', name: 'Discipline & Consistency', current: 3.0, target: 4.5 },
    { id: 'c2', domain: 'Self-Leadership', name: 'Focus & Execution', current: 3.8, target: 4.5 },
    { id: 'c3', domain: 'People Leadership', name: 'Active Listening', current: 3.0, target: 4.5 },
    { id: 'c4', domain: 'People Leadership', name: 'Delegation', current: 3.0, target: 4.5 },
    { id: 'c5', domain: 'Strategic Leadership', name: 'Strategic Thinking', current: 2.8, target: 4.5 },
    { id: 'c6', domain: 'Strategic Leadership', name: 'Scenario Planning', current: 2.0, target: 4.0 },
    { id: 'c7', domain: 'Project Management', name: 'Risk & Stakeholder Mgmt', current: 3.5, target: 4.5 },
    { id: 'c8', domain: 'Negotiation', name: 'Preparation (BATNA/ZOPA)', current: 2.7, target: 4.0 },
    { id: 'c9', domain: 'Sales', name: 'Discovery & Needs Analysis', current: 2.4, target: 3.5 },
    { id: 'c10', domain: 'Communication', name: 'Executive Presence', current: 3.0, target: 4.5 },
    { id: 'c11', domain: 'Financial Intelligence', name: 'Unit Economics & Margins', current: 2.0, target: 4.0 },
    { id: 'c12', domain: 'Decision-Making', name: 'Decision Quality', current: 3.1, target: 4.5 }
  ],
  goals: [
    { id: 'g1', title: 'Close Strategic Thinking gap to ≥3.5', kpi: 'Maturity score', target: '3.5', deadline: '2026-12-31', status: 'ontrack' },
    { id: 'g2', title: 'Raise Negotiation maturity to ≥3.5', kpi: 'Maturity + outcomes', target: '3.5', deadline: '2026-12-31', status: 'ontrack' },
    { id: 'g3', title: 'Build Financial Intelligence to ≥3.5', kpi: 'Maturity score', target: '3.5', deadline: '2026-12-31', status: 'atrisk' },
    { id: 'g4', title: 'Execution Reliability ≥85%', kpi: '% commitments kept', target: '85%', deadline: '2026-12-31', status: 'ontrack' }
  ],
  tasks: [
    { id: 't1', title: 'Complete Strategic Thinking scenario analysis #1', competency: 'Strategic Thinking', due: '2026-03-17', done: false },
    { id: 't2', title: 'Log and debrief next live negotiation', competency: 'Negotiation', due: '2026-03-31', done: false },
    { id: 't3', title: 'Daily journal for 7 consecutive days', competency: 'Self-Leadership', due: '2026-03-22', done: false },
    { id: 't4', title: 'Prepare 360 feedback requests', competency: 'Executive Presence', due: '2026-04-15', done: false }
  ],
  journal: [{
    date: '2026-03-11',
    priorities: '1. Negotiation call  2. 1:1 with report  3. Strategy memo draft',
    accomplished: 'Negotiation held; 1:1 completed',
    failed: 'Memo only 40% done',
    behaviour: 'Asked more questions than spoke in 1:1',
    lesson: 'Silence after offer is powerful; I filled it too fast',
    tomorrow: 'Practice intentional silence in next negotiation'
  }],
  negotiations: [{
    date: '2026-03-11',
    situation: 'Vendor contract renewal — Supplier X',
    objective: 'Reduce annual cost 12% while keeping SLAs',
    batna: 'Switch to alternative supplier (6-week transition)',
    ideal: '15% reduction + improved payment terms',
    outcome: '10% reduction + better payment terms',
    worked: 'Silence after first offer; TCO framing',
    lesson: 'Prepare exact silence protocol; practice more'
  }],
  books: [{
    title: 'Never Split the Difference',
    author: 'Chris Voss',
    category: 'Negotiation',
    lesson: 'Tactical empathy, calibrated questions, silence',
    action: 'Yes'
  }, {
    title: 'Good Strategy Bad Strategy',
    author: 'Richard Rumelt',
    category: 'Strategy',
    lesson: 'Kernel of strategy: diagnosis, guiding policy, coherent action',
    action: 'Partial'
  }],
  decisions: [{
    date: '2026-02-15',
    title: 'Accept Project Beta workstream lead role',
    context: 'Career exposure vs capacity',
    process: 4,
    outcome: 3,
    lesson: 'Capacity assumption was optimistic — build explicit capacity check'
  }],
  experiments: [{
    date: '2026-03-08',
    behaviour: 'Speak less, listen more in planning meeting',
    situation: 'Team planning meeting',
    hypothesis: 'Better options and ownership will emerge',
    result: '3 new options surfaced; ownership clearer',
    lesson: 'Facilitation > domination for complex problems'
  }],
  failures: [{
    date: '2026-01-20',
    what: 'Missed deadline on cross-functional deliverable',
    cause: 'Over-optimistic capacity estimate + late risk flag',
    lesson: 'Never accept without explicit capacity and dependency review',
    action: 'Capacity checklist before any new commitment',
    implemented: 'Yes'
  }],
  weekly: null
};

let data = null;

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    data = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_DATA));
    if (!raw) saveData();
  } catch (e) {
    data = JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
  // Ensure arrays exist
  ['journal','negotiations','books','decisions','experiments','failures','tasks','goals','competencies'].forEach(k => {
    if (!Array.isArray(data[k])) data[k] = DEFAULT_DATA[k] || [];
  });
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 2200);
}

function statusClass(gap) {
  if (gap > 1.5) return 'red';
  if (gap > 0.6) return 'amber';
  return 'green';
}

function calcOverall() {
  if (!data.competencies.length) return 0;
  const sum = data.competencies.reduce((a, c) => a + Number(c.current), 0);
  return (sum / data.competencies.length).toFixed(1);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function uid(prefix) {
  return prefix + Date.now() + Math.floor(Math.random() * 100);
}

// ---------- RENDERERS ----------
function renderDashboard() {
  const score = calcOverall();
  document.getElementById('overallScore').textContent = score;
  const statusEl = document.getElementById('overallStatus');
  const avgGap = data.competencies.reduce((a, c) => a + (c.target - c.current), 0) / data.competencies.length;
  if (avgGap > 1.5) {
    statusEl.textContent = 'RED — Significant Gaps';
    statusEl.className = 'score-status red';
  } else if (avgGap > 0.7) {
    statusEl.textContent = 'AMBER — Developing';
    statusEl.className = 'score-status amber';
  } else {
    statusEl.textContent = 'GREEN — On Track';
    statusEl.className = 'score-status green';
  }

  document.getElementById('capabilityList').innerHTML = data.competencies.slice(0, 8).map(c => {
    const gap = c.target - c.current;
    const cls = statusClass(gap);
    const pct = Math.min(100, (c.current / 5) * 100);
    return `<div class="cap-row">
      <span class="cap-name">${c.name}</span>
      <div class="cap-bar"><div class="cap-fill ${cls}" style="width:${pct}%"></div></div>
      <span class="cap-score">${Number(c.current).toFixed(1)}</span>
    </div>`;
  }).join('');

  const sorted = [...data.competencies].sort((a, b) => (b.target - b.current) - (a.target - a.current));
  document.getElementById('priorityList').innerHTML = sorted.slice(0, 5).map((c, i) =>
    `<li><strong>${i + 1}. ${c.name}</strong> — Gap ${(c.target - c.current).toFixed(1)}</li>`
  ).join('');

  document.getElementById('statTasks').textContent = data.tasks.filter(t => !t.done).length;
  document.getElementById('statJournal').textContent = data.journal.length;
  document.getElementById('statNeg').textContent = data.negotiations.length;
  document.getElementById('statBooks').textContent = data.books.length;
}

function renderCompetency() {
  const list = document.getElementById('competencyList');
  list.innerHTML = data.competencies.map(c => {
    const gap = (c.target - c.current).toFixed(1);
    const gapCls = statusClass(c.target - c.current);
    return `<div class="comp-item" data-id="${c.id}">
      <div class="comp-domain">${c.domain}</div>
      <div class="comp-name">${c.name}</div>
      <div class="comp-scores">
        <div><label>Current</label><input type="number" min="1" max="5" step="0.1" value="${c.current}" data-field="current" class="input comp-input" /></div>
        <div><label>Target</label><input type="number" min="1" max="5" step="0.1" value="${c.target}" data-field="target" class="input comp-input" /></div>
        <div><label>Gap</label><input type="text" value="${gap}" class="input" readonly style="background:#f0f0f0" /></div>
      </div>
      <span class="gap-badge ${gapCls === 'red' ? 'high' : gapCls === 'amber' ? 'med' : 'low'}">
        ${gapCls === 'red' ? 'HIGH PRIORITY' : gapCls === 'amber' ? 'MEDIUM' : 'LOW'}
      </span>
    </div>`;
  }).join('');

  list.querySelectorAll('.comp-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const item = e.target.closest('.comp-item');
      const comp = data.competencies.find(c => c.id === item.dataset.id);
      if (comp) {
        comp[e.target.dataset.field] = Math.min(5, Math.max(1, parseFloat(e.target.value) || 1));
        saveData();
        renderCompetency();
        toast('Competency updated');
      }
    });
  });
}

function renderGoals() {
  document.getElementById('visionText').value = data.vision || '';
  const deadlineInput = document.getElementById('newGoalDeadline');
  if (deadlineInput && !deadlineInput.value) deadlineInput.value = today();
  document.getElementById('goalsList').innerHTML = data.goals.map(g => `
    <div class="goal-item">
      <h4>${g.title}</h4>
      <div class="meta">KPI: ${g.kpi} · Target: ${g.target} · Due: ${g.deadline}</div>
      <span class="status-pill ${g.status}">${g.status === 'ontrack' ? 'On Track' : g.status === 'atrisk' ? 'At Risk' : 'Done'}</span>
      <button class="delete-btn" data-id="${g.id}">Delete</button>
    </div>`).join('');

  document.querySelectorAll('#goalsList .delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      data.goals = data.goals.filter(g => g.id !== btn.dataset.id);
      saveData(); renderGoals(); renderDashboard(); toast('Goal removed');
    });
  });
}

function renderTasks() {
  const dueInput = document.getElementById('newTaskDue');
  if (dueInput && !dueInput.value) dueInput.value = today();
  document.getElementById('tasksList').innerHTML = data.tasks.map(t => `
    <div class="task-item ${t.done ? 'done' : ''}">
      <button class="check-btn ${t.done ? 'checked' : ''}" data-id="${t.id}">${t.done ? '✓' : ''}</button>
      <h4>${t.title}</h4>
      <div class="meta">${t.competency} · Due ${t.due}</div>
      <button class="delete-btn" data-id="${t.id}">Delete</button>
    </div>`).join('');

  document.querySelectorAll('#tasksList .check-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const task = data.tasks.find(t => t.id === btn.dataset.id);
      if (task) { task.done = !task.done; saveData(); renderTasks(); renderDashboard(); toast(task.done ? 'Completed' : 'Reopened'); }
    });
  });
  document.querySelectorAll('#tasksList .delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      data.tasks = data.tasks.filter(t => t.id !== btn.dataset.id);
      saveData(); renderTasks(); renderDashboard(); toast('Deleted');
    });
  });
}

function renderJournal() {
  document.getElementById('journalDate').value = today();
  const hist = document.getElementById('journalHistory');
  if (!data.journal.length) { hist.innerHTML = '<p class="hint">No entries yet.</p>'; return; }
  hist.innerHTML = [...data.journal].reverse().slice(0, 12).map(j => `
    <div class="journal-entry">
      <div class="date">${j.date}</div>
      <div><strong>Priorities:</strong> ${j.priorities || '—'}</div>
      <div><strong>Lesson:</strong> ${j.lesson || '—'}</div>
    </div>`).join('');
}

function renderNegotiations() {
  document.getElementById('negDate').value = today();
  const hist = document.getElementById('negHistory');
  if (!data.negotiations.length) { hist.innerHTML = '<p class="hint">No negotiations logged.</p>'; return; }
  hist.innerHTML = [...data.negotiations].reverse().map(n => `
    <div class="log-item">
      <div class="date">${n.date} — ${n.situation}</div>
      <div class="meta"><strong>Objective:</strong> ${n.objective || '—'}</div>
      <div class="meta"><strong>Outcome:</strong> ${n.outcome || '—'}</div>
      <div class="meta"><strong>Lesson:</strong> ${n.lesson || '—'}</div>
    </div>`).join('');
}

function renderReading() {
  document.getElementById('bookCount').textContent = data.books.length;
  const withAction = data.books.filter(b => b.action === 'Yes' || b.action === 'Partial').length;
  document.getElementById('actionRate').textContent = data.books.length ? Math.round((withAction / data.books.length) * 100) + '%' : '0%';
  const hist = document.getElementById('bookHistory');
  if (!data.books.length) { hist.innerHTML = '<p class="hint">No books logged.</p>'; return; }
  hist.innerHTML = [...data.books].reverse().map(b => `
    <div class="log-item">
      <h4>${b.title}</h4>
      <div class="meta">${b.author} · ${b.category} · Action: ${b.action}</div>
      <div class="meta"><strong>Lesson:</strong> ${b.lesson || '—'}</div>
    </div>`).join('');
}

function renderDecisions() {
  document.getElementById('decDate').value = today();
  const hist = document.getElementById('decHistory');
  if (!data.decisions.length) { hist.innerHTML = '<p class="hint">No decisions logged.</p>'; return; }
  hist.innerHTML = [...data.decisions].reverse().map(d => `
    <div class="log-item">
      <div class="date">${d.date} — ${d.title}</div>
      <div class="meta">Process: ${d.process}/5 · Outcome: ${d.outcome}/5</div>
      <div class="meta"><strong>Lesson:</strong> ${d.lesson || '—'}</div>
    </div>`).join('');
}

function renderExperiments() {
  document.getElementById('expDate').value = today();
  const hist = document.getElementById('expHistory');
  if (!data.experiments.length) { hist.innerHTML = '<p class="hint">No experiments yet.</p>'; return; }
  hist.innerHTML = [...data.experiments].reverse().map(e => `
    <div class="log-item">
      <div class="date">${e.date} — ${e.behaviour}</div>
      <div class="meta"><strong>Result:</strong> ${e.result || '—'}</div>
      <div class="meta"><strong>Lesson:</strong> ${e.lesson || '—'}</div>
    </div>`).join('');
}

function renderFailures() {
  document.getElementById('failDate').value = today();
  const hist = document.getElementById('failHistory');
  if (!data.failures.length) { hist.innerHTML = '<p class="hint">No failures logged (yet).</p>'; return; }
  hist.innerHTML = [...data.failures].reverse().map(f => `
    <div class="log-item">
      <div class="date">${f.date}</div>
      <div class="meta"><strong>What:</strong> ${f.what || '—'}</div>
      <div class="meta"><strong>Lesson:</strong> ${f.lesson || '—'}</div>
      <div class="meta"><strong>Implemented:</strong> ${f.implemented || 'No'}</div>
    </div>`).join('');
}

function renderSettings() {
  document.getElementById('userName').value = data.profile.name || '';
  document.getElementById('userRole').value = data.profile.role || '';
}

// ---------- NAV ----------
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  const nav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (nav) nav.classList.add('active');

  const titles = {
    dashboard: 'Dashboard', competency: 'Competency Matrix', goals: 'Goals',
    journal: 'Daily Journal', tasks: 'Tasks', negotiation: 'Negotiation',
    reading: 'Reading', decisions: 'Decisions', practice: 'Leadership Lab',
    failures: 'Failures & Lessons', weekly: 'Weekly Review', settings: 'Settings'
  };
  document.getElementById('pageTitle').textContent = titles[pageId] || 'PE-DOS';

  const renderMap = {
    dashboard: renderDashboard, competency: renderCompetency, goals: renderGoals,
    journal: renderJournal, tasks: renderTasks, negotiation: renderNegotiations,
    reading: renderReading, decisions: renderDecisions, practice: renderExperiments,
    failures: renderFailures, settings: renderSettings
  };
  if (renderMap[pageId]) renderMap[pageId]();
  closeNav();
}

function openNav() {
  document.getElementById('sidenav').classList.add('open');
  document.getElementById('overlay').classList.add('show');
}
function closeNav() {
  document.getElementById('sidenav').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// ---------- EVENTS ----------
function bindEvents() {
  document.getElementById('menuBtn').addEventListener('click', openNav);
  document.getElementById('overlay').addEventListener('click', closeNav);
  document.getElementById('refreshBtn').addEventListener('click', () => { showPage(document.querySelector('.nav-item.active')?.dataset.page || 'dashboard'); toast('Refreshed'); });

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => { e.preventDefault(); showPage(item.dataset.page); });
  });

  document.getElementById('visionText').addEventListener('change', (e) => {
    data.vision = e.target.value; saveData(); toast('Vision saved');
  });

  document.getElementById('addGoalBtn').addEventListener('click', () => {
    const title = (document.getElementById('newGoalTitle').value || '').trim();
    if (!title) { toast('Please enter a goal title'); return; }
    data.goals.push({
      id: uid('g'),
      title,
      kpi: document.getElementById('newGoalKpi').value || 'TBD',
      target: document.getElementById('newGoalTarget').value || '',
      deadline: document.getElementById('newGoalDeadline').value || today(),
      status: document.getElementById('newGoalStatus').value || 'ontrack'
    });
    saveData();
    renderGoals();
    renderDashboard();
    toast('Goal added');
    document.getElementById('newGoalTitle').value = '';
    document.getElementById('newGoalKpi').value = '';
    document.getElementById('newGoalTarget').value = '';
  });

  document.getElementById('addTaskBtn').addEventListener('click', () => {
    const title = (document.getElementById('newTaskTitle').value || '').trim();
    if (!title) { toast('Please enter a task title'); return; }
    data.tasks.push({
      id: uid('t'),
      title,
      competency: document.getElementById('newTaskComp').value || 'General',
      due: document.getElementById('newTaskDue').value || today(),
      done: false
    });
    saveData();
    renderTasks();
    renderDashboard();
    toast('Task added');
    document.getElementById('newTaskTitle').value = '';
    document.getElementById('newTaskComp').value = '';
  });

  document.getElementById('saveJournalBtn').addEventListener('click', () => {
    const entry = {
      date: document.getElementById('journalDate').value,
      priorities: document.getElementById('journalPriorities').value,
      accomplished: document.getElementById('journalAccomplished').value,
      failed: document.getElementById('journalFailed').value,
      behaviour: document.getElementById('journalBehaviour').value,
      lesson: document.getElementById('journalLesson').value,
      tomorrow: document.getElementById('journalTomorrow').value
    };
    data.journal = data.journal.filter(j => j.date !== entry.date);
    data.journal.push(entry);
    saveData(); renderJournal(); renderDashboard(); toast('Journal saved');
  });

  document.getElementById('saveNegBtn').addEventListener('click', () => {
    data.negotiations.push({
      date: document.getElementById('negDate').value,
      situation: document.getElementById('negSituation').value,
      objective: document.getElementById('negObjective').value,
      batna: document.getElementById('negBatna').value,
      ideal: document.getElementById('negIdeal').value,
      outcome: document.getElementById('negOutcome').value,
      worked: document.getElementById('negWorked').value,
      lesson: document.getElementById('negLesson').value
    });
    saveData(); renderNegotiations(); renderDashboard(); toast('Negotiation logged');
    ['negSituation','negObjective','negBatna','negIdeal','negOutcome','negWorked','negLesson'].forEach(id => document.getElementById(id).value = '');
  });

  document.getElementById('saveBookBtn').addEventListener('click', () => {
    const title = document.getElementById('bookTitle').value.trim();
    if (!title) { toast('Enter a title'); return; }
    data.books.push({
      title,
      author: document.getElementById('bookAuthor').value,
      category: document.getElementById('bookCategory').value,
      lesson: document.getElementById('bookLesson').value,
      action: document.getElementById('bookAction').value
    });
    saveData(); renderReading(); renderDashboard(); toast('Book saved');
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
    document.getElementById('bookLesson').value = '';
  });

  document.getElementById('saveDecBtn').addEventListener('click', () => {
    const title = document.getElementById('decTitle').value.trim();
    if (!title) { toast('Enter decision'); return; }
    data.decisions.push({
      date: document.getElementById('decDate').value,
      title,
      context: document.getElementById('decContext').value,
      process: Number(document.getElementById('decProcess').value) || 3,
      outcome: Number(document.getElementById('decOutcome').value) || 3,
      lesson: document.getElementById('decLesson').value
    });
    saveData(); renderDecisions(); toast('Decision logged');
    document.getElementById('decTitle').value = '';
    document.getElementById('decContext').value = '';
    document.getElementById('decLesson').value = '';
  });

  document.getElementById('saveExpBtn').addEventListener('click', () => {
    const behaviour = document.getElementById('expBehaviour').value.trim();
    if (!behaviour) { toast('Enter behaviour'); return; }
    data.experiments.push({
      date: document.getElementById('expDate').value,
      behaviour,
      situation: document.getElementById('expSituation').value,
      hypothesis: document.getElementById('expHypothesis').value,
      result: document.getElementById('expResult').value,
      lesson: document.getElementById('expLesson').value
    });
    saveData(); renderExperiments(); toast('Experiment saved');
    ['expBehaviour','expSituation','expHypothesis','expResult','expLesson'].forEach(id => document.getElementById(id).value = '');
  });

  document.getElementById('saveFailBtn').addEventListener('click', () => {
    const what = document.getElementById('failWhat').value.trim();
    if (!what) { toast('Describe what happened'); return; }
    data.failures.push({
      date: document.getElementById('failDate').value,
      what,
      cause: document.getElementById('failCause').value,
      lesson: document.getElementById('failLesson').value,
      action: document.getElementById('failAction').value,
      implemented: document.getElementById('failImplemented').value
    });
    saveData(); renderFailures(); toast('Lesson saved');
    ['failWhat','failCause','failLesson','failAction'].forEach(id => document.getElementById(id).value = '');
  });

  document.getElementById('saveWeeklyBtn').addEventListener('click', () => {
    data.weekly = {
      ending: document.getElementById('weekEnding').value,
      achievements: document.getElementById('weekAchievements').value,
      missed: document.getElementById('weekMissed').value,
      leadership: document.getElementById('weekLeadership').value,
      priorities: document.getElementById('weekPriorities').value,
      devAreas: document.getElementById('weekDevAreas').value
    };
    saveData(); toast('Weekly review saved');
  });

  document.getElementById('saveProfileBtn').addEventListener('click', () => {
    data.profile.name = document.getElementById('userName').value;
    data.profile.role = document.getElementById('userRole').value;
    saveData(); toast('Profile saved');
  });

  document.getElementById('exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pedos-v2-backup-' + today() + '.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('Exported');
  });

  document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
  document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        data = JSON.parse(ev.target.result);
        saveData();
        showPage('dashboard');
        toast('Imported successfully');
      } catch (err) { toast('Invalid file'); }
    };
    reader.readAsText(file);
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Reset all data to demo defaults? This cannot be undone.')) {
      data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      saveData();
      showPage('dashboard');
      toast('Reset complete');
    }
  });
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function init() {
  loadData();
  bindEvents();
  showPage('dashboard');
  setTimeout(() => {
    document.getElementById('splash').classList.add('hide');
    document.getElementById('app').classList.remove('hidden');
  }, 850);
  registerSW();
}

document.addEventListener('DOMContentLoaded', init);
