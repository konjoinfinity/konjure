import React, { useState } from "react";
import { Image, StyleSheet, ScrollView, Dimensions, Alert, TouchableWithoutFeedback } from "react-native";
import { Text, View } from '../components/Themed';
import * as SecureStore from 'expo-secure-store';
import { Input, Button, Icon } from '@ui-kitten/components';
import * as Haptics from 'expo-haptics';

const STORAGE_KEY = "id_token";
const STORAGE_USER = "username";

export default function Signup({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpass, setConfirmpass] = useState('')
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

   const loginClear = () => {
        setEmail('')
        setPassword('')
        setConfirmpass('')
    }

    async function onValueChange(item, selectedValue) {
        try {
            await SecureStore.setItemAsync(item, selectedValue);
        } catch (error) {
            console.log("SensitiveInfoStorage error: " + error.message);
        }
    }

    function handleSignup() {
        let text = this.state.email
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (reg.test(text) === true) {
            if (this.state.password.length >= 8) {
                fetch(konjoUrl + "users/signup", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        email: this.state.email,
                        password: this.state.password,
                        confirmpass: this.state.confirmpass
                    })
                })
                    .then(response => response.json())
                    .then(responseData => {
                        if (responseData.error) {
                            // ReactNativeHaptic.generate('selection');
                            Alert.alert('error', 'Error', `${responseData.error}`);
                        } else {
                            // ReactNativeHaptic.generate('selection');
                            this.onValueChange(STORAGE_KEY, responseData.token);
                            this.onValueChange(STORAGE_USER, this.state.email);
                            this.props.navigation.push("Home", {
                                signup: true, email: this.state.email
                            });
                            this.loginClear();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                // ReactNativeHaptic.generate('selection');
                Alert.alert('warn', 'Warning', "Passwords are required to have at least 8 characters.");
            }
        } else {
            // ReactNativeHaptic.generate('selection');
            Alert.alert('warn', 'Warning', "Please enter valid email.");
        }
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