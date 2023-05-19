import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Button,
  RefreshControl,
} from "react-native";
import { useEffect, useState, createContext, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useWindowDimensions } from "react-native";
import RenderHtml from "react-native-render-html";

const Context = createContext();
const ContextProvider = (props) => {
  const [title, setTitle] = useState("Hello World");

  return <Context.Provider value={title}>{props.children}</Context.Provider>;
};

function HomeScreen({ navigation }) {
  const [blog, setBlog] = useState([]);
  const [image, setImage] = useState([]);
  const Stack = createStackNavigator();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    GetBlog();
  }, []);

  const GetBlog = () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("https://www.lenasoftware.com/api/v1/en/maestro/1", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setBlog(result.result);
        for (let i = 0; i < result.result.length; i++) {
          setImage(result.result[i].image);
        }
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {blog.map((item, index) => {
          return (
            <View key={index} style={styles.item}>
              <Text
                style={styles.title}
                onPress={() => navigation.navigate("Detail", { item })}
              >
                {item.title}
              </Text>
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 400,
                  height: 200,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
              />
              <Text>{item.summary}</Text>
              <Text style={styles.readingTime}>
                Total Reading Time: {item.totalReadingTime}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function Detail({ navigation, route }) {
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const source = {
    html: route.params.item.content,
  };
  console.log(source);
  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 10 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text>{route.params.item.title}</Text>
      <RenderHtml contentWidth={width} source={source} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  txtMain: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginVertical: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  readingTime: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
  },
});
