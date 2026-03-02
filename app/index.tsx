import { Redirect } from "expo-router";
import { useApp } from "@/context/AppContext";
import { View, ActivityIndicator } from "react-native";
import Colors from "@/constants/colors";

export default function Index() {
  const { user, isLoading } = useApp();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.primary }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/home" />;
  }
  return <Redirect href="/login" />;
}
