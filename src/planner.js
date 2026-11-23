export const taskTypes = ['Assignment', 'Exam', 'Lab', 'Revision'];
const storageKey = 'mca-study-planner-v1';
const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export function dateAfter(days = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const parts = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  return parts.map((part) => String(part).padStart(2, '0')).join('-');
}

export function formatDate(value) {
  return dateFormatter.format(new Date(value + 'T12:00:00'));
}

export function loadPlanner() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(saved?.subjects) && Array.isArray(saved?.tasks)) return saved;
  } catch {
    // Use sample data when browser storage is unavailable or unreadable.
  }

  return {
    subjects: ['Frontend Development', 'Software Engineering', 'Machine Learning'],
    tasks: [
      { id: 'demo-1', title: 'Submit React deployment assignment',
        subject: 'Frontend Development', type: 'Assignment', due: dateAfter(2), done: false },
      { id: 'demo-2', title: 'Revise software testing methods',
        subject: 'Software Engineering', type: 'Exam', due: dateAfter(5), done: false },
      { id: 'demo-3', title: 'Run the K-Means notebook',
        subject: 'Machine Learning', type: 'Lab', due: dateAfter(7), done: true },
    ],
  };
}

export function savePlanner(planner) {
  localStorage.setItem(storageKey, JSON.stringify(planner));
}
