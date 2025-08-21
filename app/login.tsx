// app/login.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const length = 5;
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef<Array<TextInput | null>>([]);

  const code = useMemo(() => digits.join(""), [digits]);
  const isComplete = code.length === length && /^\d+$/.test(code);

  const handleChange = (idx: number, val: string) => {
    const v = (val.match(/\d/) || [""])[0];
    const next = [...digits];
    next[idx] = v;
    setDigits(next);
    setError("");
    if (v && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (idx: number, e: any) => {
    if (e.nativeEvent.key === "Backspace" && !digits[idx] && idx > 0) {
      const next = [...digits];
      next[idx - 1] = "";
      setDigits(next);
      inputs.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (!isComplete) {
      setError("Bitte geben Sie den vollständigen 5-stelligen Code ein.");
      return;
    }

    setIsLoading(true);
    try {
      // Beispiel: Codeprüfung simulieren
      await new Promise((r) => setTimeout(r, 800));

      if (code !== "12345") {
        // Beispiel: ungültiger Code
        setError("Der eingegebene Code ist ungültig.");
        return;
      }

      // Erfolg → Tabs öffnen
      router.replace("/willkommen");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Anmeldung</Text>

        <Text style={styles.subtitle}>
          Bitte geben Sie den Code,{"\n"}den Sie vom Krankenhaus erhalten haben ein
        </Text>

        <View style={styles.codeRow}>
          {Array.from({ length }).map((_, i) => (
            <TextInput
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              style={[
                styles.codeInput,
                error ? { borderColor: "#ff3b30" } : null,
              ]}
              value={digits[i]}
              onChangeText={(t) => handleChange(i, t)}
              onKeyPress={(e) => handleKeyPress(i, e)}
              keyboardType="number-pad"
              maxLength={1}
              textContentType="oneTimeCode"
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.orText}>oder scannen Sie den QR-Code.</Text>

        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => router.push("/scan")}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-outline" size={36} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitBtn,
            !isComplete || isLoading ? styles.submitBtnDisabled : null,
          ]}
          onPress={handleSubmit}
          disabled={!isComplete || isLoading}
        >
          <Text style={styles.submitText}>
            {isLoading ? "Anmelden..." : "Bestätigen"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const BOX = 54;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8, textAlign: "center" },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 28,
    lineHeight: 20,
  },
  codeRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginBottom: 12,
  },
  codeInput: {
    width: BOX,
    height: BOX,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    backgroundColor: "#FAFAFA",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 13,
    marginBottom: 12,
  },
  orText: { marginTop: 10, marginBottom: 10, color: "#666", fontSize: 13 },
  qrButton: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DADADA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  submitBtn: {
    alignSelf: "stretch",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 32,
  },
  submitBtnDisabled: { backgroundColor: "#BFC7D1" },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
