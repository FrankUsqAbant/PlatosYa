"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { apiFetch } from "@/lib/api";
import styles from "./page.module.css";
import { X, Minus, Plus, Search, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const CATEGORY_ICONS = {
  "Todos": "🔥",
  "Entradas": "🥗",
  "Platos Fuertes": "🥩",
  "Postres": "🍰",
  "Bebidas": "🍹"
};

export default function MenuPage() {
  const [platos, setPlatos] = useState([]);
  const [categorias, setCategorias] = useState(["Todos", "Entradas", "Platos Fuertes", "Postres", "Bebidas"]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { items, addItem, removeItem, updateQuantity, cartCount, cartTotal } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    fetchPlatos();
  }, []);

  const fetchPlatos = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/platos");
      if (data.success) {
        setPlatos(data.platos);
      }
    } catch (error) {
      console.error("Error fetching platos:", error);
      addToast("Error al cargar el menú", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (plato) => {
    addItem(plato);
    addToast(`${plato.nombre} añadido al pedido`, "success");
  };

  const platosFiltrados = platos.filter((p) => {
    const matchCategory = categoriaActiva === "Todos" || p.categoria === categoriaActiva;
    const matchSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <main className={`container ${styles.page}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Nuestra Carta</h1>
          <p className={styles.subtitle}>
            Platos artesanales preparados al momento con ingredientes seleccionados
          </p>
        </div>

        <div className={styles.headerActions}>
          <button 
            className={styles.cartToggleButton}
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag size={18} />
            <span>Ver Pedido</span>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.controlsBar}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar por nombre o ingrediente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.categoryFilters}>
          {categorias.map(cat => (
            <button
              key={cat}
              className={`${styles.categoryBtn} ${categoriaActiva === cat ? styles.active : ""}`}
              onClick={() => setCategoriaActiva(cat)}
            >
              <span>{CATEGORY_ICONS[cat] || "🍽️"}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.menuGrid}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`skeleton ${styles.skeletonCard}`}></div>
          ))}
        </div>
      ) : (
        <div className={styles.menuGrid}>
          {platosFiltrados.length === 0 ? (
            <div className={styles.noPlatos}>
              <p>No se encontraron platos que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            platosFiltrados.map((plato) => (
              <article key={plato._id} className={styles.platoCard}>
                <div className={styles.imageContainer}>
                  <span className={styles.categoryTagOnCard}>{plato.categoria}</span>
                  {plato.imagen ? (
                    <Image src={plato.imagen} alt={plato.nombre} fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <span>🍽️</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.platoInfo}>
                  <div>
                    <div className={styles.platoHeader}>
                      <h2 className={styles.platoName}>{plato.nombre}</h2>
                      <span className={styles.precio}>${plato.precio.toFixed(2)}</span>
                    </div>
                    <p className={styles.descripcion}>{plato.descripcion}</p>
                  </div>

                  <button 
                    className={styles.addBtn}
                    onClick={() => handleAddToCart(plato)}
                  >
                    <Plus size={16} />
                    <span>Agregar al Pedido</span>
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* Cart Drawer */}
      <div 
        className={`${styles.cartOverlay} ${isCartOpen ? styles.open : ""}`} 
        onClick={() => setIsCartOpen(false)} 
      />

      <aside className={`${styles.cartDrawer} ${isCartOpen ? styles.open : ""}`}>
        <div className={styles.cartHeader}>
          <div className={styles.cartHeaderTitle}>
            <ShoppingBag size={20} color="var(--color-primary)" />
            <span>Tu Pedido Actual</span>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className={styles.cartItems}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <span className={styles.emptyCartIcon}>🛍️</span>
              <p>Tu bolsa de compras está vacía.</p>
              <span style={{ fontSize: '13px' }}>Agrega platos deliciosos desde el menú.</span>
            </div>
          ) : (
            items.map(item => (
              <div key={item.plato._id} className={styles.cartItem}>
                <div className={styles.cartItemInfo}>
                  <h4 className={styles.cartItemName}>{item.plato.nombre}</h4>
                  <span className={styles.cartItemPrice}>
                    ${(item.plato.precio * item.cantidad).toFixed(2)}
                  </span>
                </div>
                
                <div className={styles.quantityControls}>
                  <button onClick={() => updateQuantity(item.plato._id, item.cantidad - 1)}>
                    <Minus size={13} />
                  </button>
                  <span className={styles.qtyValue}>{item.cantidad}</span>
                  <button onClick={() => updateQuantity(item.plato._id, item.cantidad + 1)}>
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total Estimado</span>
            <span className={styles.totalPrice}>${cartTotal.toFixed(2)}</span>
          </div>
          <Link 
            href="/checkout" 
            className={`btn btn-primary ${styles.checkoutBtn} ${items.length === 0 ? styles.disabled : ""}`}
            onClick={() => setIsCartOpen(false)}
          >
            <span>Proceder al Pago</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </aside>
    </main>
  );
}
