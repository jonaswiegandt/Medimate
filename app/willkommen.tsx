// app/willkommen.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Feature = {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  route: string;
};

const FEATURES: Feature[] = [
  {
    title: "Chat",
    description:
      "Stellen Sie Fragen zu Ihren Dokumenten und erhalten Sie klare, verständliche Antworten.",
    icon: "chatbubble-ellipses",
    route: "/(tabs)/chat",
  },
  {
    title: "Meine Befunde",
    description:
      "Alle medizinischen Dokumente an einem Ort. Übersicht, Verlauf und Details auf einen Blick.",
    icon: "document-text",
    route: "/(tabs)/meineBefunde",
  },
  {
    title: "Einfach erklärt",
    description:
      "Medizinische Fachbegriffe und Befunde in verständlicher Sprache erläutert.",
    icon: "book",
    route: "/(tabs)/einfachErklaert",
  },
];

export default function WillkommenScreen() {
  const router = useRouter();

  const handleWeiterButton = () => {
    router.replace("/(tabs)/chat");
  };

  const handleCardPress = (route: string) => {
    router.replace(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Willkommen</Text>
          <Text style={styles.welcomeSubtitle}>
            Schön, dass Sie da sind. Hier finden Sie eine kurze Übersicht der
            wichtigsten Funktionen.
          </Text>
        </View>

        {/* Info Karten */}
        <View style={styles.cards}>
          {FEATURES.map((f, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.card}
              onPress={() => handleCardPress(f.route)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <Ionicons
                  name={f.icon}
                  size={24}
                  color="#007AFF"
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>{f.title}</Text>
              </View>
              <Text style={styles.cardText}>{f.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hauptbutton */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleWeiterButton}
        >
          <Text style={styles.continueButtonText}>Zum Chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  header: { alignItems: "center", marginTop: 10 },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  cards: { marginTop: 12, gap: 12 },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
  },
  cardText: { fontSize: 14, color: "#59636e", lineHeight: 20 },
  continueButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  continueButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
