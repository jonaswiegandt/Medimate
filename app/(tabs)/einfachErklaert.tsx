// app/(tabs)/einfachErklaert.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TOPICS = [
  "Blutwerte",
  "Röntgenbefund",
  "CT-Ergebnis",
  "Kreislauf",
  "Medikamente",
  "Operation",
  "Nachsorge",
  "Impfungen",
];

export default function EinfachErklaertScreen() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      TOPICS.filter((t) =>
        t.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Suche */}
        <TextInput
          style={styles.search}
          placeholder="Themen suchen"
          value={search}
          onChangeText={setSearch}
        />

        {/* Text-Kacheln */}
        <View style={styles.grid}>
          {filtered.map((t, i) => (
            <TouchableOpacity
              key={`${t}-${i}`}
              style={styles.tile}
              onPress={() => console.log("Thema:", t)}
              activeOpacity={0.8}
            >
              <View style={styles.tileBox}>
                <Text style={styles.tileLabel}>{t}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 16 },
  search: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  tile: {
    width: "48%", // zwei nebeneinander
  },
  tileBox: {
    aspectRatio: 1, // quadratisch
    backgroundColor: "#ECEFF3",
    borderRadius: 16,
    position: "relative",
    elevation: 2,
  },
  tileLabel: {
    position: "absolute",
    left: 12,
    bottom: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
});
