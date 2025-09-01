import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword , signInWithPopup, GoogleAuthProvider, getAuth} from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../../FirebaseConfig';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

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
      router.replace('/(Root)/(tabs)/ProductList');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login failed', error?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsGoogleSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // This gives you a Google Access Token
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      
      // The signed-in user info
      const user = result.user;
      
      console.log('Google sign-in successful:', user.uid);
      Alert.alert('Success', 'Signed in with Google');
      router.replace('/(Root)/(tabs)/ProductList');
      
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      // Handle Errors here
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      
      Alert.alert('Google Sign-In Failed', errorMessage || 'An error occurred during Google authentication');
    } finally {
            setIsGoogleSubmitting(false);
    }
};

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        
        {/* Header Section */}
        <View className="bg-blue-600 px-6 pt-8 pb-20">
          <View className="items-center">
            <Text className="text-white text-3xl font-bold">Welcome Back</Text>
            <Text className="text-white text-opacity-80 text-base mt-2">Sign in to continue to Maaru.LK</Text>
          </View>
        </View>

        {/* Login Card */}
        <View className="mx-6 -mt-16 bg-white rounded-2xl shadow-lg p-6">
          
          {/* Logo/Icon Section */}
          <View className="items-center -mt-16 mb-8">
            <View className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
              <View className="w-full h-full rounded-full bg-blue-500 items-center justify-center">
                <Text className="text-white text-4xl font-bold">M</Text>
              </View>
            </View>
          </View>

          {/* Form Section */}
          <View className="space-y-5">
            <View>
              <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base"
              />
            </View>

            <View>
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-base"
              />
            </View>

            {/* Login Button */}
            <Pressable
              onPress={handleLogin}
              className="bg-blue-600 py-4 rounded-xl mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-center text-base">Sign In</Text>
              )}
            </Pressable>

            {/* devide */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-gray-500 text-sm">or</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Google Login Button */}
            <Pressable
              onPress={handleGoogleLogin}
              className="bg-white border border-gray-300 py-4 rounded-xl flex-row items-center justify-center"
              disabled={isGoogleSubmitting}
            >
              {isGoogleSubmitting ? (
                <ActivityIndicator color="#4285F4" />
              ) : (
                <>
                  <Text className="text-xl mr-3">G</Text>
                  <Text className="text-gray-700 font-semibold text-base">Continue with Google</Text>
                </>
              )}
            </Pressable>

            {/* Forgot Password */}
            <Pressable onPress={() => router.push('/(Root)/(auth)/ForgotPassword')} className="py-2 items-center">
              <Text className="text-gray-500">Forgot Password?</Text>
            </Pressable>
          </View>
        </View>

        {/* Bottom Actions */}
        <View className="mx-6 mt-6 bg-white rounded-2xl shadow-lg p-6 mb-8">
          <View className="space-y-3">
            <Pressable onPress={() => router.push('/(Root)/(auth)/SignUp')} className="border border-gray-200 py-4 rounded-xl">
              <Text className="text-gray-700 font-semibold text-center">Create New Account</Text>
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