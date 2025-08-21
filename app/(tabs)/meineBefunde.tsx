// app/(tabs)/meineBefunde.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Doc = { id: string; title: string; subtitle: string };

const DOCS: Doc[] = [
  {
    id: "1",
    title: "Dokument 1",
    subtitle:
      "Kurzinformation über das Dokument\nLorem ipsum dolor sit amet, consectetur...",
  },
  {
    id: "2",
    title: "Dokument 2",
    subtitle: "Information über das Dokument",
  },
  {
    id: "3",
    title: "Dokument 3",
    subtitle: "Information über das Dokument",
  },
  {
    id: "4",
    title: "Dokument 4",
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam...",
  },
];

export default function MeineBefundeScreen() {
  const handleOpenCategory = (key: "labor" | "arzt") => {
    // TODO: Navigation/Filter auf Kategorieseite
    // z. B. router.push("/befunde/labor")
  };

  const handleOpenDoc = (id: string) => {
    // TODO: Navigation ins Dokument-Detail
    // z. B. router.push(`/befunde/${id}`)
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Kacheln (Laborwerte / Arztbriefe) */}
        <View style={styles.tileRow}>
          <TouchableOpacity
            style={styles.tile}
            onPress={() => handleOpenCategory("labor")}
          >
            <View style={styles.tileBox}>
              <Ionicons
                name="flask"
                size={80}
                color="#9CA3AF"
                style={styles.tileIcon}
              />
              <Text style={styles.tileLabel}>Laborwerte</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tile}
            onPress={() => handleOpenCategory("arzt")}
          >
            <View style={styles.tileBox}>
              <Ionicons
                name="document-text"
                size={80}
                color="#9CA3AF"
                style={styles.tileIcon}
              />
              <Text style={styles.tileLabel}>Arztbriefe</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Liste der Dokumente */}
        <View style={styles.list}>
          {DOCS.map((d, idx) => (
            <View key={d.id}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => handleOpenDoc(d.id)}
              >
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{d.title}</Text>
                  <Text style={styles.rowSubtitle} numberOfLines={2}>
                    {d.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#111827" />
              </TouchableOpacity>
              {/* Divider (nicht nach letztem Element) */}
              {idx < DOCS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const TILE_SIZE = 132;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 },

  // Tiles
  tileRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  tile: {
    flex: 1,
  },
  tileBox: {
    aspectRatio: 1, // quadratisch
    backgroundColor: "#ECEFF3",
    borderRadius: 16,
    justifyContent: "center", // Icon mittig
    alignItems: "center",
    position: "relative",
    elevation: 2,
  },
  tileIcon: {
    // sitzt mittig wegen justifyContent/alignItems
  },
  tileLabel: {
    position: "absolute",
    left: 12,
    bottom: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },

  // List
  list: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  row: {
    paddingVertical: 12,
    paddingRight: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  rowText: { flex: 1, paddingRight: 8 },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  rowSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
});
