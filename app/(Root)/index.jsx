import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../../FirebaseConfig'; // Adjust the path as necessary
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

class Index extends Component {
  async componentDidMount() {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "gayashan",
        last: "Lovelace",
        born: 1815
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.text}>Welcome to the Root Page!</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
  },
  box: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default Index;
