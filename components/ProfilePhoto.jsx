import React, { useState } from 'react';
import { View, Text, Image, Pressable, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../FirebaseConfig';

export default function ProfilePhoto({ currentPhotoUrl, onPhotoUpdated }) {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Camera roll access is needed to select photos');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      // Request camera permission
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Camera access is needed to take photos');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const uploadImage = async (imageUri) => {
    setUploading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'No user logged in');
        return;
      }

      // Resize image
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Convert to blob
      const response = await fetch(manipulatedImage.uri);
      const blob = await response.blob();

      // Upload to Firebase Storage
      const storage = getStorage();
      const imageRef = ref(storage, `profile_photos/${user.uid}`);
      
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      // Update user profile in Firebase Auth
      await updateProfile(user, {
        photoURL: downloadURL
      });

      // Update user document in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        profilePic: downloadURL
      });

      Alert.alert('Success', 'Profile photo updated!');
      onPhotoUpdated?.(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const showOptions = () => {
    Alert.alert(
      'Update Profile Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <View className="items-center">
      <Pressable onPress={showOptions} className="relative">
        <View className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
          {currentPhotoUrl ? (
            <Image 
              source={{ uri: currentPhotoUrl }} 
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-blue-100">
              <Text className="text-4xl text-blue-600 font-bold">
                {auth.currentUser?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
          )}
        </View>
        
        <View className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2">
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white text-xs font-bold">+</Text>
          )}
        </View>
      </Pressable>
      
      <Text className="text-sm text-gray-600 mt-2">Tap to update photo</Text>
    </View>
  );
}