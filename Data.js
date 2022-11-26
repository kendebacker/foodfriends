import { ADD_PROFILE,LOAD_PROFILE, LOAD_POST, ADD_POST, DELETE_PROFILE, DELETE_POST, UPDATE_PROFILE, UPDATE_POST ,SEARCH_PROFILE} from "./Reducer"
import {getStorage} from "firebase/storage"
import { initializeApp, getApps } from "firebase/app"
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore"
import { firebaseConfig } from "./Secrets"




const [profile, post] = ["profiles", "posts"]

const myApp = ()=>{
    if(getApps().length < 1){
        return initializeApp(firebaseConfig)
    }else{
        return getApps()[0]
    }
}

export const myDB =()=>{
    return getFirestore(myApp())
}

export const myStorage=()=>{
    return getStorage(myApp())
}

const db = getDB()


const initialPosts = [{firstName:"", lastName: "", image: "dummyImage.png", description: "Not very good", rating:1, location: "Somewhere...",likes:0, key: 1, poster: 1, reposts:[2], date: new Date().toLocaleDateString()}]
const intitialProfiles = [{lastName:"",firstName: "ken",image:"profilePic.png", reposts: [1], posts: [1,2], saved: [3], friends:[1,1]}]
const initialFriends = []


const addProfileAndDispatch = async (action, dispatch) =>{
    const {payload} = action
    const {email, firstName, lastName, image, reposts, posts, saved, friends}= payload
    const coll = collection(db, profile)
    await addDoc(coll, {
        email: email,
        firstName: firstName,
        lastName, lastName,
        image: image,
        reposts: reposts, 
        posts: posts,
        saved: saved,
        friends: friends,
    })
    loadProfileAndDispatch(action, dispatch)
}


const updateProfileAndDispatch = async (action, dispatch) =>{
    const {payload} = action
    const {key, email, firstName, lastName, image, reposts, posts, saved, friends}= payload
    const toUpdate = doc(collection(db, profile),key)
    const newVersion= {
        email: email, 
        firstName: firstName,
        lastName, lastName,
        image: image,
        reposts: reposts, 
        posts: posts,
        saved: saved,
        friends: friends,
    }
    await updateDoc(toUpdate, newVersion)
    loadProfileAndDispatch(action, dispatch)
}


const loadProfileAndDispatch = async (action, dispatch) =>{
    const {payload} = action
    const {email} = payload
    const q = await getDocs(query(collection(db, profile), where("email", "==", email)))
    let newItems = []
    q.forEach(el =>{
        let newItem = el.data()
        newItem.key = el.id
        newItems = [...newItems, newItem]
    })
    let posts = []
    if(newItems[0].friends.length > 0){
        const q1 = await getDocs(query(collection(db, post), where("poster", "in", newItems[0].friends)))
        q1.forEach(el =>{
            let newItem = el.data()
            newItem.key = el.id
            posts = [...posts, newItem]
        })
    }
    let friends = []
    if(newItems[0].friends.length > 0){
        const q1 = await getDocs(query(collection(db, profile), where("email", "in", newItems[0].friends)))
        q1.forEach(el =>{
            let newItem = el.data()
            newItem.key = el.id
            newItems = [...newItems, newItem]
            friends = [...friends, newItem]
        })
    }
    let saved = []
    if(newItems[0].saved.length > 0){
        const q1 = await getDocs(query(collection(db, post), where("id", "in", newItems[0].saved)))
        q1.forEach((el,ind) =>{
            console.log(0)
            let newItem = el.data()
            newItem.key = el.id
            saved = [...saved, newItem]
        })
    }
    console.log(saved)
    let newAction = {
        ...action,
        payload: {newItems: newItems,
                    posts: posts,
                    friends: friends,
                    saved: saved}
    }
    dispatch(newAction)
}

const addPostAndDispatch = async (action, dispatch) =>{
    const {payload} = action
    const {recipe,title, firstName, lastName,image, description, rating, location, likes, poster, reposts, date}= payload
    const coll = collection(db, post)
    await addDoc(coll, {
        recipe: recipe,
        title: title, 
        firstName: firstName,
        lastName, lastName,
        image: image,
        description: description,
        rating: rating, 
        location: location,
        likes: likes,
        poster: poster,
        reposts: reposts,
        date: date,
        id: Date.now()
    })
    loadPostAndDispatch(action, dispatch)
}


const updatePostAndDispatch = async (action, dispatch) =>{
    const {payload} = action
    const {recipe, title, firstName, lastName,image, description, rating, location, likes, poster, reposts, date, key, id}= payload
    const toUpdate = doc(collection(db, post),key)
    const newVersion= {
        recipe: recipe,
        title: title,
        firstName: firstName,
        lastName, lastName,
        image: image,
        description: description,
        rating: rating, 
        location: location,
        likes: likes,
        poster: poster,
        reposts: reposts,
        date: date,
        id: id
    }
    await updateDoc(toUpdate, newVersion)
    loadPostAndDispatch(action, dispatch)
}

const deleteProfileAndDispatch = async (action, dispatch) =>{
    const {payload} = action
    const {key}= payload
    const toDelete = doc(collection(db, profile),key)
    await deleteDoc(toDelete)
    loadProfileAndDispatch(action, dispatch)
}

const deletePostAndDispatch = async (action, dispatch) =>{
    const {payload} = action
    const {key}= payload
    const toDelete = doc(collection(db, post),key)
    await deleteDoc(toDelete)
    loadPostAndDispatch(action, dispatch)
}

const loadPostAndDispatch = async (action, dispatch) =>{
    const {payload} = action
    const {friends}= payload
    const q = await getDocs(query(collection(db, post), where("poster", "in", friends)))
    let newItems = []
    q.forEach(el =>{
        let newItem = el.data()
        newItem.key = el.id
        newItems = [...newItems, newItem]
    })
    let newAction = {
        ...action,
        payload: {posts: newItems}
    }
    dispatch(newAction)
}


export const SaveAndDispatch =async(action, dispatch)=>{
    const {type} = action
    switch(type){
        case ADD_PROFILE:
            addProfileAndDispatch(action, dispatch)
            return
        case DELETE_PROFILE:
            deleteProfileAndDispatch(action, dispatch)
            return
        case UPDATE_PROFILE:
            updateProfileAndDispatch(action, dispatch)
            return
        case LOAD_PROFILE:
            loadProfileAndDispatch(action, dispatch)
            return 
        case ADD_POST:
            addPostAndDispatch(action, dispatch)
            return
        case DELETE_POST:
            deletePostAndDispatch(action, dispatch)
            return
        case UPDATE_POST:
            updatePostAndDispatch(action, dispatch)
            return
        case LOAD_POST:
            loadPostAndDispatch(action, dispatch)
            return 
    }

}