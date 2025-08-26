// ...existing code...
import React, { useState } from 'react';
import { Alert, Text, View, StyleSheet, TextInput, Button, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../FirebaseConfig';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user.uid);
      Alert.alert('Success', 'Logged in');
      // navigate to main tabs (adjust route if your tabs route differs)
      router.replace('/(Root)/(tabs)/ProductList');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login failed', error?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Sign In</Text>

        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonWrap}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#1a73e8" />
          ) : (
            <Button title="Login" onPress={handleLogin} />
          )}
        </View>

        <View style={styles.bottom}>
          <Text style={styles.switchText} onPress={() => router.push('/(Root)/(auth)/SignUp')}>
            Don't have an account? Sign up
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  container: { padding: 16, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 12, textAlign: 'center' },
  field: { width: '100%' },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  buttonWrap: { marginTop: 8 },
  bottom: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#1a73e8' },
});
