import { StyleSheet, TouchableOpacity, ScrollView, Alert, useColorScheme } from 'react-native';
import { useEffect, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Card } from '@ui-kitten/components';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const STORAGE_KEY = "id_token";
const STORAGE_USER = "username";

export default function TabTwoScreen({ route }) {
  const navigation = useNavigation();
  const {user} = route.params;
  const [token, setToken] = useState('');
  const [email, setEmail] = useState(JSON.parse(user));
  const [konjos, setKonjos] = useState();
  const { colors } = useTheme();
  let colorScheme = useColorScheme();

  useEffect(() => {
      getValueFor(STORAGE_KEY)
  }, []);

  async function getUser() {
    const grab = await SecureStore.getItemAsync(STORAGE_USER)
      if (grab) {
        setEmail(grab)
      }
  }

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

console.log(email)
  let communities;
  konjos &&
    (communities = konjos.map((community, id) => {
      return (
        <Card key={id} style={{backgroundColor: colorScheme === "dark" ? colors.border : colors.card, borderColor: colors.background, margin: 10, padding: 5}}>
          <TouchableOpacity style={{backgroundColor: colors.primary, borderRadius: 5}}
            onPress={() => navigation.navigate("NotFound", {communityId: JSON.stringify(community), email: JSON.stringify(email)})}>
            <Text style={{ fontSize: 25, textAlign: "center", padding: 5 }}>{community.name}</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, textAlign: "center", padding: 5 }}>
            {community.description}
          </Text>
          <Text style={{ fontSize: 18, textAlign: "center", padding: 5 }}>
            Members: {community.numberOfMembers}
          </Text>
          <Text style={{ fontSize: 18, textAlign: "center", padding: 5 }}>
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
