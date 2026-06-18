"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { apiFetch } from "@/lib/api";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";
import Link from "next/link";
import { CheckCircle, Loader } from "lucide-react";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { addToast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const [direccion, setDireccion] = useState({
    calle: "",
    ciudad: "",
    codigoPostal: "",
    referencia: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  // Snapshot del carrito para no perder los datos cuando se limpia
  const cartSnapshotRef = useRef(null);

  useEffect(() => {
    if (items.length > 0) {
      cartSnapshotRef.current = { items: [...items], total: cartTotal };
    }
  }, [items, cartTotal]);

  useEffect(() => {
    setIsFormValid(direccion.calle.trim() !== "" && direccion.ciudad.trim() !== "");
  }, [direccion]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDireccion((prev) => ({ ...prev, [name]: value }));
  };

  // Función central para crear el pedido en el backend
  const createOrderInBackend = async (paypalOrderId) => {
    const snapshot = cartSnapshotRef.current;
    if (!snapshot) throw new Error("No hay datos del carrito.");

    const token = session?.user?.accessToken;
    if (!token) throw new Error("No hay sesión activa. Inicia sesión e intenta de nuevo.");

    const backendItems = snapshot.items.map(item => ({
      plato: item.plato._id,
      nombre: item.plato.nombre,
      precio: item.plato.precio,
      cantidad: item.cantidad
    }));

    await apiFetch("/pagos/verificar", {
      method: "POST",
      token,
      body: JSON.stringify({
        paypalOrderId,
        items: backendItems,
        total: snapshot.total,
        direccion
      }),
    });
  };

  // Manejador para PayPal
  const handlePayPalApprove = async (data, actions) => {
    setIsProcessing(true);
    try {
      // Usar el orderID de PayPal directamente (más confiable que actions.order.capture)
      let paypalOrderId = data?.orderID;

      // Intentar la captura oficial
      try {
        const captured = await actions.order?.capture();
        if (captured?.id) paypalOrderId = captured.id;
      } catch (captureErr) {
        console.warn("Captura PayPal - usando orderID como fallback:", captureErr?.message);
      }

      if (!paypalOrderId) throw new Error("ID de orden PayPal no disponible.");

      await createOrderInBackend(paypalOrderId);

      setOrderSuccess(true);
      clearCart();
      addToast("¡Pedido creado! El cocinero ya lo recibió.", "success");

      setTimeout(() => router.push("/orders"), 2000);

    } catch (error) {
      console.error("Error al procesar pago PayPal:", error);
      addToast(error.message || "Error al procesar el pago.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Pantalla de éxito (antes de redirigir)
  if (orderSuccess) {
    return (
      <main className={`container ${styles.pageLayout}`}>
        <div className={styles.successScreen}>
          <div className={styles.successIcon}>
            <CheckCircle size={64} strokeWidth={1.5} color="var(--color-sage)" />
          </div>
          <h1 className={styles.successTitle}>¡Pedido Confirmado!</h1>
          <p className={styles.successDesc}>Tu pedido ya está en manos del cocinero. Redirigiendo a tus pedidos...</p>
          <div className={styles.successLoader}>
            <Loader size={20} className={styles.spin} />
          </div>
        </div>
      </main>
    );
  }

  // Carrito vacío (solo si no hay éxito en curso)
  if (!orderSuccess && (!items || items.length === 0)) {
    return (
      <main className={`container ${styles.pageLayout}`}>
        <div className={styles.emptyCartContainer}>
          <h2 className={styles.title}>Tu pedido está vacío</h2>
          <p className={styles.description}>Agrega algunos platos para continuar.</p>
          <Link href="/menu" className="btn btn-primary">
            Volver al Menú
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`container ${styles.pageLayout}`}>
      <div className={styles.header}>
        <Link href="/menu" className={styles.backLink}>
          ← Volver al menú
        </Link>
        <h1 className={styles.title}>Finalizar Pedido</h1>
      </div>

      <div className={styles.checkoutLayout}>
        {/* Resumen */}
        <div className={styles.orderSummary}>
          <h2 className={styles.sectionTitle}>Tu Pedido</h2>
          <div className={styles.itemsList}>
            {items.map((item) => (
              <div key={item.plato._id} className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemQuantity}>{item.cantidad}×</span>
                  <span className={styles.itemName}>{item.plato.nombre}</span>
                </div>
                <span className={styles.itemPrice}>
                  ${(item.plato.precio * item.cantidad).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.totalRow}>
            <span className="label">Total a pagar</span>
            <span className={styles.totalAmount}>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Pago */}
        <div className={styles.paymentSection}>
          {/* Dirección */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Dirección de Entrega</h2>
            <form className={styles.addressForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="calle" className="label">Calle y número *</label>
                <input type="text" id="calle" name="calle" value={direccion.calle} onChange={handleInputChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="ciudad" className="label">Ciudad *</label>
                <input type="text" id="ciudad" name="ciudad" value={direccion.ciudad} onChange={handleInputChange} required />
              </div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="codigoPostal" className="label">Código Postal</label>
                  <input type="text" id="codigoPostal" name="codigoPostal" value={direccion.codigoPostal} onChange={handleInputChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="referencia" className="label">Referencia</label>
                  <input type="text" id="referencia" name="referencia" value={direccion.referencia} onChange={handleInputChange} />
                </div>
              </div>
            </form>
          </div>

          {/* Métodos de pago */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Método de Pago</h2>

            {!isFormValid ? (
              <div className={styles.formWarning}>
                Completa tu dirección (calle y ciudad) para habilitar el pago.
              </div>
            ) : isProcessing ? (
              <div className={styles.processingPayment}>
                <Loader size={32} className={styles.spin} color="var(--color-ink-muted)" />
                <p className="label">Procesando pedido...</p>
              </div>
            ) : (
              <div className={styles.paypalWrapper}>
                <PayPalScriptProvider
                  options={{
                    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
                    currency: "USD",
                    intent: "capture",
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical", color: "black", shape: "rect", label: "pay" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [{
                          amount: {
                            currency_code: "USD",
                            value: cartTotal.toFixed(2),
                          },
                          description: "Pedido PlatoYa"
                        }],
                      });
                    }}
                    onApprove={handlePayPalApprove}
                    onError={(err) => {
                      console.error("PayPal Error:", err);
                      addToast("Hubo un problema con PayPal. Intenta de nuevo.", "error");
                    }}
                    onCancel={() => addToast("Pago con PayPal cancelado.", "info")}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
