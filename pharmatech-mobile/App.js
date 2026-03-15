import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Modal,
  Share,
  Linking,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";

const SITE_URL = "https://pharmatech-zeta.vercel.app";
const WHATSAPP_NUMBER = "994504271773";
const APP_SHARE_URL = "https://pharmatech-zeta.vercel.app";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const webViewRef = useRef(null);

  async function openWhatsApp() {
    setMenuVisible(false);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Salam! Məndə sual var.")}`;
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.warn("WhatsApp open failed:", e);
    }
  }

  async function shareApp() {
    setMenuVisible(false);
    try {
      await Share.share({
        message: `PharmaTech — Gələcəyin Apteki. Məhsulları görün, sifariş verin: ${APP_SHARE_URL}`,
        url: APP_SHARE_URL,
        title: "PharmaTech",
      });
    } catch (e) {
      console.warn("Share failed:", e);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0891b2" />

      {/* Нативный красивый хедер */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Pharma</Text>
            <Text style={styles.titleAccent}>Tech</Text>
          </View>
        </View>
      </View>

      {/* Контент — сайт */}
      <View style={styles.content}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#0891b2" />
            <Text style={styles.loaderText}>Yüklənir...</Text>
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{ uri: SITE_URL }}
          style={[styles.webview, loading && styles.webviewHidden]}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={true}
          allowsInlineMediaPlayback={true}
          scrollEnabled={true}
          bounces={true}
        />
      </View>

      {/* Центральная FAB — меню действий */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setMenuVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Модальное меню */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuCard}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Nə etmək istəyirsiniz?</Text>
              <TouchableOpacity
                onPress={() => setMenuVisible(false)}
                style={styles.menuClose}
              >
                <Text style={styles.menuCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={openWhatsApp}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                <Text style={styles.menuItemEmoji}>💬</Text>
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>WhatsApp-a yazın</Text>
                <Text style={styles.menuItemSub}>Həkim və ya operatorla əlaqə</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemLast]}
              onPress={shareApp}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                <Text style={styles.menuItemEmoji}>📤</Text>
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Tətbiqi paylaşın</Text>
                <Text style={styles.menuItemSub}>Linki dostlarınıza göndərin</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#0891b2",
    paddingTop: Platform.OS === "android" ? 40 : 56,
    paddingBottom: 14,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  titleBlock: {
    flexDirection: "row",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  titleAccent: {
    fontSize: 22,
    fontWeight: "700",
    color: "#67e8f9",
  },
  content: {
    flex: 1,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  webviewHidden: {
    opacity: 0,
    position: "absolute",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 15,
    color: "#64748b",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 32,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0891b2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0891b2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "300",
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  menuClose: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  menuCloseText: {
    fontSize: 24,
    color: "#64748b",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  menuItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#e0f2fe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuItemEmoji: {
    fontSize: 24,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  menuItemSub: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
});
