import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../../FirebaseConfig';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        router.replace('/(Root)/(auth)/Login');
        return;
      }

      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userDocRef);

        if (snap.exists()) {
          setProfile({ id: snap.id, ...snap.data() });
        } else {
          setProfile({
            uid: user.uid,
            email: user.email,
            profilePic: user.photoURL || null,
            firstName: user.displayName || '',
            lastName: '',
          });
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/(Root)/(auth)/Login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-600 mt-4 text-base">Loading profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-600 text-lg font-semibold mb-2">Error loading profile</Text>
          <Text className="text-gray-600 text-center mb-6">Could not load profile information</Text>
          <Pressable 
            onPress={() => router.replace('/(Root)/(auth)/Login')}
            className="bg-blue-600 px-8 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Back to Login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const fullName = `${profile.firstName || profile.first || ''} ${profile.lastName || profile.last || ''}`.trim();
  const avatarUri = profile.profilePic || profile.photoURL || null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        
        {/* Header Section */}
        <View className="bg-blue-600 px-6 pt-4 pb-20">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-2xl font-bold">Profile</Text>
            </View>
            <Pressable 
              onPress={handleSignOut}
              className="bg-white bg-opacity-20 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium text-sm">Sign Out</Text>
            </Pressable>
          </View>
        </View>

        {/* Profile Card */}
        <View className="mx-6 -mt-16 bg-white rounded-2xl shadow-lg p-6">
          
          {/* Avatar Section */}
          <View className="items-center -mt-16 mb-6">
            <View className="relative">
              <View className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                {avatarUri ? (
                  <Image 
                    source={{ uri: avatarUri }} 
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full rounded-full bg-blue-500 items-center justify-center">
                    <Text className="text-white text-4xl font-bold">
                      {fullName.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                )}
              </View>
              
              <Pressable className="absolute bottom-0 right-0 bg-blue-600 w-10 h-10 rounded-full items-center justify-center shadow-lg">
                <Text className="text-white text-lg font-bold">+</Text>
              </Pressable>
            </View>
            
            <View className="items-center mt-4">
              <Text className="text-gray-900 text-xl font-bold">
                {fullName || 'User Name'}
              </Text>
              <Text className="text-gray-500 text-base">
                {profile.email}
              </Text>
            </View>
          </View>

          {/* Stats Section */}
          <View className="flex-row justify-around py-6 bg-gray-50 rounded-xl mb-6">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">15</Text>
              <Text className="text-gray-600 text-sm">Orders</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">4.8</Text>
              <Text className="text-gray-600 text-sm">Rating</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">2</Text>
              <Text className="text-gray-600 text-sm">Years</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-3">
            <Pressable className="bg-blue-600 py-4 rounded-xl">
              <Text className="text-white font-semibold text-base text-center">Edit Profile</Text>
            </Pressable>
            
            <Pressable className="border border-gray-200 py-4 rounded-xl">
              <Text className="text-gray-700 font-semibold text-base text-center">Settings</Text>
            </Pressable>
          </View>
        </View>

        {/* Personal Information */}
        <View className="mx-6 mt-6 bg-white rounded-2xl shadow-lg p-6">
          <Text className="text-xl font-bold text-gray-900 mb-6">Personal Information</Text>
          
          <View className="space-y-4">
            {[
              { label: 'First Name', value: profile.firstName || profile.first || 'Not provided' },
              { label: 'Last Name', value: profile.lastName || profile.last || 'Not provided' },
              { label: 'Email', value: profile.email || 'Not provided' },
              { label: 'Phone', value: profile.phone || 'Not provided' },
              { label: 'Address', value: profile.address || 'Not provided' },
              { label: 'Age', value: profile.born || profile.age || 'Not provided' },
            ].map((item, index) => (
              <View key={index} className="flex-row justify-between items-center py-3 border-b border-gray-100">
                <Text className="text-gray-600 font-medium">{item.label}</Text>
                <Text className="text-gray-900 font-semibold flex-1 text-right" numberOfLines={1}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Options */}
        <View className="mx-6 mt-6 bg-white rounded-2xl shadow-lg p-6 mb-8">
          <Text className="text-xl font-bold text-gray-900 mb-6">Account</Text>
          
          <View className="space-y-1">
            {[
              { title: 'Order History' },
              { title: 'Payment Methods' },
              { title: 'Notifications' },
              { title: 'Privacy Settings' },
              { title: 'Help Support' },
            ].map((item, index) => (
              <Pressable key={index} className="flex-row items-center justify-between py-4 px-2 rounded-lg">
                <Text className="text-gray-900 font-medium">{item.title}</Text>
                <Text className="text-gray-400 text-xl">›</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}