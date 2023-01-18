import React, { useState, useEffect } from "react";
import { Image, StyleSheet, ScrollView, Dimensions, Alert, TouchableWithoutFeedback, useColorScheme, View, Text } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { Input, Button, Icon } from '@ui-kitten/components';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@react-navigation/native';

const STORAGE_KEY = "id_token";
const STORAGE_USER = "username";

export default function Signup({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpass, setConfirmpass] = useState('')
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const { colors } = useTheme();
  let colorScheme = useColorScheme();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        })
          return unsubscribe;
      }, [navigation])

    const toggleSecureEntry = () => {
      setSecureTextEntry(!secureTextEntry);
    };

   const loginClear = () => {
        setEmail('')
        setPassword('')
        setConfirmpass('')
    }

    function handleSignup() {
        let text = email
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (reg.test(text) === true) {
            if (password.length >= 8) {
                fetch("https://konjure-backend.onrender.com/users/signup", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        confirmpass: confirmpass
                    })
                }).then(response => response.json())
                    .then(responseData => {
                        if (responseData.error) {
                            Alert.alert(`${responseData.error}`);
                        } else {
                            SecureStore.setItemAsync(STORAGE_KEY, responseData.token);
                            SecureStore.setItemAsync(STORAGE_USER, email);
                            navigation.navigate("Konjos", {user: JSON.stringify(email)});
                            loginClear();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                Alert.alert("Passwords are required to have at least 8 characters.");
            }
        } else {
            Alert.alert("Please enter valid email.");
        }
    }

    const renderIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
          <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'}/>
        </TouchableWithoutFeedback>
      );

        return (
            <ScrollView contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}} automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled'>
                <View style={{height: Dimensions.get('window').height * 0.35}} />
                    <Image source={colorScheme === "dark" ? require('../assets/images/Konjo.png') : require('../assets/images/Konjo1.png')} style={{width: Dimensions.get('window').width * 0.5, height: Dimensions.get('window').width * 0.15}} />
      <View style={[styles.separator, {backgroundColor: colors.border} ]} />
                            <View style={styles.container}>
                                <Input
                                    style={styles.input}
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    autoFocus={true}
                                    autoCapitalize="none"
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    onChangeText={nextValue => setEmail(nextValue)}
                                    value={email} />
                                <Input
                                    style={styles.input}
                                      placeholder='Password'
                                      value={password}
                                      secureTextEntry={secureTextEntry}
                                      onChangeText={nextValue => setPassword(nextValue)}
                                      accessoryRight={renderIcon} />
                                <Input
                                    style={styles.input}
                                    placeholder="Confirm Password"
                                    secureTextEntry={secureTextEntry}
                                    onChangeText={nextValue => setConfirmpass(nextValue)}
                                    onSubmitEditing={() => handleSignup()}
                                    accessoryRight={renderIcon}
                                    value={confirmpass}
                                    returnKeyType='send' />
                            </View>
                            <View style={{alignItems: "center", display: "flex", flexDirection: "row", justifyContent: "center"}}>
                                <Button
                                    style={{margin: 5}} size='giant' status='primary'
                                    onPress={() => handleSignup()}>
                                    <Text style={styles.buttonText}>Signup</Text>
                                </Button>
                                <Button style={{margin: 5}} size='giant' status='primary' onPress={() => navigation.navigate('Root')}>
                                    <Text style={styles.buttonText}>Back to Login</Text>
                                </Button>
                            </View>
                </ScrollView>
        );
}

const styles = StyleSheet.create({
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
      padding: 3,
      margin: 3,
      width: Dimensions.get('window').width * 0.9
    }
  });