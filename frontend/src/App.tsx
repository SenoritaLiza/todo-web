import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import TaskListView from './components/TaskListView';
import { TaskApiRepository } from './infrastructure/repositories';
import { clearSession, loadSession, saveSession } from './infrastructure/auth/userStore';
import type {
  SortDir,
  SortField,
  StatusFilter,
  Task,
  TaskDraft,
  TaskView,
} from './domain/entities/task';
import type { User } from './domain/entities/user';

const repo = new TaskApiRepository();

export default function App() {
  const [user, setUser] = useState<User | null>(() => loadSession());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [view, setView] = useState<TaskView>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<SortField>('createdAt');
  const [orderDir, setOrderDir] = useState<SortDir>('desc');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await repo.list({ view, status, search, orderBy, orderDir });
      setTasks(data);
    } catch (err) {
      setTasks([]);
      setErrorMessage(err instanceof Error ? err.message : 'Не удалось загрузить задачи');
    } finally {
      setLoading(false);
    }
  }, [view, status, search, orderBy, orderDir]);

  useEffect(() => {
    if (!user) return;
    void fetchTasks();
  }, [user, fetchTasks]);

  const handleLoginSuccess = (next: User) => {
    saveSession(next);
    setUser(next);
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setTasks([]);
    setView('all');
    setStatus('all');
    setSearch('');
  };

  const wrapAction = useCallback(
    async (fn: () => Promise<unknown>) => {
      try {
        await fn();
        await fetchTasks();
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Операция не удалась');
      }
    },
    [fetchTasks],
  );

  const handleCreateTask = useCallback(
    (draft: TaskDraft) => wrapAction(() => repo.create(draft)),
    [wrapAction],
  );

  const handleUpdateTask = useCallback(
    (id: number, draft: TaskDraft) => wrapAction(() => repo.update(id, draft)),
    [wrapAction],
  );

  const handleToggleTask = useCallback(
    (id: number, isCompleted: boolean) =>
      wrapAction(() => repo.setCompleted(id, isCompleted)),
    [wrapAction],
  );

  const handleDeleteTask = useCallback(
    (id: number) => wrapAction(() => repo.moveToTrash(id)),
    [wrapAction],
  );

  const handleRestoreTask = useCallback(
    (id: number) => wrapAction(() => repo.restore(id)),
    [wrapAction],
  );

  const handlePurgeTask = useCallback(
    (id: number) => wrapAction(() => repo.deletePermanently(id)),
    [wrapAction],
  );

  const handleSortChange = (nextOrderBy: SortField, nextOrderDir: SortDir) => {
    setOrderBy(nextOrderBy);
    setOrderDir(nextOrderDir);
  };

  const renderTaskList = useMemo(() => {
    if (!user) return null;
    return (
      <TaskListView
        user={user}
        view={view}
        tasks={tasks}
        loading={loading}
        errorMessage={errorMessage}
        search={search}
        status={status}
        orderBy={orderBy}
        orderDir={orderDir}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onSortChange={handleSortChange}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onRestoreTask={handleRestoreTask}
        onPurgeTask={handlePurgeTask}
      />
    );
  }, [
    user,
    view,
    tasks,
    loading,
    errorMessage,
    search,
    status,
    orderBy,
    orderDir,
    handleCreateTask,
    handleUpdateTask,
    handleToggleTask,
    handleDeleteTask,
    handleRestoreTask,
    handlePurgeTask,
  ]);

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout
      selectedView={view}
      onViewChange={setView}
      user={user}
      onLogout={handleLogout}
    >
      {renderTaskList}
    </Layout>
  );
}
