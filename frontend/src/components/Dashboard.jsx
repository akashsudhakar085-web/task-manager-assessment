import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tasks on load
  useEffect(() => {
    fetchTasks();
  }, [user.email]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/tasks/${user.email}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        setError('Failed to fetch tasks');
      }
    } catch (err) {
      setError('Cannot connect to the server');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError('');

    const taskData = {
      title,
      description,
      status,
      email: user.email
    };

    try {
      if (editingId) {
        // Update existing task
        const response = await fetch(`${API_URL}/tasks/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });

        if (response.ok) {
          // Update local state
          setTasks(tasks.map(t => t._id === editingId ? { ...t, ...taskData } : t));
          resetForm();
        } else {
          setError('Failed to update task');
        }
      } else {
        // Create new task
        const response = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });

        if (response.ok) {
          const newTask = await response.json();
          setTasks([...tasks, newTask]);
          resetForm();
        } else {
          setError('Failed to create task');
        }
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setTasks(tasks.filter(t => t._id !== id));
      } else {
        setError('Failed to delete task');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setStatus('To Do');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'In Progress': return 'badge-progress';
      case 'Done': return 'badge-done';
      default: return 'badge-todo';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, <span>{user.name}</span></h1>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="dashboard-content">
        {/* Sidebar Form */}
        <div className="task-form-box">
          <h3>{editingId ? '✏️ Edit Task' : '📝 Add New Task'}</h3>
          <form className="task-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Add more details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <span className="spinner"></span> : (editingId ? 'Update Task' : 'Add Task')}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={cancelEdit}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Main Content Area */}
        <div className="tasks-area">
          <div className="tasks-header">
            <h2>Your Tasks</h2>
            <span className="task-count">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <span className="spinner"></span>
              <p>Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✨</div>
              <h3>You're all caught up!</h3>
              <p>Create a task using the form to get started.</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <div key={task._id} className="task-card">
                  <div className="task-header">
                    <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                      {task.status}
                    </span>
                    <div className="task-actions">
                      <button 
                        className="btn-icon edit" 
                        onClick={() => startEdit(task)}
                        title="Edit task"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon delete" 
                        onClick={() => handleDelete(task._id)}
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <h3 className="task-title">{task.title}</h3>
                  {task.description && (
                    <p className="task-desc">{task.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
