// app/(tabs)/chat.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Role = "user" | "assistant";
type Msg = { id: string; role: Role; text: string };

export default function ChatScreen() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList<Msg>>(null);

  useEffect(() => {
    // Willkommen-/Systemnachricht
    setMessages([
      {
        id: "m0",
        role: "assistant",
        text:
          "Willkommen im Chat. Stellen Sie Ihre Frage, später antwortet hier die KI über die API.",
      },
    ]);
  }, []);

  // immer ans Ende scrollen, wenn neue Nachrichten kommen
  useEffect(() => {
    const t = setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(t);
  }, [messages.length, isTyping]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setIsSending(true);
    setInput("");

    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // === HIER SPÄTER DIE KI-API EINBINDEN ===
      // Beispiel:
      // const resp = await fetch("https://dein-backend/chat", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ messages: [...prev, userMsg] }),
      // });
      // const data = await resp.json();
      // const assistantText = data.reply;

      // Demo-Antwort ohne Backend
      await new Promise((r) => setTimeout(r, 700));
      const assistantText =
        "Danke, ich habe Ihre Frage erhalten. Die KI-Antwort wird später über die API erzeugt.";

      const botMsg: Msg = { id: `a-${Date.now()}`, role: "assistant", text: assistantText };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  };

  const renderItem = ({ item }: { item: Msg }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.bubbleRow, isUser ? styles.rowRight : styles.rowLeft]}>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
          <Text style={[styles.bubbleText, isUser ? styles.textUser : styles.textAssistant]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        {isTyping && (
          <View style={styles.typingBar}>
            <ActivityIndicator />
            <Text style={styles.typingText}>KI schreibt</Text>
          </View>
        )}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Ihre Frage"
            value={input}
            onChangeText={setInput}
            multiline
            editable={!isSending}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !canSend ? styles.sendBtnDisabled : null]}
            onPress={handleSend}
            disabled={!canSend}
          >
            <Text style={styles.sendBtnText}>Senden</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
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
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingText: { fontSize: 13, color: "#6B7280" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 8,
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
    backgroundColor: "#007AFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: "#BFC7D1" },
  sendBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
