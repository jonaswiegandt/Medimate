// app/(tabs)/chat.tsx

// -------------------------
// IMPORTS
// -------------------------

import { Ionicons } from "@expo/vector-icons"; // Icon-Bibliothek
import { useHeaderHeight } from "@react-navigation/elements"; // Header-Höhe für Offset
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator, // Spinner für "KI schreibt"
  FlatList, // performante Nachrichtenliste
  Keyboard, // API, um Tastatur zu schließen
  KeyboardAvoidingView, // schiebt Inhalt über Tastatur
  StyleSheet, // Styling
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback, // Tippen außerhalb schließt Tastatur
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // für Abstände unten

// -------------------------
// TYPES
// -------------------------
type Role = "user" | "assistant";
type Msg = { id: string; role: Role; text: string };

// -------------------------
// HILFSKOMPONENTE
// -------------------------
// KeyboardShift sorgt dafür, dass Inhalte über der Tastatur bleiben.
// keyboardVerticalOffset = Höhe des Headers
type KeyboardShiftProps = { children: React.ReactNode };
const KeyboardShift = ({ children }: KeyboardShiftProps) => {
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
      enabled
    >
      {children}
    </KeyboardAvoidingView>
  );
};

// -------------------------
// HAUPTKOMPONENTE
// -------------------------
export default function ChatScreen() {
  // State für Nachrichten
  const [messages, setMessages] = useState<Msg[]>([]);
  // Eingabetext
  const [input, setInput] = useState("");
  // Flag: gerade wird gesendet
  const [isSending, setIsSending] = useState(false);
  // Flag: KI tippt (Demo)
  const [isTyping, setIsTyping] = useState(false);
  // Höhe der Eingabeleiste
  const [inputBarHeight, setInputBarHeight] = useState(56);

  // Ref für FlatList zum Scrollen
  const listRef = useRef<FlatList<Msg> | null>(null);

  // Safe-Area (z. B. iPhone Home Bar)
  const insets = useSafeAreaInsets();

  // -------------------------
  // EFFECTS
  // -------------------------

  // Initiale KI-Begrüßung
  useEffect(() => {
    setMessages([
      {
        id: "m0",
        role: "assistant",
        text: "Willkommen im Chat. Stellen Sie Ihre Frage, später antwortet hier die KI über die API.",
      },
    ]);
  }, []);

  // Immer nach unten scrollen, wenn Nachrichten oder Typing-Status ändern
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

  // Button nur aktiv, wenn Text da und nicht gesendet wird
  const canSend = useMemo(
    () => input.trim().length > 0 && !isSending,
    [input, isSending]
  );

  // Abstand am Ende der Liste: Eingabeleiste + SafeArea
  const listBottomPadding = inputBarHeight + insets.bottom + 8;

  // -------------------------
  // HANDLER
  // -------------------------

  // Nachricht senden
  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setIsSending(true);
    setInput("");

    // Nachricht von User:in hinzufügen
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Fake-Delay
      await new Promise((r) => setTimeout(r, 700));
      // Demoantwort der KI
      const botMsg: Msg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: "Danke, ich habe Ihre Frage erhalten. Die KI-Antwort wird später über die API erzeugt.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
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
                setTimeout(
                  () => listRef.current?.scrollToEnd({ animated: true }),
                  0
                )
              }
              keyboardShouldPersistTaps="handled"
            />

            {/* Typing-Indikator */}
            {isTyping && (
              <View style={styles.typingBar}>
                <ActivityIndicator />
                <Text style={styles.typingText}>KI schreibt</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>

        {/* Eingabeleiste */}
        <View
          style={[styles.inputBar, { paddingBottom: 8 }]} // nur fester Abstand
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
