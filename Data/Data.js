import {
  ADD_PROFILE,
  LOAD_PROFILE,
  LOAD_POST,
  ADD_POST,
  DELETE_PROFILE,
  DELETE_POST,
  UPDATE_PROFILE,
  UPDATE_POST,
  SAVE_PICTURE,
} from "./Reducer";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp, getApps } from "firebase/app";
import {
  setDoc,
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { firebaseConfig } from "../Secrets";
import { getAuth } from "firebase/auth";

const [profile, post] = ["profiles", "posts"];

let firebaseApp = null;

const myApp = () => {
  if (!firebaseApp) {
    if (getApps().length < 1) {
      return initializeApp(firebaseConfig);
    } else {
      return getApps()[0];
    }
  }
};

export const getCred = () => {
  return getAuth(myApp());
};

export const myDB = () => {
  return getFirestore(myApp());
};

export const myStorage = () => {
  return getStorage(myApp());
};

const db = myDB();

const dataLoader = (list) => {
  let newItems = [];
  list.forEach((el) => {
    let newItem = el.data();
    newItem.key = el.id;
    newItems = [...newItems, newItem];
  });
  return newItems;
};

export const savePicture = async (action) => {
  const picture = action.payload.picture;
  const storageRef = ref(myStorage());
  const fileParts = picture.uri.split("/");
  const fileName = fileParts[fileParts.length - 1];
  const pictureRef = ref(storageRef, fileName);
  try {
    const data = await fetch(picture.uri);
    const blob = await data.blob();
    await uploadBytes(pictureRef, blob);
    const pictureURL = await getDownloadURL(pictureRef);
    return pictureURL;
  } catch (e) {
    console.log(e);
  }
};

const addProfileAndDispatch = async (action, dispatch) => {
  const { payload } = action;
  const { email, firstName, lastName, image, reposts, posts, saved, friends } =
    payload;
  const coll = doc(db, profile, getCred().currentUser.uid);
  await setDoc(coll, {
    email: email,
    firstName: firstName,
    lastName,
    lastName,
    image: image,
    reposts: reposts,
    posts: posts,
    saved: saved,
    friends: friends,
  });
  loadProfileAndDispatch(action, dispatch);
};

const updateProfileAndDispatch = async (action, dispatch) => {
  const { payload } = action;
  const {
    key,
    email,
    firstName,
    lastName,
    image,
    reposts,
    posts,
    saved,
    friends,
  } = payload;
  const toUpdate = doc(collection(db, profile), getCred().currentUser.uid);
  const newVersion = {
    email: email,
    firstName: firstName,
    lastName,
    lastName,
    image: image,
    reposts: reposts,
    posts: posts,
    saved: saved,
    friends: friends,
  };
  await updateDoc(toUpdate, newVersion);
  const q1 = await getDocs(
    query(collection(db, post), where("poster", "==", email)),
  );
  const postsToUpdate = dataLoader(q1);
  for (let x = 0; x < postsToUpdate.length; x++) {
    const toUpdate = doc(collection(db, post), postsToUpdate[x].id);
    const newVersion = {
      ...postsToUpdate[x],
      firstName: firstName,
      lastName,
      lastName,
      profImage: image,
    };
    await updateDoc(toUpdate, newVersion);
  }
  loadProfileAndDispatch(action, dispatch);
};

const loadProfileAndDispatch = async (action, dispatch) => {
  const userData = await getDoc(doc(db, profile, getCred().currentUser.uid));
  const userProf = userData.data();
  let posts = [];
  if (userProf.friends.length > 0) {
    const q1 = await getDocs(
      query(
        collection(db, post),
        where("poster", "in", userProf.friends),
        orderBy("timestamp"),
      ),
    );
    posts = dataLoader(q1).reverse();
  }
  let friends = [];
  if (userProf.friends.length > 0) {
    const q1 = await getDocs(
      query(collection(db, profile), where("email", "in", userProf.friends)),
    );
    friends = dataLoader(q1);
  }
  let saved = [];
  if (userProf.saved.length > 0) {
    const q1 = await getDocs(
      query(collection(db, post), where("id", "in", userProf.saved)),
    );
    saved = dataLoader(q1);
  }
  let newAction = {
    ...action,
    payload: {
      profile: userProf,
      posts: posts,
      friends: friends,
      saved: saved,
    },
  };
  dispatch(newAction);
};

const addPostAndDispatch = async (action, dispatch) => {
  const { payload } = action;
  const {
    profImage,
    comments,
    recipe,
    title,
    firstName,
    lastName,
    image,
    description,
    rating,
    location,
    likes,
    poster,
    reposts,
    date,
    id,
  } = payload;
  const coll = doc(db, post, `${poster}${id}`);
  await setDoc(coll, {
    profImage: profImage,
    recipe: recipe,
    title: title,
    firstName: firstName,
    lastName,
    lastName,
    image: image,
    description: description,
    rating: rating,
    location: location,
    likes: likes,
    poster: poster,
    reposts: reposts,
    date: date,
    id: `${poster}${id}`,
    comments: comments,
    timestamp: Date.now(),
  });
  loadPostAndDispatch(action, dispatch);
};

const updatePostAndDispatch = async (action, dispatch) => {
  const { payload } = action;
  const {
    timestamp,
    profImage,
    comments,
    recipe,
    title,
    firstName,
    lastName,
    image,
    description,
    rating,
    location,
    likes,
    poster,
    reposts,
    date,
    id,
  } = payload;
  const toUpdate = doc(collection(db, post), id);
  const newVersion = {
    profImage,
    profImage,
    timestamp: timestamp,
    recipe: recipe,
    title: title,
    firstName: firstName,
    lastName,
    lastName,
    image: image,
    description: description,
    rating: rating,
    location: location,
    likes: likes,
    poster: poster,
    reposts: reposts,
    date: date,
    id: id,
    comments: comments,
  };
  await updateDoc(toUpdate, newVersion);
  loadPostAndDispatch(action, dispatch);
};

const deleteProfileAndDispatch = async (action, dispatch) => {
  const { payload } = action;
  const { key } = payload;
  const toDelete = doc(collection(db, profile), key);
  await deleteDoc(toDelete);
  loadProfileAndDispatch(action, dispatch);
};

const deletePostAndDispatch = async (action, dispatch) => {
  const { payload } = action;
  const { key } = payload;
  const toDelete = doc(collection(db, post), key);
  await deleteDoc(toDelete);
  loadPostAndDispatch(action, dispatch);
};

const loadPostAndDispatch = async (action, dispatch) => {
  const { payload } = action;
  const { friends } = payload;
  const q = await getDocs(
    query(
      collection(db, post),
      where("poster", "in", friends),
      orderBy("timestamp"),
    ),
  );
  const newItems = dataLoader(q).reverse();
  let newAction = {
    ...action,
    payload: { posts: newItems },
  };
  dispatch(newAction);
};

export const SaveAndDispatch = async (action, dispatch) => {
  const { type } = action;
  switch (type) {
    case ADD_PROFILE:
      addProfileAndDispatch(action, dispatch);
      return;
    case DELETE_PROFILE:
      deleteProfileAndDispatch(action, dispatch);
      return;
    case UPDATE_PROFILE:
      updateProfileAndDispatch(action, dispatch);
      return;
    case LOAD_PROFILE:
      loadProfileAndDispatch(action, dispatch);
      return;
    case ADD_POST:
      addPostAndDispatch(action, dispatch);
      return;
    case DELETE_POST:
      deletePostAndDispatch(action, dispatch);
      return;
    case UPDATE_POST:
      updatePostAndDispatch(action, dispatch);
      return;
    case LOAD_POST:
      loadPostAndDispatch(action, dispatch);
      return;
    case SAVE_PICTURE:
      savePictureAndDispatch(action, dispatch);
      return;
  }
};
