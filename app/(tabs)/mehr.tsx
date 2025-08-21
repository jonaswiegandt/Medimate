// app/(tabs)/mehr.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MehrScreen() {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const Row = ({
    left,
    right,
    onPress,
    accessibilityLabel,
  }: {
    left: React.ReactNode;
    right?: React.ReactNode;
    onPress?: () => void;
    accessibilityLabel?: string;
  }) => (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={styles.row}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.rowLeft}>{left}</View>
      <View style={styles.rowRight}>{right}</View>
    </TouchableOpacity>
  );

  const Divider = () => <View style={styles.divider} />;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Row
            left={
              <View style={styles.iconWithText}>
                <Ionicons name="globe-outline" size={18} color="#111827" />
                <Text style={[styles.rowText, { marginLeft: 8 }]}>Sprache</Text>
              </View>
            }
            right={
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            }
            onPress={() => {}}
            accessibilityLabel="Sprache ändern"
          />
          <Divider />
          <Row
            left={<Text style={styles.rowText}>Hoher Kontrast</Text>}
            right={
              <Switch value={highContrast} onValueChange={setHighContrast} />
            }
            accessibilityLabel="Hoher Kontrast umschalten"
          />
          <Divider />
          <Row
            left={<Text style={styles.rowText}>Große Schrift</Text>}
            right={<Switch value={largeText} onValueChange={setLargeText} />}
            accessibilityLabel="Große Schrift umschalten"
          />
        </View>

        <View style={styles.card}>
          <Row
            left={<Text style={styles.rowText}>Text‑to‑Speech</Text>}
            right={<Switch value={ttsEnabled} onValueChange={setTtsEnabled} />}
            accessibilityLabel="Text to Speech umschalten"
          />
        </View>

        <View style={styles.card}>
          <Row
            left={<Text style={styles.rowText}>Feedback</Text>}
            right={
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            }
            onPress={() => {}}
            accessibilityLabel="Feedback öffnen"
          />
          <Divider />
          <Row
            left={<Text style={styles.rowText}>Datenschutz</Text>}
            right={
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            }
            onPress={() => {}}
            accessibilityLabel="Datenschutzhinweise öffnen"
          />
          <Divider />
          <Row
            left={<Text style={styles.rowText}>Support</Text>}
            right={
              <Ionicons name="chevron-forward" size={18} color="#111827" />
            }
            onPress={() => {}}
            accessibilityLabel="Support öffnen"
          />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 16 },
  card: {
    backgroundColor: "#EDEEEF",
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 60, // <--- Zeilenhöhe festlegen
  },
  rowLeft: { flex: 1 },
  rowRight: {},
  rowText: { fontSize: 15, color: "#111827", },
  divider: {
    height: 1,
    backgroundColor: "#D6D8DB",
  },
  iconWithText: {
    flexDirection: "row",
    alignItems: "center",
  },
});
