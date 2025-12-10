// app/(tabs)/chat.tsx

// -------------------------
// IMPORTS
// -------------------------

import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// -------------------------
// TYPES
// -------------------------

// Rolle einer Chatnachricht: entweder Nutzer*in oder KI
type Role = "user" | "assistant";

// Struktur einer Chatnachricht
type Msg = { id: string; role: Role; text: string };

// Struktur der n8n-Antwort
type N8nResponse = {
  answer: string;
  usage?: any;
  meta?: any;
  error?: string;
};

// ----------------------------------
// n8n Webhook Client
// Diese Funktion sendet die Nachricht an n8n,
// wartet auf die Antwort (ChatGPT) und gibt sie zurück.
// ----------------------------------

const N8N_WEBHOOK_URL = "https://medimate.app.n8n.cloud/webhook/fe469b09-cb03-4cc2-aae8-cdf116cf0681"; // anpassen

async function callN8n(message: string, sessionId?: string, extra?: any): Promise<N8nResponse> {
  // Timeout-Controller, falls n8n nicht antwortet
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    // Sende Nachricht an n8n
    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Anfrage-Body mit Text & Metadaten
      body: JSON.stringify({
        message,
        metadata: { sessionId, ...extra },
      }),
      signal: controller.signal,
    });

    // Antwort als JSON lesen
    const data = (await res.json()) as N8nResponse;

    // Falls Server mit Fehlermeldung antwortet
    if (!res.ok) {
      return { answer: "", error: data?.error || `HTTP ${res.status}` };
    }

    return data;
  } catch (e: any) {
    // Reiner Timeout
    if (e?.name === "AbortError") {
      return { answer: "", error: "Zeitüberschreitung" };
    }
    // Andere Netzwerkfehler
    return { answer: "", error: e?.message || "Unbekannter Fehler" };
  } finally {
    clearTimeout(timeout);
  }
}

// -------------------------
// HILFSKOMPONENTE – Tastatur korrekt verschieben
// -------------------------

type KeyboardShiftProps = { children: React.ReactNode };
const KeyboardShift = ({ children }: KeyboardShiftProps) => {
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

// -------------------------
// HAUPTKOMPONENTE
// -------------------------

export default function ChatScreen() {
  // messages:
  //   Liste aller Chatnachrichten im Chat.
  const [messages, setMessages] = useState<Msg[]>([]);

  // input:
  //   Aktueller Text im Eingabefeld.
  const [input, setInput] = useState("");

  // isSending:
  //   True, wenn eine Nachricht gerade an n8n gesendet wird.
  const [isSending, setIsSending] = useState(false);

  // isTyping:
  //   True, wenn die KI antwortet (Anzeige des "KI schreibt" Indikators).
  const [isTyping, setIsTyping] = useState(false);

  // inputBarHeight:
  //   Höhe der Eingabeleiste, damit die Liste korrekt nach unten gescrollt wird.
  const [inputBarHeight, setInputBarHeight] = useState(56);

  // listRef:
  //   Referenz auf die FlatList, um automatisch nach unten scrollen zu können.
  const listRef = useRef<FlatList<Msg> | null>(null);

  // sessionId:
  //   Eindeutige ID der aktuellen Chat-Sitzung.
  const [sessionId] = useState(() => `s-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  // Safe Area Abstände
  const insets = useSafeAreaInsets();

  // -------------------------
  // EFFECTS
  // -------------------------

  // Initiale Begrüßungsnachricht
  useEffect(() => {
    setMessages([
      {
        id: "m0",
        role: "assistant",
        text: "Willkommen! Ich bin MediMate.\n\nIch unterstütze Patient*innen dabei, medizinische Befunde besser zu verstehen. Sie können mir jederzeit Fragen zu Ihren Untersuchungsergebnissen stellen. Ich erkläre medizinische Fachbegriffe verständlich, ordne Werte ein und helfe Ihnen, die nächsten Schritte besser einzuschätzen.\n\nMediMate ersetzt keine ärztliche Beratung. Bei Unsicherheiten oder gesundheitlichen Beschwerden sollten Sie sich immer an Ihr behandelndes Ärzt*innen-Team wenden.\n\nWie kann ich Ihnen weiterhelfen?",
      },
    ]);
  }, []);

  // Scrollt immer ans Ende, wenn neue Nachrichten eintreffen oder die KI schreibt
  useEffect(() => {
    const t = setTimeout(
      () => listRef.current?.scrollToEnd({ animated: true }),
      100
    );
    return () => clearTimeout(t);
  }, [messages.length, isTyping]);

  // -------------------------
  // ABGELEITETE WERTE
  // -------------------------

  // Kann der Senden-Button aktiv sein?
  const canSend = useMemo(
    () => input.trim().length > 0 && !isSending,
    [input, isSending]
  );

  // Padding der Liste am unteren Rand = Eingabefeld + SafeArea
  const listBottomPadding = inputBarHeight + insets.bottom + 8;

  // -------------------------
  // HANDLER
  // -------------------------

  // ------------------------------------------------------
  // Funktion: handleSend
  // Aufgabe:
  //   - Fügt Nutzer-Nachricht zur Liste hinzu
  //   - Ruft callN8n() auf
  //   - Zeigt KI-Antwort an
  // ------------------------------------------------------

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    // Sperrt den Sendebutton
    setIsSending(true);

    // Eingabe löschen
    setInput("");

    // Nutzer-Nachricht anzeigen
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    // "KI schreibt"-Indikator aktivieren
    setIsTyping(true);

    try {
      // KI-Antwort von n8n holen
      const resp = await callN8n(text, sessionId);

      if (resp.error) {
        // Fehlerantwort anzeigen
        const errMsg: Msg = {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: `Fehler: ${resp.error}`,
        };
        setMessages((prev) => [...prev, errMsg]);
      } else {
        // Antwort von ChatGPT anzeigen
        const botMsg: Msg = {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: resp.answer || "(keine Antwort erhalten)",
        };
        setMessages((prev) => [...prev, botMsg]);
      }

    } finally {
      // Status zurücksetzen
      setIsTyping(false);
      setIsSending(false);
    }
  };

  // Nachricht rendern
  const renderItem = ({ item }: { item: Msg }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={[styles.bubbleRow, isUser ? styles.rowRight : styles.rowLeft]}
      >
        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleAssistant,
          ]}
        >
          <Text
            style={[
              styles.bubbleText,
              isUser ? styles.textUser : styles.textAssistant,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  // -------------------------
  // RENDER
  // -------------------------

  return (
    <KeyboardShift>
      <View style={styles.inner}>
        {/* Nachrichtenliste */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.flex}>
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(m) => m.id}
              renderItem={renderItem}
              style={{ flex: 1 }}
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: listBottomPadding },
              ]}
              onContentSizeChange={() =>
                setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 0)
              }
              keyboardShouldPersistTaps="handled"
            />

            {/* KI schreibt */}
            {isTyping && (
              <View style={styles.typingBar}>
                <ActivityIndicator />
                <Text style={styles.typingText}>KI schreibt</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>

        {/* Eingabefeld */}
        <View
          style={[styles.inputBar]}
          onLayout={(e) => setInputBarHeight(e.nativeEvent.layout.height)}
        >
          <TextInput
            style={styles.input}
            placeholder="Ihre Frage"
            value={input}
            onChangeText={setInput}
            multiline
            editable={!isSending}
            blurOnSubmit={false}
            returnKeyType="send"
            enablesReturnKeyAutomatically
          />
          <TouchableOpacity
            style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!canSend}
          >
            <Ionicons
              name="arrow-forward-circle-outline"
              size={28}
              color={canSend ? "#007AFF" : "#BFC7D1"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardShift>
  );
}

// -------------------------
// STYLES
// -------------------------

const styles = StyleSheet.create({
  inner: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },

  listContent: { paddingHorizontal: 16, paddingTop: 12 },

  bubbleRow: { marginVertical: 4, flexDirection: "row" },
  rowRight: { justifyContent: "flex-end" },
  rowLeft: { justifyContent: "flex-start" },

  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  bubbleUser: { backgroundColor: "#007AFF" },
  bubbleAssistant: { backgroundColor: "#EEF1F4" },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  textUser: { color: "white" },
  textAssistant: { color: "#122031" },

  typingBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: { marginLeft: 8, fontSize: 13, color: "#6B7280" },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  sendBtn: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.6 },
});
