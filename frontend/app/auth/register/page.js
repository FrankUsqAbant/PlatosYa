// ==========================================================================
// PlatoYa - Página de Registro
// Formulario de registro con validación y llamada al backend
// ==========================================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'cliente',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación: las contraseñas deben coincidir
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Validación: contraseña mínima
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          role: formData.role, // Enviamos el rol seleccionado
        }),
      });

      // Auto-login después del registro exitoso
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        // Redirigir basado en el rol
        if (formData.role === 'cocinero') {
          router.push('/kitchen');
        } else {
          router.push('/menu');
        }
        router.refresh();
      } else {
        router.push('/auth/login?registered=true');
      }
    } catch (err) {
      setError(err.message || 'Error al registrarse. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoEmoji}>🍽️</span>
          <span className={styles.logoText}>PlatoYa</span>
        </div>

        <p className={styles.title}>Crea tu cuenta gratuita</p>

        {/* Mensaje de error */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="role">Rol</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="cliente">Cliente (Hacer pedidos)</option>
              <option value="cocinero">Cocinero (Gestionar cocina)</option>
            </select>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Registrando...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        {/* Link a login */}
        <div className={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login">Inicia sesión aquí</Link>
        </div>
      </div>
    </div>
  );
}
