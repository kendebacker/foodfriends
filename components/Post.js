import {getApps, initializeApp} from "firebase/app"
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useEffect, useState } from "react"
import {TextInput, StyleSheet, TouchableOpacity, Text, View, FlatList, Alert, Image, Platform, Linking, ScrollView , Switch} from "react-native";
import { Overlay , Input, Button} from "@rneui/themed";
import { ADD_POST, LOAD_POST, UPDATE_POST, UPDATE_PROFILE } from "../Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch } from "../Data";
import { FontAwesome } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 


export const Post = (props)=>{
    const {navigation, userPost, profile} = props

    const [showComments, setShowComments] = useState(false)
    const [comment, setComment] = useState("")

    console.log(profile)

    const dispatch = useDispatch()

    const updateLikes = (post, profile)=>{
        let newLikes = post.likes.filter(el=> el === profile.email).length === 0?[...post.likes, profile.email]:post.likes.filter(el=> el !== profile.email)
        const action = {
            type: UPDATE_POST,
            payload: {...post, likes: newLikes, friends: profile.friends}
        }
        SaveAndDispatch(action, dispatch)
    }

    const updateComments = ()=>{
        let newComments = [...userPost.comments, {post: comment, poster: userPost.firstName}]
        const action = {
            type: UPDATE_POST,
            payload: {...userPost, comments: newComments, friends: profile.friends}
        }
        SaveAndDispatch(action, dispatch)
    }

    return(
        <View style={styles.post}>
            <View style={styles.mainBody}>
                <View style={styles.postTop}>
                    <View style={styles.postTopSub}>
                        <Image
                        style={styles.profImg}
                        source={{uri: profile.image}}
                        />
                        <Text>{userPost.firstName} {userPost.lastName}</Text>
                        <Text> on {userPost.date}</Text>
                    </View>
                    <View style={styles.thumb}>
                        <Text>{userPost.likes.length}</Text>
                        <TouchableOpacity onPress={()=>{updateLikes(userPost, profile)}}>
                        {userPost.likes.filter(el=> el === profile.email).length === 0?<AntDesign name="hearto" size={24} color="black" />:<AntDesign name="heart" size={24} color="black" />}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.postTitle}>
                    <Text>{userPost.title}</Text>
                </View>
                <View style={styles.middleContent}>
                <Image
                        style={styles.logo}
                        source={{uri: userPost.image}}
                        />
                </View>
                <View style={styles.inputRow}>
                    <Button title ={"Details"} onPress={()=>{
                        navigation.navigate("Post",{
                            post: userPost,
                        })}}/>
                    <Button title ={!showComments?"Show Comments":"Hide Comments"} onPress={()=>{
                            setShowComments(!showComments)
                        }}/>
                
                </View>
            </View>
            {showComments?
            <View>
                <ScrollView style={styles2.comments}>
                    <FlatList 
                    style={{flexGrow: 0}}
                    data={userPost.comments}
                    renderItem={({item})=>{
                    return(
                        <View style={styles2.row}>
                                <Text style={styles2.poster}>{item.poster}: </Text>
                                <Text>{item.post}</Text>
                        </View>
                    )}}/>
                </ScrollView>
                <View style={styles2.inputRow}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="comment"
                        value={comment}
                        onChangeText={(text)=>setComment(text)}/>
                    <Button title={"add"} onPress={()=>{
                    updateComments()
                    setComment("")}}/>
                </View>
            </View>
        :""}
        </View>
    )
}

const styles2={
    inputRow:{
        flexDirection: "row"
    },
    poster:{
        fontWeight: "bold"
    },
    comments:{
        marginTop: 25,
        width: "100%",
        backgroundColor:"green",
        flex: .25,
        height:100,
        flexDirection: "column"
    },row:{
        backgroundColor: "blue",
        flexDirection: "row",
        margin: 1
    }
}

const styles = {
    all:{
        flex:1
    },
    mainBody:{
        flex:7
    },
    commentLine:{
        flexDirection: "column"
    },

    commentsList:{
        width: "100%",
        backgroundColor:"purple",
        height: "20%",
        flex: .2,
    },
    labelText:{
        fontSize: 20
    },
    inputRowOverlay:{
        width: "100%",
        flexDirection: "column",
        paddingTop: 20,
        alignItems: "center"
    },
    inputRow:{
        flex:.2,
        width: "100%",
        padding: 20,
        flexDirection: "col",
        alignItems: "center"
    },
    submitRow:{
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: 15
    },
    thumb:{flexDirection: "row"},
    rating:{
        flexDirection: "row",
        width: "100%",
        justifyContent: "center"
    },
middleContent:{
    flex:.5,
    justifyContent: "center",
    width: "100%",
    flexDirection: "row"
},
profImg:{
    width: 50,
    height: 50,
    marginRight: 5,
    borderRadius: "50%"
},
logo: {
    width: 100,
    height: 100,
  },
  postTitle:{
    width: "100%",
    flexDirection: "row",
    justifyContent: "center"
  },
    postTopSub:{
        flexDirection: "row",
        justifyContent: "start",
        height: 50,
        alignItems: "center"
    },
    postTop:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },inputRow:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingTop: 20
    },
    feedContainer:{
        width: "100%",
        backgroundColor:"blue",
        height: "90%",
    },
    post:{
        width: "90%",
        backgroundColor: "red",
        marginLeft: "5%",
        marginTop: "5%",
        padding: 10,
        borderRadius: 5,
        flex:1
    },
    textInput:{
        borderWidth: 1,
        padding: 2,
        width: "75%"
    },

    content:{
        flexDirection: "column",
        flex:1
    }
}