import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../FirebaseConfig'; // Adjust the path as necessary
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import {
  Alert,
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // not stored to DB in this example
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [age, setAge] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);



  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName || !address || !age) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    setIsSubmitting(true);
    try {

        const auth = getAuth();

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;


      console.log('Sending to Firestore, db present?', !!db);
      const docRef = await addDoc(collection(db, 'users'), {
        first: firstName,
        last: lastName,
        email: email,
        address: address,
        born: age,
        createdAt: new Date().toISOString(),
      });
      console.log('Document written with ID: ', docRef.id);
      Alert.alert('Success', `User registered (id: ${docRef.id})`);
      // Clear form
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setAddress('');
      setAge('');

      router.replace('/(Root)/(auth)/Login')
    } catch (error) {
      console.error('Error adding document: ', error);
      // show detailed error to help debugging (permission/network/etc)
      Alert.alert('Error saving user', error?.message || String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.field}>
          <TextInput
            style={styles.input}
            placeholder="First name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonWrap}>
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#1a73e8" />
          ) : (
            <Button title="Register" onPress={handleRegister} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f4f8' },
  container: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
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
  buttonWrap: { marginTop: 8, alignSelf: 'stretch' },
});