import type { User } from '../../domain/entities/user';

const USERS_KEY = 'todo-web:users';
const SESSION_KEY = 'user';

interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
}

// Toy hash — registration is a client-only demo. Don't reuse this for anything real.
function hash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function makeToken(): string {
  return `mock-jwt-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthError extends Error {}

export function register(input: RegisterInput): User {
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  if (!email || !input.password || !fullName) {
    throw new AuthError('Заполните все поля');
  }

  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    throw new AuthError('Пользователь с таким email уже зарегистрирован');
  }

  const stored: StoredUser = {
    id: makeId(),
    email,
    fullName,
    passwordHash: hash(input.password),
  };
  users.push(stored);
  writeUsers(users);

  const session: User = {
    id: stored.id,
    email: stored.email,
    fullName: stored.fullName,
    token: makeToken(),
  };
  saveSession(session);
  return session;
}

export function login(input: LoginInput): User {
  const email = input.email.trim().toLowerCase();
  if (!email || !input.password) {
    throw new AuthError('Введите email и пароль');
  }

  const users = readUsers();
  const found = users.find((u) => u.email === email);
  if (!found || found.passwordHash !== hash(input.password)) {
    throw new AuthError('Неверный email или пароль');
  }

  const session: User = {
    id: found.id,
    email: found.email,
    fullName: found.fullName,
    token: makeToken(),
  };
  saveSession(session);
  return session;
}

export function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveSession(user: User): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
