import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import {
  AuthError,
  login as loginUser,
  register as registerUser,
} from '../infrastructure/auth/userStore';
import type { User } from '../domain/entities/user';
import styles from './LoginPage.module.css';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

const emptyForm: FormState = {
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
};

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password) {
        throw new AuthError('Заполните все поля');
      }
      if (!isLogin) {
        if (!formData.fullName.trim()) {
          throw new AuthError('Введите ваше имя');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new AuthError('Пароли не совпадают');
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 350));

      const user = isLogin
        ? loginUser({ email: formData.email, password: formData.password })
        : registerUser({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
          });

      onLoginSuccess(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка входа. Попробуйте позже.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
    setError('');
    setFormData(emptyForm);
  };

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      <div className={styles.loginBox}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>✓</span>
          </div>
          <h1>ЧОМИАЦ</h1>
          <p className={styles.subtitle}>МИАЦ Челябинской области</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>

          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Полное имя</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Введите ваше имя"
                className={styles.input}
                autoComplete="name"
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className={styles.input}
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={styles.input}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={styles.input}
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className={styles.toggle}>
          <p>
            {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button type="button" className={styles.toggleBtn} onClick={toggleMode}>
              {isLogin ? 'Зарегистрируйтесь' : 'Войдите'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
