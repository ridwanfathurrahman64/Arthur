(() => {
      const iconPaths = {
        home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"/>',
        wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18m-5 5h2"/>',
        receipt: '<path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z"/><path d="M9 8h6m-6 4h6"/>',
        chart: '<path d="M4 19V5m0 14h17"/><path d="m7 15 4-5 3 3 5-7"/>',
        users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
        shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
        file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8m-8 4h8"/>',
        plus: '<path d="M12 5v14m-7-7h14"/>',
        search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/>',
        bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4"/>',
        arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
        download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3"/>'
      };
      const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.home}</svg>`;
      const safe = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
      const money = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value).replace(/\u00a0/g, ' ');
      const roleNames = { student: 'Mahasiswa', admin: 'Admin', manager: 'Manager Controlling' };
      const people = [
        { name: 'Ridwan', email: 'ridwan1@gmail.com', balance: 4000000, budget: 5000000, spent: 4600000, role: 'Mahasiswa', status: 'Aktif' },
        { name: 'Fathur', email: 'fathur@gmail.com', balance: 15000000, budget: 7000000, spent: 2450000, role: 'Mahasiswa', status: 'Aktif' },
        { name: 'Rahman', email: 'rahman@gmail.com', balance: 10000000, budget: 4000000, spent: 2600000, role: 'Mahasiswa', status: 'Aktif' },
        { name: 'Yoten', email: 'yoten1@gmail.com', balance: 0, budget: 0, spent: 0, role: 'Manager Controlling', status: 'Aktif' }
      ];
      const transactions = [
        { date: '04/11/2026', description: 'Makan siang', category: 'Makan', type: 'Pengeluaran', amount: 12000 },
        { date: '04/11/2026', description: 'Belanja bulanan', category: 'Keperluan pribadi', type: 'Pengeluaran', amount: 120000 },
        { date: '04/11/2026', description: 'Uang saku', category: 'Uang saku', type: 'Pemasukan', amount: 1200000 }
      ];
      const adminPersonalTransactions = [
        { date: '04/11/2026', type: 'Pemasukan', description: 'Uang Bulanan', category: 'Uang Bulanan', amount: 5000000, isInitial: true }
      ];
      const budgets = [
        { category: 'Makan', limit: 20000, spent: 12000 },
        { category: 'Belanja bulanan', limit: 150000, spent: 120000 },
        { category: 'Uang saku', limit: 1300000, spent: 1200000 }
      ];
      const navSets = {
        student: [
          { id: 'dashboard', title: 'Dashboard Pribadi' },
          { id: 'transactions', title: 'Transaksi' },
          { id: 'budgets', title: 'Kategori dan Anggaran' }
        ],
        admin: [
          { id: 'personal', title: 'Keuangan pribadi' },
          { id: 'monitor', title: 'Pantau Mahasiswa' },
          { id: 'accounts', title: 'Akun dan Peran' }
        ],
        manager: [
          { id: 'overview', title: 'Ringkasan Gabungan' },
          { id: 'students', title: 'Ringkasan Mahasiswa' },
          { id: 'reports', title: 'Laporan dan Tren' }
        ]
      };
      const state = { role: 'student', page: 'dashboard', transactionFilter: 'Semua jenis', transactionCategory: 'Semua kategori', transactionMonth: 'Semua bulan', studentQuery: '', accountQuery: '', txQuery: '', categoryFilter: 'Semua kategori' };
      const byId = (id) => document.getElementById(id);
      const totalIncome = () => transactions.filter((item) => item.type === 'Pemasukan').reduce((sum, item) => sum + item.amount, 0) + 3800000;
      const totalExpense = () => transactions.filter((item) => item.type === 'Pengeluaran').reduce((sum, item) => sum + item.amount, 0) + 868000;
      const totalBudget = () => budgets.reduce((sum, item) => sum + item.limit, 0);
      const totalSpent = () => budgets.reduce((sum, item) => sum + item.spent, 0);
      const balance = () => totalIncome() - totalExpense();
      const usagePercent = (spent, limit) => limit > 0 ? Math.round(spent / limit * 100) : 0;
      const currentTransactions = () => state.role === 'admin' && state.page === 'personal' ? adminPersonalTransactions : transactions;
      const transactionMonth = (date) => {
        const [day, month, year] = date.split('/');
        return `${year}-${month}`;
      };
      const monthLabel = (month) => {
        const [year, value] = month.split('-');
        return new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(new Date(Number(year), Number(value) - 1, 1));
      };
      const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
      };
      const statCard = (label, value) => `<article class="stat-card"><div class="stat-top">${label}</div><div class="stat-value">${value}</div></article>`;
      const panel = (title, body, className = '', subtitle = '') => `<section class="panel ${className}"><div class="panel-heading"><div><h2 class="panel-title">${title}</h2>${subtitle ? `<p class="panel-subtitle">${subtitle}</p>` : ''}</div></div>${body}</section>`;
      const table = (headers, rows, emptyText = 'Belum ada data untuk ditampilkan.', className = '') => `<div class="table-wrap ${className}"><table><thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead><tbody>${rows || `<tr><td class="empty" colspan="${headers.length}">${emptyText}</td></tr>`}</tbody></table></div>`;

      function setRole(role) {
        state.role = role;
        state.page = navSets[role][0].id;
        render();
      }

      function renderShell() {
        const nav = navSets[state.role];
        const defaults = { student: { name: 'Ridwan Fathurrahman', initials: 'RF' }, admin: { name: 'Ridwan Fathurrahman', initials: 'RF' }, manager: { name: 'Rahmadi Yotenika', initials: 'RY' } };
        const name = defaults[state.role].name;
        const user = { name, initials: name.split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || defaults[state.role].initials };
        byId('nav-label').textContent = `Menu ${roleNames[state.role]}`;
        byId('navigation').innerHTML = nav.map((item) => `<button type="button" class="nav-button ${item.id === state.page ? 'active' : ''}" data-page="${item.id}" aria-current="${item.id === state.page ? 'page' : 'false'}"><span>${item.title}</span></button>`).join('');
        byId('profile-name').textContent = user.name;
        byId('profile-avatar').textContent = user.initials;
        byId('profile-role').textContent = 'Akun aktif';
      }

      function renderDashboard() {
        const stats = `<div class="stats dashboard-stats">${statCard('Total Pemasukan', money(totalIncome()))}${statCard('Total Pengeluaran', money(totalExpense()))}${statCard('Total Saldo', money(balance()))}</div>`;
        const categories = [
          { name: 'Kebutuhan pribadi', amount: 0 },
          { name: 'Transportasi', amount: 0 },
          { name: 'Tagihan', amount: 0 }
        ].map((item) => `<div class="meter-row"><div class="meter-label"><span>${item.name}</span><small>0% dari pengeluaran</small></div><div class="meter"><span style="width:0%"></span></div><div class="meter-foot"><span>Rp 0</span></div></div>`).join('');
        return `${stats}${panel('Pengeluaran per kategori', categories, 'dashboard-panel')}`;
      }

      function renderTransactions() {
        const source = currentTransactions();
        const categories = [...new Set(source.map((item) => item.category))];
        const months = [...new Set(source.map((item) => transactionMonth(item.date)))].sort().reverse();
        const filtered = source.filter((item) =>
          (state.transactionFilter === 'Semua jenis' || item.type === state.transactionFilter) &&
          (state.transactionCategory === 'Semua kategori' || item.category === state.transactionCategory) &&
          (state.transactionMonth === 'Semua bulan' || transactionMonth(item.date) === state.transactionMonth) &&
          `${item.date} ${item.description} ${item.category} ${item.type} ${item.amount} ${money(item.amount)}`.toLowerCase().includes(state.txQuery.toLowerCase())
        );
        const rows = filtered.slice().reverse().map((item) => `<tr><td>${safe(item.date)}</td><td class="strong">${safe(item.description)}</td><td>${safe(item.category)}</td><td><span class="badge ${item.type === 'Pemasukan' ? 'income' : 'expense'}">${safe(item.type)}</span></td><td class="strong">${money(item.amount)}</td></tr>`).join('');
        return `<div class="stats transaction-stats">${statCard('Pemasukan', money(totalIncome()))}${statCard('Pengeluaran', money(totalExpense()))}${statCard('Saldo', money(balance()))}</div><div class="page-action"><button class="button" data-modal="transaction">+Tambah transaksi</button></div>${panel('Riwayat Transaksi', `<div class="toolbar transaction-toolbar"><select id="tx-category-filter" aria-label="Filter kategori"><option>Semua kategori</option>${categories.map((category) => `<option ${state.transactionCategory === category ? 'selected' : ''}>${safe(category)}</option>`).join('')}</select><select id="tx-filter" aria-label="Filter jenis transaksi"><option>Semua jenis</option><option ${state.transactionFilter === 'Pemasukan' ? 'selected' : ''}>Pemasukan</option><option ${state.transactionFilter === 'Pengeluaran' ? 'selected' : ''}>Pengeluaran</option></select><select id="tx-month-filter" aria-label="Filter bulan"><option value="Semua bulan">Semua bulan</option>${months.map((month) => `<option value="${month}" ${state.transactionMonth === month ? 'selected' : ''}>${safe(monthLabel(month))}</option>`).join('')}</select><input id="tx-search" type="search" placeholder="Search" value="${safe(state.txQuery)}" aria-label="Cari transaksi"></div>${table(['Tanggal', 'Deskripsi', 'Kategori', 'Jenis', 'Nominal'], rows, 'Transaksi tidak ditemukan.')}`, 'transaction-panel')}`;
      }

      function renderBudgets() {
        const filtered = budgets.filter((item) => (state.categoryFilter === 'Semua kategori' || item.category === state.categoryFilter) && item.category.toLowerCase().includes(state.studentQuery.toLowerCase()));
        const rows = filtered.map((item) => {
          const percent = Math.min(100, usagePercent(item.spent, item.limit));
          const left = Math.max(0, item.limit - item.spent);
          return `<tr><td><strong>${safe(item.category)}</strong><div class="meter" style="width:95px;margin-top:7px"><span class="warning" style="width:${percent}%"></span></div></td><td>${money(item.limit)}</td><td>${money(item.spent)}</td><td>${money(left)}</td><td><span class="badge ${percent >= 80 ? 'warning' : 'safe'}">${percent >= 80 ? 'Mendekati Batas' : 'Aman'}</span></td></tr>`;
        }).join('');
        const alerts = budgets.filter((item) => item.limit > 0 && item.spent / item.limit >= .8);
        const alertSummary = alerts.map((item) => `${item.category} ${usagePercent(item.spent, item.limit)}%`).join(', ');
        const notice = alerts.length ? `<div class="notice budget-notice">${icon('bell')}<div><strong>${alerts.length} kategori mendekati batas</strong><p>${safe(alertSummary)}. Kategori lain masih aman.</p></div></div>` : '';
        const spent = totalSpent();
        const remaining = budgets.reduce((sum, item) => sum + Math.max(0, item.limit - item.spent), 0);
        return `<div class="stats">${statCard('Total batas anggaran', money(totalBudget()))}${statCard('Anggaran terpakai', money(spent))}${statCard('Sisa anggaran', money(remaining))}</div><div class="page-action budget-page-action"><button class="button" data-modal="budget">+ Tambah Anggaran</button></div>${notice}${panel('Detail Anggaran', `<div class="toolbar budget-toolbar"><select id="budget-filter" aria-label="Filter kategori"><option>Semua kategori</option>${budgets.map((item) => `<option ${state.categoryFilter === item.category ? 'selected' : ''}>${safe(item.category)}</option>`).join('')}</select><input id="budget-search" type="search" placeholder="Cari kategori..." value="${safe(state.studentQuery)}" aria-label="Cari kategori anggaran"></div>${table(['Kategori/persen', 'Batas', 'Terpakai', 'Sisa', 'Status'], rows, 'Kategori tidak ditemukan.', 'budget-table-wrap')}`)}`;
      }

      function renderAdminPersonal() {
        const source = adminPersonalTransactions;
        const rows = source.filter((item) => `${item.date} ${item.type} ${item.description} ${item.category} ${item.amount}`.toLowerCase().includes(state.txQuery.toLowerCase())).map((item) => `<tr><td>${safe(item.date)}</td><td>${safe(item.type)}</td><td>${safe(item.description)}</td><td>${safe(item.category)}</td><td>${money(item.amount)}</td></tr>`).join('');
        const added = source.filter((item) => !item.isInitial);
        const income = 5000000 + added.filter((item) => item.type === 'Pemasukan').reduce((sum, item) => sum + item.amount, 0);
        const expense = 1000000 + added.filter((item) => item.type === 'Pengeluaran').reduce((sum, item) => sum + item.amount, 0);
        return `<div class="admin-personal"><div class="stats">${statCard('Total Pemasukan', money(income))}${statCard('Total Pengeluaran', money(expense))}${statCard('Total Saldo', money(income - expense))}</div><div class="page-action"><button class="button" data-modal="transaction">+ Tambah transaksi</button></div>${panel('Detail Transaksi', `<div class="toolbar entity-search"><input id="tx-search" type="search" placeholder="Cari transaksi..." value="${safe(state.txQuery)}" aria-label="Cari transaksi"></div>${table(['Tanggal', 'Jenis', 'Deskripsi', 'Kategori', 'Nominal'], rows, 'Transaksi tidak ditemukan.')}`)}</div>`;
      }

      function renderMonitor() {
        const students = people.filter((person) => person.role === 'Mahasiswa');
        const filtered = students.filter((person) => `${person.name} ${person.email}`.toLowerCase().includes(state.studentQuery.toLowerCase()));
        const rows = filtered.map((person) => {
          const percent = usagePercent(person.spent, person.budget);
          return `<tr><td>${safe(person.name)}</td><td>${money(person.name === 'Ridwan' ? 2000000 : person.balance)}</td><td>${percent}%</td><td>${percent >= 80 ? 'PERLU PERHATIAN' : 'AMAN'}</td></tr>`;
        }).join('');
        const safeCount = students.filter((person) => usagePercent(person.spent, person.budget) < 80).length;
        return `<div class="stats">${statCard('Mahasiswa dipantau', `${students.length} Mahasiswa`)}${statCard('Anggaran aman', `${safeCount} Mahasiswa`)}${statCard('Perlu perhatian', `${students.length - safeCount} Mahasiswa`)}</div>${panel('Daftar Mahasiswa', `<div class="toolbar entity-search"><input id="student-search" type="search" placeholder="Cari mahasiswa..." value="${safe(state.studentQuery)}" aria-label="Cari mahasiswa"></div>${table(['Mahasiswa', 'Saldo', 'Anggaran', 'Status'], rows, 'Mahasiswa tidak ditemukan.')}`)}`;
      }

      function renderAccounts() {
        const shownAccounts = people.filter((person) => ['Ridwan', 'Yoten'].includes(person.name) || person.isNewAccount);
        const filtered = shownAccounts.filter((p) => `${p.name} ${p.email} ${p.role}`.toLowerCase().includes(state.accountQuery.toLowerCase()));
        const rows = filtered.map((person) => `<tr><td>${safe(person.name)}</td><td>${safe(person.email)}</td><td>${safe(person.role)}</td><td>${safe(person.status.toUpperCase())}</td></tr>`).join('');
        const active = shownAccounts.filter((p) => p.status === 'Aktif').length;
        return `<div class="stats">${statCard('Total Akun', `${shownAccounts.length} Akun`)}${statCard('Akun Aktif', `${active} Akun`)}${statCard('Akun Nonaktif', `${shownAccounts.length - active} Akun`)}</div><div class="page-action"><button class="button" data-modal="account">+ Tambah akun</button></div>${panel('Daftar Akun', `<div class="toolbar entity-search"><input id="account-search" type="search" placeholder="Cari nama, email, atau peran..." value="${safe(state.accountQuery)}" aria-label="Cari akun"></div>${table(['Nama', 'Email', 'Peran', 'Status'], rows, 'Akun tidak ditemukan.')}`)}`;
      }

      function chartSvg() {
        const chartData = [
          { month: 'Sep 2026', income: 5, expense: 1 },
          { month: 'Okt 2026', income: 2, expense: 4 },
          { month: 'Nov 2026', income: 6, expense: 2 }
        ];
        const chartTop = 38;
        const chartBottom = 176;
        const chartHeight = chartBottom - chartTop;
        const ticks = [0, 2, 4, 6];
        const lines = ticks.map((value) => {
          const y = chartBottom - value / 6 * chartHeight;
          return `<line x1="42" y1="${y}" x2="412" y2="${y}" stroke="#cfd6d0" stroke-width="1"/><text x="10" y="${y + 4}" fill="#89948c" font-size="10">${value}</text>`;
        }).join('');
        const bars = chartData.map((item, index) => {
          const x = 68 + index * 116;
          const incomeHeight = item.income / 6 * chartHeight;
          const expenseHeight = item.expense / 6 * chartHeight;
          return `<rect x="${x}" y="${chartBottom - incomeHeight}" width="43" height="${incomeHeight}" rx="3" fill="#54b900"/><rect x="${x + 48}" y="${chartBottom - expenseHeight}" width="43" height="${expenseHeight}" rx="3" fill="#28590b"/><text x="${x + 45}" y="198" text-anchor="middle" fill="#76837a" font-size="10">${item.month}</text>`;
        }).join('');
        return `<svg viewBox="0 0 430 214" role="img" aria-label="Grafik pemasukan dan pengeluaran tiga bulan terakhir">${lines}${bars}<line x1="42" y1="${chartBottom}" x2="412" y2="${chartBottom}" stroke="#cfd6d0" stroke-width="1.2"/></svg>`;
      }

      function categoryChartSvg() {
        const categories = [
          { name: 'Makan', value: 5, color: '#54b900' },
          { name: 'Transportasi', value: 2, color: '#7b906e' },
          { name: 'Belanja Bulanan', value: 4, color: '#28590b' },
          { name: 'Uang saku', value: 2, color: '#20271d' },
          { name: 'Kuliah', value: 6, color: '#b09a23' },
          { name: 'Jajan', value: 2, color: '#6cf500' }
        ];
        const chartTop = 16;
        const chartBottom = 148;
        const chartHeight = chartBottom - chartTop;
        const ticks = [0, 2, 4, 6];
        const lines = ticks.map((value) => {
          const y = chartBottom - value / 6 * chartHeight;
          return `<line x1="42" y1="${y}" x2="588" y2="${y}" stroke="#cfd6d0" stroke-width="1"/><text x="10" y="${y + 4}" fill="#89948c" font-size="10">${value}</text>`;
        }).join('');
        const bars = categories.map((item, index) => {
          const x = 52 + index * 89;
          const height = item.value / 6 * chartHeight;
          return `<rect x="${x}" y="${chartBottom - height}" width="44" height="${height}" rx="3" fill="${item.color}"/><text x="${x + 22}" y="164" text-anchor="middle" fill="#76837a" font-size="10">${item.name}</text>`;
        }).join('');
        return `<svg viewBox="0 0 600 174" role="img" aria-label="Tren kategori keuangan mahasiswa">${lines}${bars}<line x1="42" y1="${chartBottom}" x2="588" y2="${chartBottom}" stroke="#cfd6d0" stroke-width="1.2"/></svg>`;
      }

      function renderManagerOverview() {
        const chart = `<div class="chart-legend"><span class="legend-item"><i class="legend-dot" style="background:#54b900"></i>Pemasukan</span><span class="legend-item"><i class="legend-dot" style="background:#28590b"></i>Pengeluaran</span></div><div class="chart">${chartSvg()}</div>`;
        return `<div class="manager-overview"><div class="stats four">${statCard('Total Pemasukan', money(totalIncome()))}${statCard('Total Pengeluaran', money(totalExpense()))}${statCard('Rata-rata Saldo', money(1000000))}${statCard('Pemakaian Anggaran', money(4000000))}</div><h2 class="overview-title">Ringkasan Gabungan Mahasiswa</h2><div class="chart-panel">${panel('', chart, 'overview-chart-panel')}</div></div>`;
      }

      function renderManagerStudents() {
        const students = people.filter((person) => person.role === 'Mahasiswa');
        const studentRows = students.filter((person) => `${person.name} ${person.email}`.toLowerCase().includes(state.studentQuery.toLowerCase())).map((person) => {
          const percent = usagePercent(person.spent, person.budget);
          const expense = { Ridwan: 1000000, Fathur: 3000000, Rahman: 6500000 }[person.name] || person.spent;
          return `<tr><td>${safe(person.name)}</td><td>${money(person.balance)}</td><td>${money(person.budget)}</td><td>${money(expense)}</td><td>${percent}%</td></tr>`;
        }).join('');
        const alerts = students.filter((person) => usagePercent(person.spent, person.budget) >= 80).length;
        return `<div class="stats four">${statCard('Mahasiswa', `${students.length} Mahasiswa`)}${statCard('Rata-rata Saldo', money(4000000))}${statCard('Total Sisa Anggaran', money(1000000))}${statCard('Perlu Perhatian', `${alerts} Mahasiswa`)}</div>${panel('Ringkasan Keuangan Mahasiswa', `<div class="toolbar"><input id="student-search" type="search" placeholder="Cari mahasiswa..." value="${safe(state.studentQuery)}" aria-label="Cari mahasiswa"></div>${table(['Mahasiswa', 'Saldo Akhir', 'Anggaran', 'Pengeluaran', 'Terpakai'], studentRows, 'Mahasiswa tidak ditemukan.')}`)}`;
      }

      function renderReports() {
        const chart = `<div class="chart-legend"><span class="legend-item"><i class="legend-dot" style="background:#54b900"></i>Pemasukan</span><span class="legend-item"><i class="legend-dot" style="background:#28590b"></i>Pengeluaran</span></div><div class="chart">${categoryChartSvg()}</div>`;
        return `<div class="manager-reports"><div class="stats four">${statCard('Total Pemasukan', money(totalIncome()))}${statCard('Total Pengeluaran', money(totalExpense()))}${statCard('Rata-rata Saldo', money(1000000))}${statCard('Pemakaian Anggaran', money(4000000))}</div><h2 class="reports-title">Tren Kategori Keuangan Mahasiswa</h2><div class="reports-chart-panel">${panel('', chart, 'reports-category-panel')}</div></div>`;
      }

      function render() {
        renderShell();
        let content;
        if (state.role === 'student') content = state.page === 'transactions' ? renderTransactions() : state.page === 'budgets' ? renderBudgets() : renderDashboard();
        else if (state.role === 'admin') content = state.page === 'personal' ? renderAdminPersonal() : state.page === 'monitor' ? renderMonitor() : state.page === 'accounts' ? renderAccounts() : renderDashboard();
        else if (state.page === 'students') content = renderManagerStudents();
        else if (state.page === 'reports') content = renderReports();
        else content = renderManagerOverview();
        byId('view').innerHTML = content;
      }

      function showToast(message) {
        byId('toast-root').innerHTML = `<div class="toast" role="status">${safe(message)}</div>`;
        window.setTimeout(() => { byId('toast-root').innerHTML = ''; }, 3000);
      }

      function openModal(kind) {
        const transactionCategories = state.role === 'admin'
          ? [...new Set(adminPersonalTransactions.map((item) => item.category))]
          : [...new Set([...budgets.map((item) => item.category), 'Keperluan pribadi'])];
        const today = new Date();
        const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const configs = {
          transaction: {
            title: 'Tambah transaksi',
            fields: `<div class="field full"><label for="date">Tanggal transaksi</label><input id="date" name="date" type="date" value="${todayValue}" required></div><div class="field full"><label for="description">Deskripsi</label><input id="description" name="description" required maxlength="70" placeholder="Contoh: Belanja makan"></div><div class="field"><label for="category">Kategori</label><select id="category" name="category" required>${transactionCategories.map((category) => `<option>${safe(category)}</option>`).join('')}</select></div><div class="field"><label for="type">Jenis transaksi</label><select id="type" name="type"><option>Pengeluaran</option><option>Pemasukan</option></select></div><div class="field full"><label for="amount">Nominal (Rp)</label><input id="amount" name="amount" type="text" inputmode="numeric" pattern="[0-9]+" required placeholder="50000"></div>`
          },
          budget: {
            title: 'Tambah anggaran',
            fields: `<div class="field full"><label for="category">Nama kategori</label><input id="category" name="category" required maxlength="40" placeholder="Contoh: Transportasi"></div><div class="field full"><label for="limit">Batas anggaran (Rp)</label><input id="limit" name="limit" type="text" inputmode="numeric" pattern="[0-9]+" required placeholder="500000"></div>`
          },
          account: {
            title: 'Tambah akun',
            fields: `<div class="field full"><label for="name">Nama lengkap</label><input id="name" name="name" required maxlength="50" placeholder="Nama pengguna"></div><div class="field full"><label for="email">Alamat email</label><input id="email" name="email" type="email" required maxlength="100" placeholder="nama@email.com"></div><div class="field"><label for="role">Peran pengguna</label><select id="role" name="role"><option>Mahasiswa</option><option>Manager Controlling</option><option>Admin</option></select></div><div class="field"><label for="status">Status akun</label><select id="status" name="status"><option>Aktif</option><option>Nonaktif</option></select></div>`
          }
        };
        const config = configs[kind];
        if (!config) return;
        byId('overlay-root').innerHTML = `<div class="modal-backdrop" data-dismiss="true"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-heading"><h2 id="modal-title">${config.title}</h2><button class="close-button" type="button" data-close aria-label="Tutup">×</button></div><form id="modal-form"><div class="form-grid">${config.fields}</div><div class="form-actions"><button class="button secondary" type="button" data-close>Batal</button><button class="button" type="submit">Simpan</button></div></form></section></div>`;
        byId('overlay-root').dataset.modalKind = kind;
        const firstInput = byId('overlay-root').querySelector('input');
        if (firstInput) firstInput.focus();
      }

      function submitModal(form) {
        const data = Object.fromEntries(new FormData(form).entries());
        const kind = byId('overlay-root').dataset.modalKind;
        if (kind === 'transaction') {
          const amountText = data.amount.trim();
          const amount = Number(amountText);
          if (!/^\d+$/.test(amountText) || !Number.isSafeInteger(amount) || amount <= 0) return showToast('Masukkan nominal berupa angka positif.');
          const transaction = { date: formatDate(data.date), description: data.description.trim(), category: data.category, type: data.type, amount };
          currentTransactions().push(transaction);
          showToast('Transaksi berhasil ditambahkan.');
        } else if (kind === 'budget') {
          const limitText = data.limit.trim();
          const limit = Number(limitText);
          if (!/^\d+$/.test(limitText)) return showToast('Masukkan batas anggaran berupa angka bulat.');
          if (!Number.isSafeInteger(limit) || limit <= 0) return showToast('Batas anggaran harus lebih dari nol.');
          if (budgets.some((item) => item.category.toLowerCase() === data.category.trim().toLowerCase())) return showToast('Kategori tersebut sudah tersedia.');
          budgets.push({ category: data.category.trim(), limit, spent: 0 });
          showToast('Anggaran berhasil ditambahkan.');
        } else if (kind === 'account') {
          if (people.some((item) => item.email.toLowerCase() === data.email.trim().toLowerCase())) return showToast('Email tersebut sudah terdaftar.');
          people.push({ name: data.name.trim(), email: data.email.trim(), balance: 0, budget: 0, spent: 0, role: data.role, status: data.status, isNewAccount: true });
          showToast('Akun berhasil ditambahkan.');
        }
        byId('overlay-root').innerHTML = '';
        render();
      }

      function exportCsv(kind) {
        let headers, rows, filename;
        if (kind === 'transactions') {
          headers = ['Tanggal', 'Deskripsi', 'Kategori', 'Jenis', 'Nominal'];
          rows = transactions.map((item) => [item.date, item.description, item.category, item.type, item.amount]);
          filename = 'laporan-transaksi.csv';
        } else if (kind === 'monthly') {
          headers = ['Ringkasan', 'Nominal'];
          rows = [
            ['Bulan', 'Nov 2026'],
            ['Total pemasukan', totalIncome()],
            ['Total pengeluaran', totalExpense()],
            ['Saldo', balance()]
          ];
          filename = 'laporan-bulanan.csv';
        } else {
          headers = ['Kategori', 'Batas anggaran', 'Terpakai', 'Sisa', 'Persentase'];
          rows = budgets.map((item) => [item.category, item.limit, item.spent, item.limit - item.spent, `${usagePercent(item.spent, item.limit)}%`]);
          filename = 'pemakaian-anggaran.csv';
        }
        const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
        const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        showToast('Laporan berhasil diunduh.');
      }

      let selectedLoginRole = '';
      byId('login-screen').addEventListener('click', (event) => {
        const roleButton = event.target.closest('[data-login-role]');
        if (!roleButton) return;
        selectedLoginRole = roleButton.dataset.loginRole;
        byId('login-screen').querySelectorAll('[data-login-role]').forEach((button) => {
          button.setAttribute('aria-pressed', String(button === roleButton));
        });
        byId('login-error').textContent = '';
      });
      byId('login-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = byId('login-username').value.trim();
        const password = byId('login-password').value;
        const error = byId('login-error');
        if (!selectedLoginRole) {
          error.textContent = 'Pilih peran Anda terlebih dahulu.';
          byId('login-screen').querySelector('[data-login-role]').focus();
          return;
        }
        if (!username || !password) {
          error.textContent = 'Username/email dan password wajib diisi.';
          (!username ? byId('login-username') : byId('login-password')).focus();
          return;
        }
        setRole(selectedLoginRole);
        byId('login-screen').hidden = true;
        byId('dashboard-app').hidden = false;
      });
      byId('password-toggle').addEventListener('click', (event) => {
        const password = byId('login-password');
        const isVisible = password.type === 'text';
        password.type = isVisible ? 'password' : 'text';
        event.currentTarget.setAttribute('aria-pressed', String(!isVisible));
        event.currentTarget.setAttribute('aria-label', isVisible ? 'Tampilkan password' : 'Sembunyikan password');
      });
      byId('navigation').addEventListener('click', (event) => {
        const button = event.target.closest('[data-page]');
        if (button) { state.page = button.dataset.page; state.studentQuery = ''; state.accountQuery = ''; state.txQuery = ''; state.categoryFilter = 'Semua kategori'; state.transactionCategory = 'Semua kategori'; state.transactionMonth = 'Semua bulan'; render(); }
      });
      byId('view').addEventListener('click', (event) => {
        const modalButton = event.target.closest('[data-modal]');
        const navButton = event.target.closest('[data-navigate]');
        const toggle = event.target.closest('[data-toggle-account]');
        const exportButton = event.target.closest('[data-export]');
        if (modalButton) openModal(modalButton.dataset.modal);
        if (navButton) { state.page = navButton.dataset.navigate; render(); }
        if (toggle) {
          const account = people.find((item) => item.email === toggle.dataset.toggleAccount);
          if (account) { account.status = account.status === 'Aktif' ? 'Nonaktif' : 'Aktif'; render(); showToast(`Status akun ${account.name} diubah menjadi ${account.status.toLowerCase()}.`); }
        }
        if (exportButton) exportCsv(exportButton.dataset.export);
      });
      byId('view').addEventListener('input', (event) => {
        if (event.target.id === 'tx-search') {
          state.txQuery = event.target.value;
          state.role === 'admin' && state.page === 'personal' ? renderAdminPersonalIntoView() : renderTransactionsIntoView();
        }
        if (event.target.id === 'budget-search') { state.studentQuery = event.target.value; renderBudgetsIntoView(); }
        if (event.target.id === 'student-search') { state.studentQuery = event.target.value; state.role === 'admin' ? renderMonitorIntoView() : renderManagerStudentsIntoView(); }
        if (event.target.id === 'account-search') { state.accountQuery = event.target.value; renderAccountsIntoView(); }
      });
      byId('view').addEventListener('change', (event) => {
        if (event.target.id === 'tx-filter') { state.transactionFilter = event.target.value; render(); }
        if (event.target.id === 'tx-category-filter') { state.transactionCategory = event.target.value; render(); }
        if (event.target.id === 'tx-month-filter') { state.transactionMonth = event.target.value; render(); }
        if (event.target.id === 'budget-filter') { state.categoryFilter = event.target.value; render(); }
      });
      byId('overlay-root').addEventListener('click', (event) => {
        if (event.target.matches('[data-dismiss], [data-close]')) byId('overlay-root').innerHTML = '';
      });
      byId('overlay-root').addEventListener('submit', (event) => {
        if (event.target.id === 'modal-form') { event.preventDefault(); submitModal(event.target); }
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') byId('overlay-root').innerHTML = '';
      });
      byId('logout-button').addEventListener('click', () => {
        byId('dashboard-app').hidden = true;
        byId('login-screen').hidden = false;
        byId('login-password').value = '';
        byId('login-error').textContent = '';
        selectedLoginRole = '';
        byId('login-screen').querySelectorAll('[data-login-role]').forEach((button) => button.setAttribute('aria-pressed', 'false'));
        byId('login-username').focus();
      });

      function preserveInput(id, renderFn) {
        const input = byId(id);
        if (!input) return;
        const value = input.value;
        const start = input.selectionStart;
        renderFn();
        const next = byId(id);
        if (next) { next.focus(); next.setSelectionRange(start, start); }
      }
      function renderTransactionsIntoView() { preserveInput('tx-search', () => { byId('view').innerHTML = renderTransactions(); }); }
      function renderAdminPersonalIntoView() { preserveInput('tx-search', () => { byId('view').innerHTML = renderAdminPersonal(); }); }
      function renderBudgetsIntoView() { preserveInput('budget-search', () => { byId('view').innerHTML = renderBudgets(); }); }
      function renderMonitorIntoView() { preserveInput('student-search', () => { byId('view').innerHTML = renderMonitor(); }); }
      function renderManagerStudentsIntoView() { preserveInput('student-search', () => { byId('view').innerHTML = renderManagerStudents(); }); }
      function renderAccountsIntoView() { preserveInput('account-search', () => { byId('view').innerHTML = renderAccounts(); }); }

      render();
    })();
