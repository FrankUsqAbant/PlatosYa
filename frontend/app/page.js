"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.textCol}>
            <span className={styles.eyebrow}>Restaurante de Autor · Desde 2020</span>
            <h1 className={styles.title}>
              La elegancia de lo simple, directo a tu mesa.
            </h1>
            <p className={styles.description}>
              Nuestros platos son elaborados con paciencia, respetando los ingredientes
              en su estado más puro. Un tributo a la quietud y al sabor auténtico.
            </p>
            <div className={styles.actions}>
              <Link href="/menu" className={styles.primaryBtn}>
                Explorar el Menú
              </Link>
              <Link href="/auth/login" className={styles.secondaryBtn}>
                Iniciar Sesión
              </Link>
            </div>
          </div>

          <div className={styles.imageCol}>
            <div className={styles.heroImageWrapper}>
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85"
                alt="Plato gourmet en restaurante"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              <div className={styles.imageOverlay} />
            </div>
            <div className={styles.floatingBadge}>
              <span className={styles.badgeNum}>12+</span>
              <span className={styles.badgeText}>Platos de autor</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className={styles.statsStrip}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>4</span>
              <span className={styles.statLabel}>Categorías</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>100%</span>
              <span className={styles.statLabel}>Ingredientes frescos</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>30'</span>
              <span className={styles.statLabel}>Tiempo promedio</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>⭐ 4.9</span>
              <span className={styles.statLabel}>Valoración media</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className={styles.categoriesSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Nuestras Categorías</h2>
          <div className={styles.categoriesGrid}>
            {[
              {
                name: "Entradas",
                img: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80",
                desc: "Comenzar con buen pie"
              },
              {
                name: "Platos Fuertes",
                img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
                desc: "El corazón del menú"
              },
              {
                name: "Postres",
                img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=600&q=80",
                desc: "El final perfecto"
              },
              {
                name: "Bebidas",
                img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
                desc: "Para cada momento"
              }
            ].map(cat => (
              <Link key={cat.name} href={`/menu`} className={styles.categoryCard}>
                <div className={styles.categoryImageWrapper}>
                  <Image src={cat.img} alt={cat.name} fill style={{ objectFit: "cover" }} />
                  <div className={styles.categoryOverlay} />
                </div>
                <div className={styles.categoryInfo}>
                  <h3 className={styles.categoryName}>{cat.name}</h3>
                  <p className={styles.categoryDesc}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className="container">
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <span className={styles.valueIcon}>🌿</span>
              <h3 className={styles.valueTitle}>Ingredientes</h3>
              <p className={styles.valueText}>
                Seleccionamos con rigor la materia prima, priorizando productores locales
                que comparten nuestro respeto por los ciclos de la tierra.
              </p>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueIcon}>👨‍🍳</span>
              <h3 className={styles.valueTitle}>El Ritual</h3>
              <p className={styles.valueText}>
                Creemos que la comida no es solo alimento, sino un momento de pausa.
                Cada entrega está pensada para proteger esta experiencia.
              </p>
            </div>
            <div className={styles.valueItem}>
              <span className={styles.valueIcon}>🚀</span>
              <h3 className={styles.valueTitle}>Velocidad</h3>
              <p className={styles.valueText}>
                Tu pedido llega en tiempo récord. Seguimiento en tiempo real desde
                la cocina hasta tu puerta, sin sorpresas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>¿Listo para ordenar?</h2>
            <p className={styles.ctaDesc}>Explora el menú completo y realiza tu pedido en minutos.</p>
            <Link href="/menu" className={styles.ctaBtn}>
              Ver el Menú Completo →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
