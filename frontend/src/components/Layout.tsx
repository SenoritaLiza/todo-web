import React, { type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Icon from './Icon';
import type { TaskView } from '../domain/entities/task';
import type { User } from '../domain/entities/user';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  selectedView: TaskView;
  onViewChange: (view: TaskView) => void;
  user: User;
  onLogout: () => void;
}

export default function Layout({
  children,
  selectedView,
  onViewChange,
  user,
  onLogout,
}: LayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <Sidebar
          selectedView={selectedView}
          onViewChange={onViewChange}
          user={user}
          onLogout={onLogout}
        />
        <main className={styles.main}>{children}</main>
      </div>

      <div className={styles.watermark} aria-hidden="true">
        <Icon name="logo" size={26} />
        <span>ЧОМИАЦ</span>
      </div>
    </div>
  );
}
