"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";
import { useSocket } from "@/context/SocketContext";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { Package, Clock, CheckCircle, ChefHat } from "lucide-react";

const STATUS_CONFIG = {
  pendiente: {
    label: "Pendiente",
    color: "#DDA750",
    bg: "#FFF8EC",
    icon: Clock,
    description: "Tu pedido está en la cola de la cocina"
  },
  en_preparacion: {
    label: "En Preparación",
    color: "#8A9A73",
    bg: "#F4F7F1",
    icon: ChefHat,
    description: "El chef está preparando tus platos"
  },
  listo: {
    label: "Listo",
    color: "#5D7A5B",
    bg: "#F0F5EF",
    icon: Package,
    description: "Tu pedido está listo para ser recogido"
  },
  entregado: {
    label: "Entregado ✓",
    color: "#9B8C78",
    bg: "#F7F4F0",
    icon: CheckCircle,
    description: "Pedido entregado exitosamente"
  },
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchPedidos();
    }
  }, [session]);

  useEffect(() => {
    if (!socket) return;

    socket.on("pedido:actualizado", (pedidoActualizado) => {
      setPedidos((prev) =>
        prev.map(p => p._id === pedidoActualizado._id ? pedidoActualizado : p)
      );
    });

    return () => {
      socket.off("pedido:actualizado");
    };
  }, [socket]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/pedidos", {
        token: session.user.accessToken
      });
      if (data.success) {
        setPedidos(data.pedidos);
      }
    } catch (error) {
      console.error("Error fetching pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  if (loading) {
    return (
      <main className={`container ${styles.pageLayout}`}>
        <h1 className={styles.title}>Mis Pedidos</h1>
        <div className={styles.ordersList}>
          {[1, 2, 3].map(i => (
            <div key={i} className={`skeleton ${styles.skeletonCard}`} />
          ))}
        </div>
      </main>
    );
  }

  if (pedidos.length === 0) {
    return (
      <main className={`container ${styles.pageLayout}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🍽️</div>
          <h2 className={styles.emptyTitle}>Sin historial todavía</h2>
          <p className={styles.emptyDesc}>Aún no has realizado ningún pedido.</p>
          <Link href="/menu" className={styles.emptyBtn}>
            Explorar el Menú →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`container ${styles.pageLayout}`}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Mis Pedidos</h1>
        <span className={styles.orderCount}>{pedidos.length} pedido{pedidos.length !== 1 ? "s" : ""}</span>
      </div>

      <div className={styles.ordersList}>
        {pedidos.map((pedido) => {
          const statusConf = STATUS_CONFIG[pedido.estado] || STATUS_CONFIG.pendiente;
          const StatusIcon = statusConf.icon;

          return (
            <article key={pedido._id} className={styles.orderCard}>
              {/* Header */}
              <div className={styles.orderHeader}>
                <div className={styles.orderMeta}>
                  <span className={styles.orderId}>#{pedido._id.slice(-6).toUpperCase()}</span>
                  <span className={styles.orderDate}>{formatDate(pedido.createdAt)}</span>
                </div>
                <div
                  className={styles.statusBadge}
                  style={{ color: statusConf.color, backgroundColor: statusConf.bg }}
                >
                  <StatusIcon size={14} />
                  <span>{statusConf.label}</span>
                </div>
              </div>

              {/* Status Progress Bar */}
              <div className={styles.progressBar}>
                {["pendiente", "en_preparacion", "listo", "entregado"].map((s, i) => {
                  const estados = ["pendiente", "en_preparacion", "listo", "entregado"];
                  const currentIndex = estados.indexOf(pedido.estado);
                  const isActive = i <= currentIndex;
                  return (
                    <div key={s} className={`${styles.progressStep} ${isActive ? styles.progressStepActive : ""}`} />
                  );
                })}
              </div>
              <p className={styles.statusDescription}>{statusConf.description}</p>

              {/* Items with images */}
              <div className={styles.itemsGrid}>
                {pedido.items.map((item, idx) => (
                  <div key={idx} className={styles.itemRow}>
                    <div className={styles.itemImageWrap}>
                      {item.imagen ? (
                        <Image src={item.imagen} alt={item.nombre} fill style={{ objectFit: "cover" }} />
                      ) : (
                        <div className={styles.itemImageFallback}>
                          <span>🍽️</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.nombre}</span>
                      <span className={styles.itemQtyPrice}>{item.cantidad}× · ${(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className={styles.orderFooter}>
                <div className={styles.addressInfo}>
                  <span className={styles.footerLabel}>📍 {pedido.direccion.calle}, {pedido.direccion.ciudad}</span>
                </div>
                <div className={styles.totalInfo}>
                  <span className={styles.footerLabel}>Total abonado</span>
                  <span className={styles.orderTotal}>${pedido.total.toFixed(2)}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
