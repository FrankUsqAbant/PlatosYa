"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { ArrowRight, Sparkles, Clock, ShieldCheck, Flame, Utensils, Star } from "lucide-react";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Ambient background glows */}
      <div className={styles.ambientGlow1} />
      <div className={styles.ambientGlow2} />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.textCol}>
            <h1 className={styles.title}>
              El placer de comer bien, <br />
              <span className={styles.titleHighlight}>directo a tu mesa.</span>
            </h1>

            <p className={styles.description}>
              Descubre platos de autor preparados con ingredientes frescos de la más alta calidad. 
              Sigue tu comanda en vivo desde la cocina hasta tu hogar con nuestra tecnología en tiempo real.
            </p>

            <div className={styles.actions}>
              <Link href="/menu" className={styles.primaryBtn}>
                <span>Explorar el Menú</span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/auth/login" className={styles.secondaryBtn}>
                <span>Iniciar Sesión</span>
              </Link>
            </div>
          </div>

          <div className={styles.imageCol}>
            <div className={styles.heroImageFrame}>
              <div className={styles.heroImageWrapper}>
                <Image
                  src="/images/lomo_saltado.webp"
                  alt="Plato gourmet exclusivo"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
                <div className={styles.heroImageOverlay} />
              </div>
            </div>

            {/* Floating Badges */}
            <div className={styles.floatingBadgeLeft}>
              <span className={styles.badgeIcon}>⭐</span>
              <div>
                <p className={styles.badgeTitle}>4.9 / 5.0</p>
                <p className={styles.badgeSub}>+2,500 Clientes Felices</p>
              </div>
            </div>

            <div className={styles.floatingBadgeRight}>
              <span className={styles.badgeIcon}>🔥</span>
              <div>
                <p className={styles.badgeTitle}>12+ Platos</p>
                <p className={styles.badgeSub}>Cocina de Autor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className={styles.statsStrip}>
        <div className="container">
          <div className={styles.statsContainer}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statIconWrap}>🍽️</div>
                <div className={styles.statInfo}>
                  <span className={styles.statNum}>100%</span>
                  <span className={styles.statLabel}>Ingredientes Frescos</span>
                </div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statIconWrap}>⚡</div>
                <div className={styles.statInfo}>
                  <span className={styles.statNum}>&lt; 30 min</span>
                  <span className={styles.statLabel}>Entrega Promedio</span>
                </div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statIconWrap}>👨‍🍳</div>
                <div className={styles.statInfo}>
                  <span className={styles.statNum}>Alta Cocina</span>
                  <span className={styles.statLabel}>Chefs Especializados</span>
                </div>
              </div>

              <div className={styles.statItem}>
                <div className={styles.statIconWrap}>📡</div>
                <div className={styles.statInfo}>
                  <span className={styles.statNum}>En Vivo</span>
                  <span className={styles.statLabel}>Sincronización Socket.IO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className={styles.categoriesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Selección Culinaria</span>
            <h2 className={styles.sectionTitle}>Explora Nuestras Especialidades</h2>
            <p className={styles.sectionDesc}>
              Elaboradas para deleitar cada paladar con el balance perfecto de texturas y aromas.
            </p>
          </div>

          <div className={styles.categoriesGrid}>
            {[
              {
                name: "Entradas",
                tag: "Aperitivos",
                img: "/images/entradas.webp",
                desc: "Para abrir el apetito con frescura"
              },
              {
                name: "Platos Fuertes",
                tag: "Especialidades",
                img: "/images/fuertes.webp",
                desc: "El corazón y pasión de nuestra carta"
              },
              {
                name: "Postres",
                tag: "Dulce Final",
                img: "/images/postres.webp",
                desc: "Creaciones dulces irresistibles"
              },
              {
                name: "Bebidas",
                tag: "Refrescantes",
                img: "/images/bebidas.webp",
                desc: "Cócteles y mezclas naturales"
              }
            ].map(cat => (
              <Link key={cat.name} href={`/menu`} className={styles.categoryCard}>
                <div className={styles.categoryImageWrapper}>
                  <Image src={cat.img} alt={cat.name} fill style={{ objectFit: "cover" }} />
                  <div className={styles.categoryOverlay} />
                </div>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryTag}>{cat.tag}</span>
                  <h3 className={styles.categoryName}>{cat.name}</h3>
                  <p className={styles.categoryDesc}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Values / Features */}
      <section className={styles.valuesSection}>
        <div className="container">
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <div className={styles.valueIconWrap}>🌿</div>
              <h3 className={styles.valueTitle}>Ingredientes Orgánicos</h3>
              <p className={styles.valueText}>
                Priorizamos productos locales de estación, asegurando el máximo sabor, 
                frescura y respeto por el medio ambiente en cada preparación.
              </p>
            </div>

            <div className={styles.valueItem}>
              <div className={styles.valueIconWrap}>🔥</div>
              <h3 className={styles.valueTitle}>El Toque del Chef</h3>
              <p className={styles.valueText}>
                Técnicas culinarias modernas combinadas con recetas tradicionales 
                para crear combinaciones inolvidables en cada bocado.
              </p>
            </div>

            <div className={styles.valueItem}>
              <div className={styles.valueIconWrap}>🚀</div>
              <h3 className={styles.valueTitle}>Seguimiento en Vivo</h3>
              <p className={styles.valueText}>
                Tu orden se transmite al instante al tablero Kanban de nuestra cocina. 
                Recibe notificaciones automáticas al segundo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>¿Listo para una experiencia gastronómica?</h2>
            <p className={styles.ctaDesc}>
              Explora nuestro menú completo y recibe tus platos favoritos calientes y listos en minutos.
            </p>
            <Link href="/menu" className={styles.ctaBtn}>
              <span>Ver el Menú Completo</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
