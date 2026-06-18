"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { apiFetch } from "@/lib/api";
import styles from "./page.module.css";
import { X, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function MenuPage() {
  const [platos, setPlatos] = useState([]);
  const [categorias, setCategorias] = useState(["Todos", "Entradas", "Platos Fuertes", "Postres", "Bebidas"]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
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
    addToast(`${plato.nombre} agregado al pedido`, "success");
    setIsCartOpen(true);
  };

  const platosFiltrados = categoriaActiva === "Todos" 
    ? platos 
    : platos.filter(p => p.categoria === categoriaActiva);

  return (
    <main className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Menú</h1>
        <button 
          className={styles.cartToggleButton}
          onClick={() => setIsCartOpen(true)}
        >
          <span className="label">Tu Pedido</span>
          {cartCount > 0 && <span className={styles.cartBadge}>[{cartCount}]</span>}
        </button>
      </div>

      <div className={styles.categoryFilters}>
        {categorias.map(cat => (
          <button
            key={cat}
            className={`${styles.categoryBtn} ${categoriaActiva === cat ? styles.active : ""}`}
            onClick={() => setCategoriaActiva(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.menuGrid}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`skeleton ${styles.skeletonCard}`}></div>
          ))}
        </div>
      ) : (
        <div className={styles.menuGrid}>
          {platosFiltrados.length === 0 ? (
            <p className={styles.noPlatos}>No hay platos disponibles.</p>
          ) : (
            platosFiltrados.map((plato) => (
              <article key={plato._id} className={styles.platoCard}>
                <div className={styles.imageContainer}>
                  {plato.imagen ? (
                    <Image src={plato.imagen} alt={plato.nombre} fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <span className="label">{plato.categoria}</span>
                    </div>
                  )}
                </div>
                <div className={styles.platoInfo}>
                  <div className={styles.platoHeader}>
                    <h2 className={styles.platoName}>{plato.nombre}</h2>
                    <span className={styles.precio}>${plato.precio.toFixed(2)}</span>
                  </div>
                  <p className={styles.descripcion}>{plato.descripcion}</p>
                  <button 
                    className={styles.addBtn}
                    onClick={() => handleAddToCart(plato)}
                  >
                    Agregar al pedido
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* Cart Drawer */}
      <div className={`${styles.cartOverlay} ${isCartOpen ? styles.open : ""}`} onClick={() => setIsCartOpen(false)}></div>
      <aside className={`${styles.cartDrawer} ${isCartOpen ? styles.open : ""}`}>
        <div className={styles.cartHeader}>
          <span className="label">Tu Pedido</span>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
            <X size={20} strokeWidth={1} />
          </button>
        </div>

        <div className={styles.cartItems}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <span className="label">No hay platos seleccionados</span>
            </div>
          ) : (
            items.map(item => (
              <div key={item.plato._id} className={styles.cartItem}>
                <div className={styles.cartItemInfo}>
                  <h4 className={styles.cartItemName}>{item.plato.nombre}</h4>
                  <span className={styles.cartItemPrice}>${(item.plato.precio * item.cantidad).toFixed(2)}</span>
                </div>
                <div className={styles.quantityControls}>
                  <button onClick={() => updateQuantity(item.plato._id, item.cantidad - 1)}>
                    <Minus size={14} />
                  </button>
                  <span className={styles.qtyValue}>{item.cantidad}</span>
                  <button onClick={() => updateQuantity(item.plato._id, item.cantidad + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.totalRow}>
            <span className="label">Total Estimado</span>
            <span className={styles.totalPrice}>${cartTotal.toFixed(2)}</span>
          </div>
          <Link href="/checkout" className={`btn btn-primary ${styles.checkoutBtn} ${items.length === 0 ? styles.disabled : ""}`}>
            Proceder al pago
          </Link>
        </div>
      </aside>
    </main>
  );
}
