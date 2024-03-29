import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import MakeAccountScreen from "./screens/MakeAccountScreen";
import FeedScreen from "./screens/FeedScreen";
import PostScreen from "./screens/PostScreen";
import SavedPostScreen from "./screens/SavedPostScreen";
import FriendsScreen from "./screens/FriendsScreen";
import RecipeListScreen from "./screens/RecipeListScreen";
import CameraScreen from "./screens/Camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

function FeedTabs() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      name="Feed"
      initialRouteName="FeedScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="FeedScreen" component={FeedScreen} />
      <Stack.Screen name="Post" component={PostScreen} />
    </Stack.Navigator>
  );
}

function RecipesTabs() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="RecipeList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="RecipeList" component={RecipeListScreen} />
      <Stack.Screen name="SavedPost" component={SavedPostScreen} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  /// solving tab viewing problem https://github.com/react-navigation/react-navigation/issues/5230
  const Tabs = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tabs.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: useSelector((state) => state.color).postColor,
          tabBarInactiveTintColor: useSelector((state) => state.color)
            .menuColor,
          tabBarActiveBackgroundColor: useSelector((state) => state.color)
            .iconColor,
          tabBarInactiveBackgroundColor: useSelector((state) => state.color)
            .iconColor,
        }}
      >
        {/*https://stackoverflow.com/questions/64296571/how-to-hide-a-specific-tab-bar-item-from-a-bottom-tab-bar-when-using-react-n*/}
        <Tabs.Screen
          name="Login"
          component={MakeAccountScreen}
          options={{
            tabBarButton: () => null,
            tabBarStyle: { display: "none" },
          }}
        />
        <Tabs.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            tabBarButton: () => null,
            tabBarStyle: { display: "none" },
          }}
        />
        <Tabs.Screen
          name="Feed"
          component={FeedTabs}
          options={{
            tabBarIcon: ({ color }) => {
              return (
                <MaterialCommunityIcons
                  name="newspaper-variant"
                  size={24}
                  color={color}
                />
              );
            },
          }}
        />
        <Tabs.Screen
          name="Friends"
          component={FriendsScreen}
          options={{
            tabBarIcon: ({ color }) => {
              return <AntDesign name="contacts" size={24} color={color} />;
            },
          }}
        />
        <Tabs.Screen
          name="Saved"
          component={RecipesTabs}
          options={{
            tabBarIcon: ({ color }) => {
              return (
                <MaterialCommunityIcons
                  name="content-save"
                  size={24}
                  color={color}
                />
              );
            },
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}

export { TabNavigator };
