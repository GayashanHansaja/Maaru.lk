// ...existing code...
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { UserSquareIcon } from '@hugeicons/core-free-icons';

export default function ProductList() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product List</Text>
      <HugeiconsIcon icon={UserSquareIcon} onPress={() => router.push('/(Root)/(auth)/Profile')} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(Root)/(auth)/SignUp')} // navigate to app/signup.jsx
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(Root)/(auth)/Login')} // navigate to app/signup.jsx
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.signout]}
        onPress={() => router.push('/signout')} // or your signout screen route
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#1a73e8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  signout: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});