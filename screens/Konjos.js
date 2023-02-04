import { StyleSheet, TouchableOpacity, ScrollView, Alert, useColorScheme, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Text } from '../components/Themed';
import { Card } from '@ui-kitten/components';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import SwipeCards from 'react-native-swipe-cards';

const STORAGE_KEY = "id_token";
const STORAGE_USER = "username";

function Card1({ community, email }) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  let colorScheme = useColorScheme();
  return (
    <Card key={community._id} style={[styles.card, {backgroundColor: colorScheme === "dark" ? colors.border : colors.card, borderColor: colors.border, alignItems: "center", justifyContent:"center" }]}>
      <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 25 }}>{community.name}</Text>

      <Text style={{fontWeight:"700", marginBottom: 5}}>Description:</Text>
          <Text style={[styles.cardtext, { marginBottom: 15}]}>
           {community.description}
          </Text>
          <Text style={{fontWeight:"700", marginBottom: 5}}>Creator:</Text>
          <Text style={[styles.cardtext, { marginBottom: 15}]}>
           {community.creator}
          </Text>
          <Text style={[styles.cardtext, { marginBottom: 15}]}>
          <Text style={{fontWeight:"700", marginBottom: 15}}>Members:</Text> {community.numberOfMembers}
          </Text>
          <View style={{alignItems:"center", justifyContent:"center"}}>
          <TouchableOpacity style={{backgroundColor: colors.primary, borderRadius: 5, height: 50, width: 50, justifyContent: "center", alignItems: "center", marginTop: 15}}
            onPress={() => navigation.navigate("Konjo", {communityId: JSON.stringify(community), email: JSON.stringify(email)})}>
            <FontAwesome name="arrow-right" size={35} color="white" />
          </TouchableOpacity>
          </View>
    </Card>
  );
}

function StatusCard({ text }) {
  return (
    <View>
      <Text style={{color: "#fff", fontSize: 30}}>{text}</Text>
    </View>
  );
}

export default function Konjos({ route }) {
  const navigation = useNavigation();
  const {user} = route.params;
  const [token, setToken] = useState('');
  const [email, setEmail] = useState(JSON.parse(user));
  const [konjos, setKonjos] = useState();
  const { colors } = useTheme();
  let colorScheme = useColorScheme();
  const [cards, setCards] = useState();  

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
          setCards(res);
        }).catch(error => {
          Alert.alert(`${error.message}!`);
        });
    } else {
      alert('No values for that key.');
    }
  }

  function handleYup(card) {
    console.log(`Yup for ${card.text}`);
    return true;
  }
  function handleNope(card) {
    console.log(`Nope for ${card.text}`);
    return true;
  }

console.log(email)
  return (
    <View style={{alignItems: 'flex-start', justifyContent: "center"}}>
      <View style={{marginBottom: 100}}/>
      {cards ? (
        <SwipeCards
          cards={cards}
          renderCard={(cardData) => <Card1 community={cardData} email={email} />}
          keyExtractor={(cardData) => String(cardData.text)}
          renderNoMoreCards={() => <StatusCard text="No more cards..." />}
          actions={{
            nope: { onAction: handleNope },
            yup: { onAction: handleYup },
          }}
          hasMaybeAction={false}
          stack={true}
          stackDepth={3}
          stackOffsetX={25}
          stackOffsetY={25}
        />
      ) : (
        <StatusCard text="Loading..." />
      )}
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
  },
  card: {
    width: Dimensions.get('window').width * 0.85,
    height: Dimensions.get('window').height * 0.6,
    padding: 5
  },
  cardsText: {
    fontSize: 22
  }
});
