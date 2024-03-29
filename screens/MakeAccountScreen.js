import { getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState, useEffect } from "react";
import {
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Image,
  Keyboard,
} from "react-native";
import { firebaseConfig } from "../Secrets";
import { ADD_PROFILE, LOAD_PROFILE } from "../Data/Reducer";
import { SaveAndDispatch } from "../Data/Data";
import { useDispatch, useSelector } from "react-redux";

let app;
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const auth = getAuth(app);

const CreateAccountBox = ({ navigation, setSignIn }) => {
  const {
    backgroundColor,
    postColor,
    textColor,
    iconColor,
    menuColor,
    heartColor,
  } = useSelector((state) => state.color);
  const styles = getStyles(
    backgroundColor,
    postColor,
    textColor,
    iconColor,
    menuColor,
    heartColor,
  );

  const dispatch = useDispatch();
  const profileURL = useSelector((state) => state.profileURL);
  const setProfile = (img) => {
    dispatch({
      type: PROFILE_OVERLAY,
      payload: {
        status: true,
        profileURL: img,
      },
    });
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const addProfile = (email) => {
    const action = {
      type: ADD_PROFILE,
      payload: {
        email: email,
        firstName: "",
        lastName: "",
        image:
          "https://firebasestorage.googleapis.com/v0/b/ken-homework-5.appspot.com/o/Screen%20Shot%202022-12-03%20at%207.09.23%20PM.png?alt=media&token=fc70b561-82a6-4261-9b8e-8abd24bcb552",
        reposts: [],
        posts: [],
        saved: [],
        friends: [email],
      },
    };
    SaveAndDispatch(action, dispatch);
  };

  return (
    <View>
      <View style={styles.signContent}>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setEmail(text);
            }}
            value={email}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setPassword(text);
            }}
            value={password}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            if (password !== "" && email !== "") {
              try {
                await createUserWithEmailAndPassword(auth, email, password);
                addProfile(email);
                setProfile(profileURL);
                navigation.navigate("Feed");
                setPassword("");
                setEmail("");
                setSignIn(true);
              } catch (error) {}
            }
          }}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const LoginBox = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    backgroundColor,
    postColor,
    textColor,
    iconColor,
    menuColor,
    heartColor,
  } = useSelector((state) => state.color);
  const styles = getStyles(
    backgroundColor,
    postColor,
    textColor,
    iconColor,
    menuColor,
    heartColor,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View>
      <View style={styles.loginContent}>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setEmail(text);
            }}
            value={email}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setPassword(text);
            }}
            value={password}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            if (password !== "" && email !== "") {
              try {
                const userInfo = await signInWithEmailAndPassword(
                  auth,
                  email,
                  password,
                );
                const loadProfile = {
                  type: LOAD_PROFILE,
                  payload: { email: userInfo.user.email },
                };
                SaveAndDispatch(loadProfile, dispatch);
                navigation.navigate("Feed");
                setPassword("");
                setEmail("");
              } catch (error) {}
            }
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function MakeAccountScreen(props) {
  const {
    backgroundColor,
    postColor,
    textColor,
    iconColor,
    menuColor,
    heartColor,
  } = useSelector((state) => state.color);
  const styles = getStyles(
    backgroundColor,
    postColor,
    textColor,
    iconColor,
    menuColor,
    heartColor,
  );

  const { navigation, route } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const loadProfile = {
          type: LOAD_PROFILE,
          payload: { email: user.email },
        };
        SaveAndDispatch(loadProfile, dispatch);
        navigation.navigate("Feed");
      }
    });
  }, []);

  const [signIn, setSignIn] = useState(true);

  const logo =
    "https://firebasestorage.googleapis.com/v0/b/ken-homework-5.appspot.com/o/Triangle%201.png?alt=media&token=36a8a298-4b59-4f53-9425-e187afa60b3b";

  return (
    <View onPress={() => Keyboard.dismiss()} style={styles.content}>
      <View style={{ flex: 0.05 }}></View>
      <View onPress={() => Keyboard.dismiss()} style={styles.titleRow}>
        <Image style={styles.logo} source={{ uri: logo }} />
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.labelTitle}>{signIn ? "Login" : "Sign Up"}</Text>
      </View>
      <View style={styles.contentBox}>
        {signIn ? (
          <LoginBox navigation={navigation} />
        ) : (
          <CreateAccountBox setSignIn={setSignIn} navigation={navigation} />
        )}
        <View style={styles.switchOption}>
          <Text style={styles.normalText}>
            {signIn ? "New? " : "Want to login? "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSignIn(!signIn);
            }}
          >
            <Text style={{ color: iconColor }}>Switch</Text>
          </TouchableOpacity>
          <Text style={styles.normalText}>
            {" "}
            to {signIn ? "Sign up" : "Login"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const getStyles = (
  backgroundColor,
  postColor,
  textColor,
  iconColor,
  menuColor,
  heartColor,
) => {
  const styles = {
    logo: {
      height: "70%",
      aspectRatio: 1,
    },
    button: {
      marginTop: 15,
      color: backgroundColor,
      backgroundColor: iconColor,
      padding: 12.5,
      borderRadius: 5,
    },
    buttonText: {
      color: postColor,
      fontSize: 20,
    },
    normalText: {
      color: textColor,
      fontFamily: "Helvetica Neue",
    },
    switchOption: {
      flex: 0.33,
      alignItems: "center",
      justifyContent: "start",
      flexDirection: "row",
    },
    labelRow: {
      flex: 0.1,
      color: textColor,
      fontFamily: "Helvetica Neue",
    },
    loginContent: {
      marginTop: 20,
      padding: 10,
      width: "90%",
      flex: 0.7,
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "center",
    },
    signContent: {
      marginTop: 20,
      padding: 10,
      width: "90%",
      flex: 0.7,
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "center",
    },
    inputRow: {
      width: "100%",
      flexDirection: "row",
      marginBottom: 10,
    },
    titleRow: {
      flex: 0.35,
      justifyContent: "center",
    },
    title: {
      fontSize: 50,
      color: menuColor,
    },
    labelTitle: {
      fontSize: 30,
      color: postColor,
    },
    contentBox: {
      flex: 0.35,
      width: "90%",
      flexDirection: "column",
      alignItems: "center",
      padding: 10,
      backgroundColor: postColor,
      borderRadius: 5,
    },
    label: {
      alignText: "center",
      width: "40%",
      color: textColor,
      fontFamily: "Helvetica Neue",
    },
    input: {
      alignText: "center",
      borderWidth: 1,
      width: "50%",
      height: 20,
      color: textColor,
      borderColor: textColor,
      fontFamily: "Helvetica Neue",
    },
    content: {
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "center",
      backgroundColor: textColor,
      fontFamily: "Helvetica Neue",
      flex: 1,
    },
  };
  return styles;
};
