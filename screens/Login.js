import { StyleSheet, ScrollView, Alert, Image, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';
import { Text, View } from '../components/Themed';
import { Input, Button, Icon } from '@ui-kitten/components';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';

const STORAGE_KEY = "id_token";
const STORAGE_USER = "username";

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    })
      return unsubscribe;
  }, [navigation])

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

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

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'}/>
    </TouchableWithoutFeedback>
  );

  return (
    <ScrollView contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}} automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled'>
      <Image source={require('../assets/images/Konjo.png')} style={{width: Dimensions.get('window').width * 0.5, height: Dimensions.get('window').width * 0.15}} />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Input
      style={styles.input}
      placeholder='Email'
      value={email}
      onChangeText={nextValue => setEmail(nextValue)}
      keyboardType="email-address"
    />
    <Input
    style={styles.input}
      placeholder='Password'
      value={password}
      secureTextEntry={secureTextEntry}
      onChangeText={nextValue => setPassword(nextValue)}
      accessoryRight={renderIcon}
    />
    <View style={{alignItems: "center", display: "flex", flexDirection: "row", justifyContent: "center"}}>
    <Button style={{margin: 5}} size='giant' status='primary' onPress={handleLogin}>
      Login
    </Button>
    <Button style={{margin: 5}} size='giant' status='primary' onPress={() => navigation.navigate('Signup')}>
      Signup
    </Button>
    </View>
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
