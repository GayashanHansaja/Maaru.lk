import React from 'react';
import { View, Text, Button, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { auth } from '../../../FirebaseConfig';
import { signOut } from 'firebase/auth';

export default function SignOutScreen() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert('Signed Out', 'You have been signed out successfully.');
      // Optionally, navigate to login or welcome screen here
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign Out</Text>
      <Text style={styles.subtitle}>Are you sure you want to sign out?</Text>
      <Button title="Sign Out" onPress={handleSignOut} color="#d32f2f" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 32, textAlign: 'center' },
});