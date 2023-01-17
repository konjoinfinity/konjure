import { StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useEffect, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Card } from '@ui-kitten/components';

const STORAGE_KEY = "id_token";
const STORAGE_USER = "username";

export default function TabTwoScreen({ navigation }) {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [konjos, setKonjos] = useState();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getValueFor(STORAGE_KEY)
    });
    return unsubscribe;
  }, [navigation]);

  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setToken(result)
      await fetch("https://konjure-backend.onrender.com/community", {
        method: "GET",
        headers: { "user-token": result }
      })
        .then(res => res.json())
        .then(res => {
          console.log(res)
          setKonjos(res);
        }).catch(error => {
          Alert.alert(`${error.message}!`);
        });
    } else {
      alert('No values for that key.');
    }
  }


  let communities;
  konjos &&
    (communities = konjos.map((community, id) => {
      return (
        <Card key={id} style={{backgroundColor: "#000", margin: 5}}>
          <TouchableOpacity
            // onPress={() =>navigation.push("Community", {communityId: `${community._id}`})}
              >
            <Text>{community.name}</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, textAlign: "center", padding: 5 }}>
            {community.description}
          </Text>
          <Text style={{ fontSize: 20, textAlign: "center", padding: 5 }}>
            Members: {community.numberOfMembers}
          </Text>
          <Text style={{ fontSize: 20, textAlign: "center", padding: 5 }}>
            Creator: {community.creator}
          </Text>
        </Card>
      );
    }));
  return (
    <View>
      <ScrollView>
        <Text style={{ fontSize: 30, textAlign: "center", padding: 20 }}>
          {konjos == '' ? "No Konjos" : "Konjos"}
        </Text>
          {communities}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
