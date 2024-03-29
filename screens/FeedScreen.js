import { signOut, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  Image,
  ScrollView,
  Switch,
  Keyboard,
} from "react-native";
import { Overlay } from "@rneui/themed";
import {
  ADD_POST,
  LOAD_POST,
  UPDATE_PROFILE,
  UPDATE_COLOR,
  PROFILE_OVERLAY,
  POST_OVERLAY,
} from "../Data/Reducer";
import { useDispatch, useSelector } from "react-redux";
import { SaveAndDispatch } from "../Data/Data";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Post } from "../components/Post";

const StarRating = ({ rating, setRating }) => {
  let start = [0, 0, 0, 0, 0];
  start = start.map((el, ind) => (el = ind < rating ? 1 : 0));
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

  return (
    <View style={styles.rating}>
      {start.map((el, ind) => (
        <TouchableOpacity
          key={ind}
          onPress={() => {
            setRating(ind + 1);
          }}
        >
          {el === 1 ? (
            <FontAwesome name="star" size={24} color={iconColor} />
          ) : (
            <FontAwesome name="star-o" size={24} color={iconColor} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function FeedScreen(props) {
  const {
    backgroundColor,
    postColor,
    textColor,
    iconColor,
    menuColor,
    heartColor,
    topMenu,
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

  const postURL = useSelector((state) => state.postURL);
  const profileURL = useSelector((state) => state.profileURL);
  const makePostOverlay = useSelector((state) => state.setPost);
  const showOverlay = useSelector((state) => state.setProfile);

  const placeholder =
    "https://firebasestorage.googleapis.com/v0/b/ken-homework-5.appspot.com/o/Screen%20Shot%202022-12-03%20at%207.09.23%20PM.png?alt=media&token=fc70b561-82a6-4261-9b8e-8abd24bcb552";

  const setPost = (status, img) => {
    dispatch({
      type: POST_OVERLAY,
      payload: {
        status: status,
        postURL: img,
      },
    });
  };

  const setProfile = (status, img) => {
    dispatch({
      type: PROFILE_OVERLAY,
      payload: {
        status: status,
        profileURL: img,
      },
    });
  };

  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const profile = useSelector((state) => state.profile);
  const [showSettings, setShowSettings] = useState(false);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [image, setImage] = useState(profile.image);
  const [lastName, setLastName] = useState(profile.lastName);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(1);
  const [recipe, setRecipe] = useState("");
  const [location, setLocation] = useState([0, 0]);
  const [dayMode, setDayMode] = useState(true);
  const [inceptionOverlay, setInceptionOverlay] = useState(false);

  useEffect(() => {
    setPost(makePostOverlay, postURL);
    setProfile(showOverlay, profileURL);
    setImage(profile.image);
    setLastName(profile.lastName);
    setFirstName(profile.firstName);
  }, [profile.lastName]);

  const getLocation = async () => {
    setInceptionOverlay(true);
    let locationAllowed = await Location.requestForegroundPermissionsAsync()
      .status;
    if (locationAllowed !== "granted") {
    }
    const curLocation = await Location.getCurrentPositionAsync({});
    setInceptionOverlay(false);
    setLocation([curLocation.coords.latitude, curLocation.coords.longitude]);
  };

  const updateProfile = (firstName, lastName, image) => {
    const action = {
      type: UPDATE_PROFILE,
      payload: {
        ...profile,
        firstName: firstName,
        lastName: lastName,
        image: image,
      },
    };
    SaveAndDispatch(action, dispatch);
  };

  const updateColor = (status) => {
    setDayMode(status);
    dispatch({
      type: UPDATE_COLOR,
      payload: {
        status: status,
      },
    });
  };

  const addPost = (
    profImage,
    comments,
    recipe,
    title,
    firstName,
    lastName,
    foodImage,
    description,
    rating,
    location,
    likes,
    poster,
    reposts,
    date,
    friends,
    id,
  ) => {
    const action = {
      type: ADD_POST,
      payload: {
        profImage,
        profImage,
        recipe: recipe,
        title: title,
        firstName: firstName,
        lastName: lastName,
        image: foodImage,
        description: description,
        rating: rating,
        location: location,
        likes: likes,
        poster: poster,
        reposts: reposts,
        date: date,
        friends: friends,
        comments: comments,
        id: id,
      },
    };
    SaveAndDispatch(action, dispatch);
  };

  return (
    <View style={styles.all} onPress={() => Keyboard.dismiss()}>
      <Overlay
        overlayStyle={styles.overlay}
        isVisible={showSettings}
        onBackdropPress={() => setShowSettings(false)}
      >
        <View style={styles.topRow}>
          <TouchableOpacity
            title={"Cancel"}
            onPress={() => {
              setShowSettings(false);
            }}
          >
            <MaterialIcons name="cancel" size={45} color={heartColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.settingsInputRow}>
          <Text style={styles.labelText}>Night Mode</Text>
          <Switch
            style={{ margin: 10 }}
            trackColor={{ false: backgroundColor, true: backgroundColor }}
            thumbColor={iconColor}
            ios_backgroundColor={backgroundColor}
            onValueChange={() => {
              updateColor(!dayMode);
            }}
            value={!dayMode}
          />
        </View>
        <View style={styles.settingsInputRow}>
          <Text style={styles.labelText}>Sign Out</Text>
          <TouchableOpacity
            style={{ margin: 10 }}
            onPress={async () => {
              setShowSettings(false);
              await signOut(getAuth());
              updateColor(true);
              navigation.navigate("Login");
            }}
          >
            <AntDesign name="logout" size={35} color={iconColor} />
          </TouchableOpacity>
        </View>
      </Overlay>
      <Overlay
        overlayStyle={styles.overlayPost}
        isVisible={makePostOverlay}
        onBackdropPress={() => setPost(false, postURL)}
        onPress={() => Keyboard.dismiss()}
      >
        <Overlay
          overlayStyle={styles.inceptionOverlay}
          isVisible={inceptionOverlay}
          onBackdropPress={() => setInceptionOverlay(false)}
        >
          <Text style={styles.titleText}>Fetching Location...</Text>
        </Overlay>
        <View style={styles.topRow}>
          <TouchableOpacity
            title={"Cancel"}
            onPress={() => {
              setPost(false, postURL);
            }}
          >
            <MaterialIcons name="cancel" size={45} color={heartColor} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ width: "100%", height: "80%" }}>
          <View style={{ marginTop: 10 }}>
            <View style={styles.inputRowOverlay}>
              <Text style={styles.labelText}>Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder="title"
                value={title}
                onChangeText={(text) => setTitle(text)}
              />
            </View>
            <View style={styles.inputRowOverlay}>
              <Text style={styles.labelText}>Rating</Text>
              <StarRating rating={rating} setRating={setRating} />
            </View>
            <View style={styles.inputRowOverlay}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.labelText}>Image </Text>
                <TouchableOpacity
                  onPress={() => {
                    setPost(false, postURL);
                    navigation.navigate("Camera", { prev: "post" });
                  }}
                >
                  <AntDesign name="camera" size={35} color={iconColor} />
                </TouchableOpacity>
              </View>
              {postURL === null ? (
                <Text>No picture selected yet</Text>
              ) : (
                <Image style={styles.postPreview} source={{ uri: postURL }} />
              )}
            </View>
            <View style={styles.inputRowOverlay}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.labelText}>Location </Text>
                <TouchableOpacity
                  title={"loc"}
                  onPress={() => {
                    getLocation();
                  }}
                >
                  <Entypo name="location" size={25} color={iconColor} />
                </TouchableOpacity>
              </View>
              {location[0] === 0 ? (
                <Text>No Location Added</Text>
              ) : (
                <Text>Location Added</Text>
              )}
            </View>
            <View style={styles.inputRowOverlay}>
              <Text style={styles.labelText}>Description</Text>
              <TextInput
                style={styles.textInput}
                placeholder={"Description"}
                value={description}
                onChangeText={(text) => setDescription(text)}
              />
            </View>
            <View style={styles.inputRowOverlay}>
              <Text style={styles.labelText}>Recipe</Text>
              <TextInput
                multiline={true}
                style={styles.textInputTest}
                placeholder="Recipe"
                value={recipe}
                onChangeText={(text) => setRecipe(text)}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.submitRow}>
          <TouchableOpacity
            title={"Post"}
            onPress={() => {
              addPost(
                profile.image,
                [],
                recipe,
                title,
                profile.firstName,
                profile.lastName,
                postURL,
                description,
                rating,
                location,
                [],
                profile.email,
                [],
                new Date().toLocaleDateString(),
                profile.friends,
                Date.now(),
              );
              setPost(false, placeholder);
              setTitle("");
              setDescription("");
              setRecipe("");
              setRating(1);
              setLocation([0, 0]);
            }}
          >
            <MaterialIcons name="check-circle" size={75} color={textColor} />
          </TouchableOpacity>
        </View>
      </Overlay>

      <View style={styles.content}>
        <View style={styles.inputRow}>
          <TouchableOpacity
            onPress={() => {
              setShowSettings(true);
            }}
          >
            <MaterialIcons name="settings" size={30} color={topMenu} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const loadPost = {
                type: LOAD_POST,
                payload: { friends: profile.friends },
              };
              SaveAndDispatch(loadPost, dispatch);
            }}
          >
            <FontAwesome name="refresh" size={30} color={topMenu} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPost(true, postURL);
            }}
          >
            <MaterialIcons name="post-add" size={30} color={topMenu} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setProfile(true, profile.image);
            }}
          >
            <FontAwesome name="user" size={30} color={topMenu} />
          </TouchableOpacity>
        </View>
        <FlatList
          nestedScrollEnabled={true}
          style={styles.feedContainer}
          data={posts}
          renderItem={({ item }) => {
            return (
              <Post userPost={item} navigation={navigation} profile={profile} />
            );
          }}
        />
      </View>

      <Overlay
        overlayStyle={styles.overlay}
        isVisible={showOverlay}
        onBackdropPress={() => setProfile(false, profile.image)}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={styles.topRow}>
          <TouchableOpacity
            title={"Cancel"}
            onPress={() => {
              setImage(profile.image);
              setProfile(false, profile.image);
            }}
          >
            <MaterialIcons name="cancel" size={45} color={heartColor} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 10 }}>
          <View style={styles.inputRowOverlay}>
            <Text style={styles.labelText}>First Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="title"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
          </View>
          <View style={styles.inputRowOverlay}>
            <Text style={styles.labelText}>Last Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="title"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />
          </View>

          <View style={styles.inputRowOverlay}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.labelText}>Image</Text>
              <TouchableOpacity
                onPress={() => {
                  setProfile(false, profile.image);
                  navigation.navigate("Camera", { prev: "profile" });
                }}
              >
                <AntDesign name="camera" size={35} color={iconColor} />
              </TouchableOpacity>
            </View>
            {profileURL === null ? (
              <Image
                style={styles.profilePreview}
                source={{ uri: profile.image }}
              />
            ) : (
              <Image
                style={styles.profilePreview}
                source={{ uri: profileURL }}
              />
            )}
          </View>
          <View style={styles.submitRow}>
            <TouchableOpacity
              title={"Post"}
              onPress={() => {
                updateProfile(firstName, lastName, profileURL);
                setProfile(false, profileURL);
              }}
            >
              <MaterialIcons name="check-circle" size={75} color={textColor} />
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
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
  const styles2 = {
    titleText: {
      fontSize: 20,
      color: textColor,
      fontFamily: "Helvetica Neue",
    },
    inceptionOverlay: {
      padding: 20,
      width: "90%",
      justifyContent: "center",
      alignItems: "center",
    },
    textInputTest: {
      width: "75%",
      borderWidth: 1,
    },
    profilePreview: {
      width: 100,
      aspectRatio: 1,
      borderRadius: "50%",
      borderWidth: 3,
      borderColor: iconColor,
    },
    postPreview: {
      width: "50%",
      aspectRatio: 1,
      borderRadius: 5,
    },
    settingsInputRow: {
      marginTop: 10,
      width: "100%",
      alignItems: "center",
    },
    topRow: {
      position: "absolute",
      top: 0,
      left: 0,
      flexDirection: "row",
      justifyContent: "start",
      zIndex: 100,
    },
    overlayPost: {
      height: "85%",
      width: "85%",
      backgroundColor: postColor,
    },
    overlay: {
      width: "85%",
      backgroundColor: postColor,
    },
    all: {
      flex: 1,
    },
    mainBody: {
      flex: 7,
    },
    commentLine: {
      flexDirection: "column",
    },

    commentsList: {
      width: "100%",
      backgroundColor: "purple",
      height: "20%",
      flex: 0.2,
    },
    labelText: {
      fontSize: 20,
      color: textColor,
      fontFamily: "Helvetica Neue",
    },
    inputRowOverlay: {
      width: "100%",
      flexDirection: "column",
      paddingTop: 20,
      alignItems: "center",
    },
    submitRow: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      padding: 0,
    },
    thumb: {
      flexDirection: "row",
    },
    rating: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "center",
    },
    middleContent: {
      flex: 0.5,
      justifyContent: "center",
      width: "100%",
      flexDirection: "row",
    },
    profImg: {
      width: 50,
      height: 50,
      marginRight: 5,
      borderRadius: "50%",
    },
    logo: {
      width: 100,
      height: 100,
    },
    postTitle: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "center",
      color: textColor,
      fontFamily: "Helvetica Neue",
    },
    postTopSub: {
      flexDirection: "row",
      justifyContent: "start",
      height: 50,
      alignItems: "center",
    },
    postTop: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    inputRow: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-evenly",
      paddingTop: 20,
      paddingBottom: 5,
    },
    feedContainer: {
      width: "100%",
      backgroundColor: backgroundColor,
      height: "100%",
    },
    post: {
      width: "90%",
      backgroundColor: postColor,
      marginLeft: "5%",
      marginTop: "5%",
      padding: 10,
      borderRadius: 5,
      flex: 1,
    },
    textInput: {
      borderWidth: 1,
      padding: 2,
      width: "75%",
    },

    content: {
      flexDirection: "column",
      flex: 1,
      backgroundColor: backgroundColor,
    },
  };
  return styles2;
};
