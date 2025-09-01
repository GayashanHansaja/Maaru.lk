import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(Root)/(auth)/Login'); // Adjust the path if needed
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/maaru_splash.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to Maaru.LK</Text>
      <Text style={styles.subtitle}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1a73e8",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 30,
  },
});