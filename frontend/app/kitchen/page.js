"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";
import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/context/ToastContext";
import styles from "./page.module.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";

const COLUMNS = {
  pendiente: { id: "pendiente", title: "Pendiente" },
  en_preparacion: { id: "en_preparacion", title: "En Preparación" },
  listo: { id: "listo", title: "Listo" },
  entregado: { id: "entregado", title: "Entregado" },
};

export default function KitchenPage() {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const { addToast } = useToast();
  
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchPedidos();
    }
  }, [session]);

  useEffect(() => {
    if (!socket) return;

    socket.on("pedido:nuevo", (nuevoPedido) => {
      setPedidos((prev) => [nuevoPedido, ...prev]);
      addToast(`Nuevo pedido: #${nuevoPedido._id.slice(-6)}`, "success");
    });

    socket.on("pedido:actualizado", (pedidoActualizado) => {
      setPedidos((prev) => 
        prev.map(p => p._id === pedidoActualizado._id ? pedidoActualizado : p)
      );
    });

    return () => {
      socket.off("pedido:nuevo");
      socket.off("pedido:actualizado");
    };
  }, [socket, addToast]);

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
      addToast("Error al cargar pedidos", "error");
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const newEstado = destination.droppableId;
    
    // Optimistic UI update
    setPedidos((prev) => 
      prev.map(p => p._id === draggableId ? { ...p, estado: newEstado } : p)
    );

    try {
      await apiFetch(`/pedidos/${draggableId}/estado`, {
        method: "PATCH",
        token: session.user.accessToken,
        body: JSON.stringify({ estado: newEstado })
      });
    } catch (error) {
      console.error("Error updating status:", error);
      addToast("Error al cambiar estado", "error");
      fetchPedidos();
    }
  };

  const getElapsedTime = (createdAt) => {
    const diff = now.getTime() - new Date(createdAt).getTime();
    const minutes = Math.floor(diff / 60000);
    return minutes;
  };

  const getPedidosByEstado = (estado) => {
    return pedidos.filter(p => p.estado === estado).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  if (loading) {
    return (
      <div className={`container ${styles.kitchenLayout}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Comandas</h1>
        </div>
        <div className={styles.board}>
          {Object.keys(COLUMNS).map(col => (
            <div key={col} className={styles.columnWrapper}>
               <div className="skeleton" style={{ width: "100%", height: 300 }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.kitchenLayout}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Comandas</h1>
        <span className="label">[{pedidos.filter(p => p.estado !== 'entregado').length}] Activas</span>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.board}>
          {Object.entries(COLUMNS).map(([columnId, column]) => {
            const columnPedidos = getPedidosByEstado(columnId);
            
            return (
              <div key={columnId} className={styles.columnWrapper}>
                <div className={styles.columnHeader}>
                  <h2 className={styles.columnTitle}>{column.title}</h2>
                  <span className="label">{columnPedidos.length}</span>
                </div>
                
                <Droppable droppableId={columnId}>
                  {(provided, snapshot) => (
                    <div 
                      className={`${styles.columnContent} ${snapshot.isDraggingOver ? styles.isDraggingOver : ''}`}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {columnPedidos.map((pedido, index) => {
                        const elapsedMins = getElapsedTime(pedido.createdAt);
                        const isLate = elapsedMins >= 30 && (pedido.estado === 'pendiente' || pedido.estado === 'en_preparacion');
                        
                        return (
                          <Draggable key={pedido._id} draggableId={pedido._id} index={index}>
                            {(provided, snapshot) => (
                              <article
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`${styles.orderCard} ${snapshot.isDragging ? styles.isDragging : ''} ${isLate ? styles.lateOrder : ''}`}
                              >
                                <div className={styles.cardHeader}>
                                  <div className={styles.dragHandle} {...provided.dragHandleProps}>
                                    <GripVertical size={16} className={styles.gripIcon} />
                                  </div>
                                  <span className="label">#{pedido._id.slice(-6).toUpperCase()}</span>
                                  <span className={`label ${isLate ? styles.timerLate : ''}`} style={{ marginLeft: 'auto' }}>
                                    {elapsedMins} min
                                  </span>
                                </div>
                                
                                <div className={styles.cardBody}>
                                  <ul className={styles.itemsList}>
                                    {pedido.items.map((item, idx) => (
                                      <li key={idx}>
                                        <span className={styles.itemQty}>{item.cantidad}×</span>
                                        <span className={styles.itemName}>{item.nombre}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className={styles.cardFooter}>
                                  <span className={styles.customerName}>{pedido.cliente.nombre}</span>
                                </div>
                              </article>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
