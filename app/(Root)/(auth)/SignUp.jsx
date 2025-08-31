import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../FirebaseConfig';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !firstName || !lastName || !address || !age || !phone) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Sending to Firestore, db present?', !!db);
      await setDoc(doc(db, 'users', user.uid), {
        firstName: firstName,
        lastName: lastName,
        email,
        address,
        born: age,
        phone,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });
      console.log('Document written with ID: ', user.uid);
      Alert.alert('Success', `User registered (id: ${user.uid})`);
      
      // Clear form
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setAddress('');
      setAge('');
      setPhone('');

      router.replace('/(Root)/(auth)/Login');
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error saving user', error?.message || String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        
        {/* Header Section */}
        <View className="bg-green-600 px-6 pt-8 pb-20">
          <View className="items-center">
            <Text className="text-white text-3xl font-bold">Join Maaru.LK</Text>
            <Text className="text-white text-opacity-80 text-base mt-2">Create your account today</Text>
          </View>
        </View>

        {/* Registration Card */}
        <View className="mx-6 -mt-16 bg-white rounded-2xl shadow-lg p-6">
          
          {/* Logo/Icon Section */}
          <View className="items-center -mt-16 mb-8">
            <View className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
              <View className="w-full h-full rounded-full bg-green-500 items-center justify-center">
                <Text className="text-white text-4xl font-bold">+</Text>
              </View>
            </View>
          </View>

          {/* Form Section */}
          <View className="space-y-4">
            
            {/* Name Fields */}
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Text className="text-gray-700 font-medium mb-2">First Name</Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  autoCapitalize="words"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base"
                />
              </View>

              <View className="flex-1">
                <Text className="text-gray-700 font-medium mb-2">Last Name</Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  autoCapitalize="words"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base"
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base"
              />
            </View>

            {/* Phone and Age */}
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Text className="text-gray-700 font-medium mb-2">Phone</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base"
                />
              </View>

              <View className="flex-1">
                <Text className="text-gray-700 font-medium mb-2">Age</Text>
                <TextInput
                  value={age}
                  onChangeText={setAge}
                  placeholder="Age"
                  keyboardType="numeric"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base"
                />
              </View>
            </View>

            {/* Address */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Address</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Your address"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base"
              />
            </View>

            {/* Password */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Choose a password"
                secureTextEntry
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base"
              />
            </View>

            {/* Register Button */}
            <Pressable
              onPress={handleRegister}
              className="bg-green-600 py-4 rounded-xl mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-center text-base">Create Account</Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Bottom Actions */}
        <View className="mx-6 mt-6 bg-white rounded-2xl shadow-lg p-6 mb-8">
          <View className="space-y-3">
            <Pressable onPress={() => router.replace('/(Root)/(auth)/Login')} className="border border-gray-200 py-4 rounded-xl">
              <Text className="text-gray-700 font-semibold text-center">Already have an account? Sign In</Text>
            </Pressable>

            <Pressable onPress={() => router.push('/(Root)/(tabs)/ProductList')} className="py-3 items-center">
              <Text className="text-gray-500">Continue as Guest</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}