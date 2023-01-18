import { StyleSheet, TouchableOpacity, ScrollView, Alert, useColorScheme, View, Dimensions } from 'react-native';
import { useEffect, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import { Text } from '../components/Themed';
import { Card } from '@ui-kitten/components';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Fontisto, MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const STORAGE_KEY = "id_token";
const STORAGE_USER = "username";

export default function Konjos({ route }) {
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
        <Card key={id} style={{backgroundColor: colorScheme === "dark" ? colors.card : colors.card, borderColor: colors.background, margin: 2}}>
          <View style={{alignItems: "center", justifyContent: "center", flexDirection: 'row', display: "flex"}}>
          <View style={{width: Dimensions.get('window').width * 0.7}}>
          <Text style={{ fontSize: 18, textAlign: "left", fontWeight: "bold" }}>{community.name}</Text>
          <Text style={styles.cardtext}>
          <Text style={{fontWeight:"700"}}>Description:</Text> {community.description}
          </Text>
          <Text style={styles.cardtext}>
          <Text style={{fontWeight:"700"}}>Members:</Text> {community.numberOfMembers}
          </Text>
          <Text style={styles.cardtext}>
          <Text style={{fontWeight:"700"}}>Creator:</Text> {community.creator}
          </Text>
          </View> 
          <View>
          <TouchableOpacity style={{backgroundColor: colors.primary, borderRadius: 5, height: 50, width: 50, justifyContent: "center", alignItems: "center"}}
            onPress={() => navigation.navigate("NotFound", {communityId: JSON.stringify(community), email: JSON.stringify(email)})}>
            <FontAwesome name="arrow-right" size={35} color="white" />
          </TouchableOpacity>
          </View>
          </View>
        </Card>
      );
    }));
  return (
    <View>
      <ScrollView style={{backgroundColor:colors.background}}>
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
  cardtext: {
    fontSize: 15, 
    textAlign: "left", 
    marginVertical: 3
  }
});
