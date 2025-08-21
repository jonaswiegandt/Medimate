// app/index.tsx
import { Redirect } from "expo-router";

function useIsLoggedIn() {
  // TODO: aus deinem Auth-State holen
  return false;
}

export default function Index() {
  const isLoggedIn = useIsLoggedIn();
  return <Redirect href={isLoggedIn ? "/(tabs)" : "/login"} />;
}
