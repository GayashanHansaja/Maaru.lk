import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
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
            firstName: user.firstName || null,
            lastName: user.lastName || null,
            phone: user.phoneNumber || null,
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Failed to load profile.</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>No profile available.</Text>
      </View>
    );
  }

  const fields = [
    { key: 'firstName', label: 'First Name', value: profile.firstName || profile.first || '' },
    { key: 'lastName', label: 'Last Name', value: profile.lastName || profile.last || '' },
    { key: 'email', label: 'Email', value: profile.email || '' },
    { key: 'phone', label: 'Phone', value: profile.phone || '' },
    { key: 'address', label: 'Address', value: profile.address || '' },
    { key: 'born', label: 'Born / Age', value: profile.born || profile.age || '' },
    // add more fields if your documents contain them
  ];

  const avatarUri = profile.profilePic || profile.photoURL || null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                {(profile.firstName || profile.first || '').charAt(0).toUpperCase() ||
                  (profile.lastName || profile.last || '').charAt(0).toUpperCase() ||
                  'U'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>
          {(profile.firstName || profile.first || '') +
            (profile.lastName || profile.last ? ' ' + (profile.lastName || profile.last) : '') ||
            profile.email}
        </Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/(Root)/(auth)/EditProfile')}
        >
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Details</Text>
        {fields.map((f) => (
          <View key={f.key} style={styles.row}>
            <Text style={styles.rowLabel}>{f.label}</Text>
            <Text style={styles.rowValue}>{f.value || '-'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: 20 },
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: '100%', height: '100%' },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c7d2fe',
  },
  placeholderText: { fontSize: 40, color: '#fff', fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  editButton: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#1a73e8',
    borderRadius: 8,
  },
  editText: { color: '#fff', fontWeight: '600' },

  section: { marginTop: 8, backgroundColor: '#fafafa', borderRadius: 10, padding: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },

  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  rowLabel: { color: '#666', fontWeight: '600' },
  rowValue: { color: '#222', maxWidth: '60%', textAlign: 'right' },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  error: { color: '#d32f2f' },
});