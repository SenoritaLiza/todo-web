import React from 'react';
import Icon, { type IconName } from './Icon';
import type { TaskView } from '../domain/entities/task';
import type { User } from '../domain/entities/user';
import styles from './Sidebar.module.css';

interface SidebarProps {
  selectedView: TaskView;
  onViewChange: (view: TaskView) => void;
  user: User;
  onLogout: () => void;
}

interface MenuItem {
  id: TaskView;
  label: string;
  icon: IconName;
}

const MENU_ITEMS: ReadonlyArray<MenuItem> = [
  { id: 'all', label: 'Все задачи', icon: 'list' },
  { id: 'in-progress', label: 'Мои задачи', icon: 'user' },
  { id: 'completed', label: 'Выполненные', icon: 'checkCircle' },
  { id: 'trash', label: 'Корзина', icon: 'trash' },
];

function initialsOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const second = parts[1]?.charAt(0) ?? '';
  return (first + second).toUpperCase() || '?';
}

function getFirstName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts[0] || '';
}

/**
 * Извлекает фамилию из fullName (второе слово и далее).
 * Если фамилия не найдена, пытается взять из user.lastName или user.surname.
 */
function getLastName(user: User): string {
  // 1. Сначала пробуем получить из fullName (берём всё после первого слова)
  const parts = user.fullName.trim().split(/\s+/);
  if (parts.length > 1) {
    // Можно вернуть всё кроме первого слова (если есть отчество) или только последнее слово.
    // Обычно фамилия — последнее слово, но для русских имён часто фамилия идёт первой.
    // Возьмём последнее слово как наиболее вероятную фамилию.
    return parts[parts.length - 1];
  }

  // 2. Если в fullName только одно слово, пробуем взять из отдельных полей (если они есть)
  const userAny = user as any;
  if (userAny.lastName) return userAny.lastName;
  if (userAny.surname) return userAny.surname;

  // 3. Если ничего нет — возвращаем пустую строку
  return '';
}

export default function Sidebar({ selectedView, onViewChange, user, onLogout }: SidebarProps) {
  // ⬇️ ОТЛАДКА: посмотрите в консоли, что приходит в user
  console.log('📦 Данные пользователя в Sidebar:', user);

  const firstName = getFirstName(user.fullName);
  const lastName = getLastName(user);

  // Для дополнительной отладки — что получилось после парсинга
  console.log('👤 Имя:', firstName, '| Фамилия:', lastName);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandLogo}>
          <Icon name="logo" size={28} />
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandTitle}>ЧОМИАЦ</span>
        </div>
      </div>

      <button
        type="button"
        className={`${styles.primaryNavItem} ${styles.primaryNavItemActive}`}
        aria-current="page"
      >
        <span className={styles.primaryIcon}><Icon name="checkCircle" size={18} /></span>
        <span>Задачи</span>
      </button>

      <nav className={styles.nav} aria-label="Категории задач">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.navItem} ${selectedView === item.id ? styles.navItemActive : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className={styles.navIcon}><Icon name={item.icon} size={18} /></span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      <div className={styles.footer}>
        <div className={styles.user}>
          <div className={styles.avatar}>{initialsOf(user.fullName)}</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{firstName}</p>
            <p className={styles.userRole}>{lastName || '—'}</p>
          </div>
        </div>
        <button type="button" className={styles.logoutBtn} onClick={onLogout}>
          <Icon name="logout" size={16} />
          <span>Выход</span>
        </button>
      </div>
    </aside>
  );
}