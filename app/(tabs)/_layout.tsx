// app/(tabs)/_layout.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

// TODO: später aus Auth-State holen
const userName = "Beispiel User";

// Einheitlicher Header
function Header({ title }: { title: string }) {
  return (
    <View style={styles.headerContainer}>
      {/* Linke Seite: Titel */}
      <View style={styles.left}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      {/* Rechte Seite: Name im Badge */}
      <View style={styles.right}>
        <View style={styles.userBadge}>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        headerTitle: "",
        headerShadowVisible: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          paddingBottom: insets.bottom, // Dynamischer Abstand
        },
      }}
    >
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          header: () => <Header title="Chat" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses"
              size={size ?? 26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="meineBefunde"
        options={{
          title: "Meine Befunde",
          header: () => <Header title="Meine Befunde" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size ?? 26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="einfachErklaert"
        options={{
          title: "Einfach erklärt",
          header: () => <Header title="Einfach erklärt" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size ?? 26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mehr"
        options={{
          title: "Mehr",
          header: () => <Header title="Mehr" />,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="ellipsis-horizontal-circle"
              size={size ?? 26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 80 + (Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0),
    backgroundColor: "#F1F2F3",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch", // beide Seiten füllen volle Höhe
    paddingHorizontal: 16,
  },
  left: {
    justifyContent: "flex-end", // Titel nach unten
  },
  right: {
    justifyContent: "flex-end", // Name nach unten
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 10,
  },
  userBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    marginBottom: 10,
  },
  userName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },
});
