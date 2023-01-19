import { StyleSheet, TouchableOpacity, useColorScheme, ScrollView, Button, TextInput, Keyboard, View } from 'react-native';
import { Text } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Card } from '@ui-kitten/components';
import { useTheme } from '@react-navigation/native';

const STORAGE_USER = "username";

export default function Konjo({ route }) {
  const navigation = useNavigation();
  const {communityId, email} = route.params;
  const [konjo, setKonjo] = useState(JSON.parse(communityId))
  const [creator, setCreator] = useState(JSON.parse(email))
  const { colors } = useTheme();
  let colorScheme = useColorScheme();

  console.log(konjo)
  console.log(creator)
  console.log(email)
  let members;
    let commentlist;
    konjo &&
      (commentlist = konjo.comments.map((comment, id) => {
        return (
          <TouchableOpacity key={id} style={styles.comment}>
            <Text style={{ fontSize: 40, padding: 20, textAlign: "center" }}>{comment.text}</Text>
            <Text style={{ fontSize: 15, padding: 10, textAlign: "center" }}>{comment.creator}</Text>
            {creator === comment.creator && (
              <Button
                title="🗑 Delete"
                onPress={() => this.deleteComment(`${comment._id}`)} />)}
          </TouchableOpacity>
        );
      }));
    const member =
      konjo &&
      konjo.members.filter(
        member => member.name === creator
      );
    let meetlist;
    let userattending;
    let usernotattending;
    let usermaybeattending;
    konjo &&
      (meetlist = konjo.meets.map((meet, id) => {
        userattending = meet.attending.filter(user => user.name === creator);
        usernotattending = meet.notAttending.filter(user => user.name === creator);
        usermaybeattending = meet.maybeAttending.filter(user => user.name === creator);
    konjo &&
      (members = konjo.map((member, id) => {
        return (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}>
              <Text style={{ fontSize: 20 }}>👤 {member.name}</Text>
              {konjo && creator === konjo.creator && (
                <Button
                  title="🗑 Remove"
                  onPress={() => this.deleteMember(`${member._id}`)} />)}
            </View>
        );
      }));
        return (
            <View key={id}>
              <Text style={{ fontSize: 25, padding: 5, textAlign: "center" }}>{meet.name}</Text>
              <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>🗒 {meet.description}</Text>
              <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>📍 {meet.location}</Text>
              <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>📆 {meet.date}</Text>
              <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>🕒 {meet.time}</Text>
              <Text style={{ fontSize: 10, padding: 5, textAlign: "center" }}>👤 {meet.creator}</Text>
                <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>Who's Going?</Text>
                <View>
                  {meet.attending.length !== 0 && 
                    <View>
                      <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>Attending</Text>
                      {meet.attending.map((going, id) => {
                        return (
                          <View key={id}>
                            <Text style={{ fontSize: 15, padding: 3, textAlign: "center" }}>{going.name}</Text>
                            {going.name === creator &&
                              <Button
                                title="Change"
                                onPress={() => this.attendAll(`${meet._id}`, `${meet.name}`, pull, attending)} />}
                          </View>
                        )
                      })}
                    </View>}
                  {meet.notAttending.length !== 0 &&
                    <View>
                      <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>Not Attending</Text>
                      {meet.notAttending.map((notgoing, id) => {
                        return (
                          <View key={id}>
                            <Text style={{ fontSize: 15, padding: 3, textAlign: "center" }}>{notgoing.name}</Text>
                            {notgoing.name === creator &&
                              <Button
                                title="Change"
                                onPress={() => this.attendAll(`${meet._id}`, `${meet.name}`, pull, notattending)} />}
                          </View>
                        )
                      })}
                    </View>}
                  {meet.maybeAttending.length !== 0 &&
                    <View>
                      <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>Maybe Attending</Text>
                      {meet.maybeAttending.map((maybegoing, id) => {
                        return (
                          <View key={id}>
                            <Text style={{ fontSize: 15, padding: 3, textAlign: "center" }}>{maybegoing.name}</Text>
                            {maybegoing.name === creator &&
                              <Button
                                title="Change"
                                onPress={() => this.attendAll(`${meet._id}`, `${meet.name}`, pull, maybeattending)} />}
                          </View>
                        )
                      })}
                    </View>}
                  {userattending.length === 0 && (
                    usernotattending.length === 0 && (
                      usermaybeattending.length === 0 && (
                        <Button
                          title="Going 👍🏻"
                          onPress={() => this.attendAll(`${meet._id}`, `${meet.name}`, push, attending)} />
                      )))}
                  {userattending.length === 0 && (
                    usernotattending.length === 0 && (
                      usermaybeattending.length === 0 && (
                        <Button
                          title="Not Going 👎🏻"
                          onPress={() => this.attendAll(`${meet._id}`, `${meet.name}`, push, notattending)} />
                      )))}
                  {userattending.length === 0 && (
                    usernotattending.length === 0 && (
                      usermaybeattending.length === 0 && (
                        <Button
                          title="Maybe Going 🤷🏻‍♂️🤷🏻‍♀️"
                          onPress={() => this.attendAll(`${meet._id}`, `${meet.name}`, push, maybeattending)} />
                      )))}
                </View>  
              {creator === meet.creator &&
                <Text style={{ fontSize: 20, padding: 5, textAlign: "center" }}>Options</Text>}
            
              {creator === meet.creator && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      this.props.navigation.push("EditMeet", {
                        communityId: `${konjo._id}`, meet: `${meet._id}`
                      })}>
                    <Text style={styles.buttonText}>Edit Meet ✏️</Text>
                  </TouchableOpacity>)}
              {creator === meet.creator && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => this.deleteMeet(`${meet._id}`)}>
                    <Text style={styles.buttonText}>Delete Meet 🗑</Text>
                  </TouchableOpacity>)}
            </View>
        );
      }));
    return (
      <View>
        <ScrollView>
        <Card style={{backgroundColor: colorScheme === "dark" ? colors.border : colors.card, borderColor: colors.background}}>
            {konjo && (
              <View>
                <Text style={{ fontSize: 40, padding: 10, textAlign: "center" }}>{konjo.name}</Text>
                <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>🗒 {konjo.description}</Text>
                <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>📝 {konjo.category}</Text>
              </View>)}
            {konjo && (
              <View>
                <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>👥 Members:  {konjo.numberOfMembers}</Text>
                  <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>
                    👤 {konjo.creator}
                  </Text>
                {creator === konjo.creator && (
                    <View>{members}</View>)}
                {member.length === 1 && <View>{members}</View>}
              </View>)}
              <View>
                <Text style={{
                  fontSize: 25,
                  textAlign: "center"
                }}>Options</Text>
                  <View>
                    <TouchableOpacity
                      style={styles.mapButton}
                      onPress={() =>
                        this.props.navigation.push("CommMap", {
                          communityId: `${konjo._id}`
                        })}>
                      <Text style={styles.buttonText}>Map 🗺</Text>
                    </TouchableOpacity>
                    {konjo && creator !== konjo.creator &&
                      member.length === 0 && (
                        <TouchableOpacity
                          style={styles.joinButton}
                          onPress={() => joinCommunity()}>
                          <Text style={styles.buttonText}>Join Community ➕👥</Text>
                        </TouchableOpacity>)}
                    {konjo && creator !== konjo.creator &&
                      member.length === 1 && (
                        <TouchableOpacity
                          style={styles.leaveButton}
                          onPress={() => this.deleteMember(member[0]._id)}>
                          <Text style={styles.buttonText}>Leave Community ⬅️👤</Text>
                        </TouchableOpacity>)}
                    {konjo && creator === konjo.creator && (
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                          this.props.navigation.push("Edit", {
                            communityId: `${konjo._id}`
                          })}>
                        <Text style={styles.buttonText}>Edit Community ✏️</Text>
                      </TouchableOpacity>)}
                    {konjo && creator === konjo.creator && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteCommunity()}>
                        <Text style={styles.buttonText}>Delete Community 🗑</Text>
                      </TouchableOpacity>)}
                    {konjo && konjo.numberOfMembers >= 3 &&
                      member.length === 1 && (
                        <TouchableOpacity
                          style={styles.meetButton}
                          onPress={() =>
                            this.props.navigation.push("Meet", {
                              communityId: `${konjo._id}`
                            })}>
                          <Text style={styles.buttonText}>Create Meet ➕📆</Text>
                        </TouchableOpacity>)}
                    {konjo && konjo.numberOfMembers >= 3 &&
                      creator === konjo.creator && (
                        <TouchableOpacity
                          style={styles.meetButton}
                          onPress={() =>
                            this.props.navigation.push("Meet", {
                              communityId: `${konjo._id}`
                            })}>
                          <Text style={styles.buttonText}>Create Meet ➕🗓</Text>
                        </TouchableOpacity>)}
                  </View>
              </View>
            {konjo && konjo.numberOfMembers >= 3 && member.length === 1 && (
              konjo.meets.length !== 0 && (
                <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>Meets</Text>))}
            {konjo && konjo.numberOfMembers >= 3 &&
              creator === konjo.creator && (
                konjo.meets.length !== 0 && (
                  <Text style={{ fontSize: 30, padding: 10, textAlign: "center" }}>Meets</Text>))}
            {konjo && creator === konjo.creator && (
              <View>{meetlist}</View>)}
            {konjo && member.length === 1 && <View>{meetlist}</View>}
            {konjo && member.length === 1 && (
              <View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    name="comment"
                    id="comment"
                    onBlur={Keyboard.dismiss}
                    onChangeText={() => this.handleCommentChange}
                    returnKeyType="send"
                    value={""}
                    onSubmitEditing={() => this.handleComment} />
                </View>
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => this.handleComment}>
                    <Text style={styles.buttonText}>Add Comment 💬</Text>
                  </TouchableOpacity>
                </View>
                </View>)}
            {konjo && creator === konjo.creator && (
              <View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    name="comment"
                    id="comment"
                    onBlur={Keyboard.dismiss}
                    onChangeText={() => this.handleCommentChange}
                    returnKeyType='send'
                    value={""}
                    onSubmitEditing={() => this.handleComment} />
                </View>
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => this.handleComment}>
                    <Text style={styles.buttonText}>Add Comment 💬</Text>
                  </TouchableOpacity>
                </View>
                </View>)}
            {konjo && creator === konjo.creator && (
              konjo.comments.length !== 0 && (
                <Text style={{ fontSize: 35, padding: 20, textAlign: "center" }}>Comments</Text>))}
            {konjo && member.length === 1 && (
              konjo.comments.length !== 0 && (
                <Text style={{ fontSize: 35, padding: 20, textAlign: "center" }}>Comments</Text>))}
            {konjo && konjo && creator === konjo.creator && (
              <View style={{ margin: 20 }}>{commentlist}</View>)}
            {konjo && member.length === 1 && (
              <View style={{ margin: 20 }}>{commentlist}</View>)}
              </Card>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingTop: 15
  },
  textInput: {
    borderColor: "#CCCCCC",
    borderWidth: 1,
    height: 50,
    fontSize: 25,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 15
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: "#FF1717",
    backgroundColor: "#FF1717",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  joinButton: {
    borderWidth: 1,
    borderColor: "#3D7E9A",
    backgroundColor: "#3D7E9A",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  communityButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  communities: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#FFD517",
    backgroundColor: "#FFD517",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  meetButton: {
    borderWidth: 1,
    borderColor: "#752794",
    backgroundColor: "#752794",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  comment: {
    borderWidth: 1,
    borderColor: "#FFB944",
    backgroundColor: "#FFB944",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  saveButton: {
    borderWidth: 1,
    borderColor: "#12C16D",
    backgroundColor: "#12C16D",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  myCommunitiesButton: {
    borderWidth: 1,
    borderColor: "#FF8300",
    backgroundColor: "#FF8300",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  homeButton: {
    borderWidth: 1,
    borderColor: "#12C16D",
    backgroundColor: "#12C16D",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  joinedCommunitiesButton: {
    borderWidth: 1,
    borderColor: "#E0118A",
    backgroundColor: "#E0118A",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  mapButton: {
    borderWidth: 1,
    borderColor: "#00B6B6",
    backgroundColor: "#00B6B6",
    padding: 15,
    margin: 5,
    borderRadius: 15
  },
  modal: {
    height: 250,
    backgroundColor: '#87BBE0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
  },
  modalText: {
    fontSize: 25,
    color: 'white',
    padding: 10,
    textAlign: "center"
  },
  leaveButton: {
    borderWidth: 1,
    borderColor: "#FF8300",
    backgroundColor: "#FF8300",
    padding: 15,
    margin: 5,
    borderRadius: 15
  }
});
