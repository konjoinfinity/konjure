import { StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { Text, View } from '../components/Themed';
import { Input, Button } from '@ui-kitten/components';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = "id_token";
const STORAGE_USER = "username";

export default function TabOneScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async() => {
    let text = email
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (reg.test(text) === true) {
      fetch("https://konjure-backend.onrender.com/users/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
        .then(response => response.json())
        .then(responseData => {
          if (responseData.error) {
            Alert.alert(`${responseData.error}`)
          } else {
            SecureStore.setItemAsync(STORAGE_KEY, responseData.token);
            SecureStore.setItemAsync(STORAGE_USER, email);
            navigation.navigate("TabTwo", {user: JSON.stringify(email)});
          }
        })
    } else {
      Alert.alert("Please enter a valid email.")
    }
  }
  
  
  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  return (
    <ScrollView contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}} automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled'>
      <Text style={styles.title}>Login</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Input
      style={styles.input}
      placeholder='Email'
      value={email}
      onChangeText={nextValue => setEmail(nextValue)}
    />
    <Input
    style={styles.input}
      placeholder='Password'
      value={password}
      secureTextEntry={true}
      onChangeText={nextValue => setPassword(nextValue)}
    />
    <Button style={{margin: 2}} size='large' status='primary' onPress={handleLogin}>
      Login
    </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    padding: 5,
    margin: 5
  }
});
