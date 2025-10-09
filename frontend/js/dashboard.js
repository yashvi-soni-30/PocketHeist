// dashboard.js - loads expenses, draws chart, handles quick add
document.addEventListener('DOMContentLoaded', async () => {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  let chart;

  async function fetchExpenses(){
    const r = await apiFetch('/api/expenses');
    return (r.success && r.data) ? r.data : [];
  }

  function transformForRange(expenses, range='monthly'){
    // create simple aggregated data by day/week/month (demo)
    if (range === 'daily') {
      const byDay = {};
      expenses.forEach(e => { const d = e.date; byDay[d] = (byDay[d]||0) + e.amount; });
      return { labels: Object.keys(byDay).slice(-7), values: Object.values(byDay).slice(-7) };
    }
    if (range === 'weekly') {
      // group by week index (very simple)
      const byWeek = {};
      expenses.forEach(e => {
        const wk = Math.ceil(new Date(e.date).getDate() / 7) + '-' + new Date(e.date).getMonth();
        byWeek[wk] = (byWeek[wk]||0) + e.amount;
      });
      return { labels: Object.keys(byWeek), values: Object.values(byWeek) };
    }
    // monthly
    const byMonth = {};
    expenses.forEach(e => {
      const d = new Date(e.date);
      const key = `${d.getMonth()+1}-${d.getFullYear()}`;
      byMonth[key] = (byMonth[key]||0) + e.amount;
    });
    return { labels: Object.keys(byMonth), values: Object.values(byMonth) };
  }

  async function render(range='monthly'){
    const expenses = await fetchExpenses();
    const data = transformForRange(expenses, range);
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{ label: 'Expense (₹)', data: data.values }]
      },
      options: { responsive:true, plugins:{ legend:{ display:false } } }
    });

    // recent list
    const list = document.getElementById('recentList');
    list.innerHTML = expenses.slice(-5).reverse().map(e => `<li class="list-group-item small">${e.date} • ${e.category} • ₹${e.amount}</li>`).join('');
  }

  document.getElementById('rangeSelect').addEventListener('change', (e)=> render(e.target.value));

  // add expense form
  document.getElementById('addExpenseForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = ev.target;
    const payload = {
      amount: Number(f.amount.value),
      category: f.category.value || 'Misc',
      description: f.description.value || '',
      date: f.date.value || new Date().toISOString().slice(0,10)
    };
    await apiFetch('/api/expenses', 'POST', payload);
    f.reset();
    render(document.getElementById('rangeSelect').value);
    // update badges/progress (demo)
    document.getElementById('targetProgress').firstElementChild.style.width = '48%';
    document.getElementById('badges').innerHTML = '<span class="badge bg-success">Silver</span>';
  });

  // initial render
  render('monthly');
});

const ctx = document.getElementById('expenseChart');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Food', 'Rent', 'Transport', 'Stationery', 'Others'],
    datasets: [{
      label: 'Monthly Expenses',
      data: [200, 400, 150, 100, 80],
      backgroundColor: ['#61a2e8ff', '#8f50f4ff', '#4ec9b0ff', '#9ee309ff', '#ea30b2ff']
    }]
  },
  options: { responsive: true, plugins: { legend: { display: false } } }
});

document.getElementById("addExpenseForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Expense Added Successfully!");
});

