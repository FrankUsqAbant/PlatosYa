"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, LogOut, Menu, X, ChefHat, UtensilsCrossed } from "lucide-react";
import styles from "./Navbar.module.css";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount, clearCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href) => pathname === href;

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.navContainer}`}>
        <button 
          className={styles.mobileToggle} 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-label="Menú"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🍽️</span>
          <span>Plato<span className={styles.logoAccent}>Ya</span></span>
        </Link>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
          <ul className={styles.navList}>
            <li>
              <Link
                href="/menu"
                className={`${styles.navLink} ${isActive("/menu") ? styles.navLinkActive : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <UtensilsCrossed size={15} />
                <span>Menú</span>
              </Link>
            </li>

            {session?.user?.role === "cocinero" && (
              <li>
                <Link
                  href="/kitchen"
                  className={`${styles.navLink} ${isActive("/kitchen") ? styles.navLinkActive : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ChefHat size={15} />
                  <span>Cocina</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className={styles.actions}>
          {session ? (
            <div className={styles.userMenu}>
              <Link 
                href="/orders" 
                className={`${styles.userChip} ${isActive("/orders") ? styles.userChipActive : ""}`}
              >
                <span className={styles.userAvatar}>
                  {session?.user?.name ? String(session.user.name)[0].toUpperCase() : "U"}
                </span>
                <span className={styles.userName}>
                  {session?.user?.name ? String(session.user.name).split(" ")[0] : "Usuario"}
                </span>
              </Link>
              <button 
                onClick={() => { clearCart(); signOut(); }} 
                className={styles.logoutBtn} 
                title="Cerrar Sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className={styles.loginBtn}>
              Ingresar
            </Link>
          )}

          <Link href="/menu" className={styles.cartIcon} aria-label="Ver pedido">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
