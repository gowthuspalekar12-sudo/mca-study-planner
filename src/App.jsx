import React, { useEffect, useState } from 'react';
import { dateAfter, formatDate, loadPlanner, savePlanner, taskTypes } from './planner.js';

const blankTask = { title: '', subject: '', type: 'Assignment', due: '' };

function TaskForm({ subjects, editing, onSave, onCancel }) {
  const [draft, setDraft] = useState(editing ?? { ...blankTask, subject: subjects[0] ?? '' });

  function update(event) {
    const { name, value } = event.target;
    setDraft((previous) => ({ ...previous, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const title = draft.title.trim();
    if (title && draft.subject && draft.due) onSave({ ...draft, title });
  }

  return (
    <section className="panel" id="task-form" aria-labelledby="form-title">
      <div className="panel-title">
        <h2 id="form-title">{editing ? 'Edit task' : 'Add a task'}</h2>
        {editing && <button className="text-button" onClick={onCancel}>Cancel</button>}
      </div>
      <form onSubmit={submit}>
        <label>Task name
          <input name="title" value={draft.title} onChange={update}
            placeholder="e.g. Prepare SQL joins notes" required pattern={'.*\\S.*'} maxLength="100" />
        </label>
        <label>Subject
          <select name="subject" value={draft.subject} onChange={update} required>
            <option value="" disabled>Select a subject</option>
            {subjects.map((subject) => <option key={subject}>{subject}</option>)}
          </select>
        </label>
        <div className="form-row">
          <label>Task type
            <select name="type" value={draft.type} onChange={update}>
              {taskTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label>Due date
            <input type="date" name="due" value={draft.due} onChange={update} required />
          </label>
        </div>
        <button className="primary" type="submit">{editing ? 'Save changes' : 'Add task'}</button>
      </form>
    </section>
  );
}

function SubjectForm({ subjects, onAdd }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    const subject = name.trim();
    if (!subject) return;
    if (subjects.some((item) => item.toLowerCase() === subject.toLowerCase())) {
      setError('That subject already exists.');
      return;
    }
    onAdd(subject);
    setName('');
    setError('');
  }

  return (
    <section className="panel" aria-labelledby="subject-title">
      <h2 id="subject-title">Subjects</h2>
      <ul className="subjects">
        {subjects.map((subject) => <li key={subject}>{subject}</li>)}
      </ul>
      <form onSubmit={submit}>
        <label>New subject
          <input value={name} onChange={(event) => { setName(event.target.value); setError(''); }}
            placeholder="e.g. Database Management" maxLength="60" required pattern={'.*\\S.*'} />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="secondary">Add subject</button>
      </form>
    </section>
  );
}

function TaskCard({ task, today, onToggle, onEdit, onDelete }) {
  const isOverdue = !task.done && task.due < today;
  return (
    <li className={task.done ? 'task done' : 'task'}>
      <input type="checkbox" className="check" checked={task.done}
        aria-label={task.done ? 'Reopen ' + task.title : 'Complete ' + task.title}
        onChange={() => onToggle(task.id)} />
      <div className="task-content">
        <h3>{task.title}</h3>
        <p className="task-subject">{task.subject}</p>
        <div className="task-details">
          <span className={'tag ' + task.type.toLowerCase()}>{task.type}</span>
          <span className={isOverdue ? 'overdue' : ''}>
            {isOverdue ? 'Overdue · ' : 'Due '}
            <time dateTime={task.due}>{formatDate(task.due)}</time>
          </span>
        </div>
      </div>
      <div className="task-actions">
        <a className="text-button" href="#task-form" onClick={() => onEdit(task)}>Edit</a>
        <button className="text-button danger" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </li>
  );
}

export default function App() {
  const [planner, setPlanner] = useState(loadPlanner);
  const [editing, setEditing] = useState(null);
  const [formVersion, setFormVersion] = useState(0);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [storageError, setStorageError] = useState(false);
  const { subjects, tasks } = planner;
  const today = dateAfter();

  useEffect(() => {
    try {
      savePlanner(planner);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [planner]);

  function updateTasks(update) {
    setPlanner((previous) => ({ ...previous, tasks: update(previous.tasks) }));
  }

  function resetForm() {
    setEditing(null);
    setFormVersion((version) => version + 1);
  }

  function saveTask(draft) {
    if (editing) {
      updateTasks((items) => items.map((item) => item.id === draft.id ? { ...draft, done: item.done } : item));
      setMessage('Task updated.');
    } else {
      const task = { ...draft, id: crypto.randomUUID(), done: false };
      updateTasks((items) => [...items, task]);
      setSubjectFilter('');
      setStatusFilter('all');
      setMessage('Task added.');
    }
    resetForm();
  }

  function addSubject(subject) {
    setPlanner((previous) => ({ ...previous, subjects: [...previous.subjects, subject] }));
    setMessage('Subject added.');
  }

  function toggleTask(id) {
    updateTasks((items) => items.map((item) => item.id === id ? { ...item, done: !item.done } : item));
  }

  function editTask(task) {
    setEditing(task);
    setFormVersion((version) => version + 1);
  }

  function deleteTask(task) {
    if (!window.confirm('Delete "' + task.title + '"?')) return;
    updateTasks((items) => items.filter((item) => item.id !== task.id));
    if (editing?.id === task.id) resetForm();
    setMessage('Task deleted.');
  }

  const completed = tasks.filter((task) => task.done).length;
  const progress = tasks.length ? Math.round(100 * completed / tasks.length) : 0;
  const visibleTasks = tasks
    .filter((task) => (!subjectFilter || task.subject === subjectFilter) &&
      (statusFilter === 'all' || task.done === (statusFilter === 'completed')))
    .sort((first, second) => Number(first.done) - Number(second.done) || first.due.localeCompare(second.due));

  return (
    <>
      <header className="hero">
        <div className="wrap hero-layout">
          <div>
            <p className="hero-date">{formatDate(today)}</p>
            <h1>MCA Study Planner</h1>
            <p className="subtitle">Track assignments, exams and lab work by subject.</p>
          </div>
          <div className="progress">
            <div><label htmlFor="progress">Completion</label><strong>{progress}%</strong></div>
            <progress id="progress" value={progress} max="100">{progress}%</progress>
            <p>{completed} of {tasks.length} tasks completed</p>
          </div>
        </div>
      </header>

      <main className="wrap">
        <dl className="summary">
          <div><dt>Total tasks</dt><dd>{tasks.length}</dd></div>
          <div><dt>Pending</dt><dd>{tasks.length - completed}</dd></div>
          <div><dt>Completed</dt><dd>{completed}</dd></div>
          <div><dt>Subjects</dt><dd>{subjects.length}</dd></div>
        </dl>
        <div className="feedback">
          <p role="status">{message}</p>
          {storageError && <p className="error" role="alert">Browser storage is unavailable. Changes may be lost on refresh.</p>}
        </div>

        <div className="layout">
          <aside className="sidebar">
            <TaskForm key={formVersion} subjects={subjects} editing={editing} onSave={saveTask} onCancel={resetForm} />
            <SubjectForm subjects={subjects} onAdd={addSubject} />
          </aside>
          <section className="panel tasks-panel" aria-labelledby="tasks-title">
            <div className="panel-title"><h2 id="tasks-title">Study tasks</h2><span>{visibleTasks.length} shown</span></div>
            <div className="filters">
              <label>Filter by subject
                <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
                  <option value="">All subjects</option>
                  {subjects.map((subject) => <option key={subject}>{subject}</option>)}
                </select>
              </label>
              <label>Filter by status
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </label>
            </div>
            {visibleTasks.length > 0 ? (
              <ul className="task-list">
                {visibleTasks.map((task) => (
                  <TaskCard key={task.id} task={task} today={today}
                    onToggle={toggleTask} onEdit={editTask} onDelete={deleteTask} />
                ))}
              </ul>
            ) : <p className="empty">{tasks.length ? 'No tasks match these filters.' : 'Add a task to start your planner.'}</p>}
          </section>
        </div>
        <footer>Your subjects and tasks are saved in this browser.</footer>
      </main>
    </>
  );
}
