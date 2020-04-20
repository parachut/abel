import * as eva from "@eva-design/eva";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  ApplicationProvider,
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  IconRegistry,
  Layout,
  Text,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { AppLoading } from "expo";
import * as AppAuth from "expo-app-auth";
import * as Font from "expo-font";
import React from "react";
import { AsyncStorage } from "react-native";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "apollo-link-context";

import mapping from "./mapping.json";
import { Login } from "./screens/Login";
import { Search } from "./screens/Search";
import { Shipments } from "./screens/Shipments";
import { default as theme } from "./theme.json"; // <-- Import app theme

const NAV_PERSISTENCE_KEY = "@Airbox:NavigationState";
const AUTH_STORAGE_KEY = "@Airbox:OktaAuthKey";
const Tab = createBottomTabNavigator();

const config = {
  issuer: "https://dev-736842.okta.com/oauth2/default",
  clientId: "0oa5j8ymneJaA7Nwe4x6",
  redirectUrl: "com.okta.dev-736842:/callback",
  scopes: ["openid", "profile"],
};

function HomeScreen() {
  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home!</Text>
    </Layout>
  );
}

function SettingsScreen() {
  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings!</Text>
    </Layout>
  );
}
const App = (props) => {
  const [authState, setAuthState] = React.useState(null);
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: authState
          ? `${authState.tokenType} ${authState.accessToken}`
          : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  React.useEffect(() => {
    (async () => {
      let cachedAuth = await getCachedAuthAsync();
      if (cachedAuth && !authState) {
        setAuthState(cachedAuth);
      }
    })();
  }, []);

  return (
    <React.Fragment>
      <IconRegistry icons={EvaIconsPack} />
      {!isLoadingComplete && !props.skipLoadingScreen ? (
        <AppLoading
          startAsync={loadResourcesAsync}
          onError={handleLoadingError}
          onFinish={() => handleFinishLoading(setLoadingComplete)}
        />
      ) : (
        <ApplicationProvider
          mapping={eva.mapping}
          theme={{ ...eva.light, ...theme }}
          customMapping={mapping}
        >
          {authState ? (
            <ApolloProvider client={client}>
              <NavigationContainer>
                <Tab.Navigator
                  screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;

                      const map = {
                        Home: "home",
                        Settings: "settings",
                        Shipments: "car",
                        Search: "search",
                        Inventory: "pricetags",
                      };

                      iconName = focused
                        ? map[route.name]
                        : map[route.name] + "-outline";

                      // You can return any component that you like here!
                      return (
                        <Icon
                          name={iconName}
                          width={size}
                          height={size}
                          fill={color}
                        />
                      );
                    },
                  })}
                  tabBarOptions={{
                    showLabel: false,
                    activeTintColor: "#F0636A",
                    inactiveTintColor: "#8F9BB3",
                  }}
                >
                  <Tab.Screen name="Home" component={HomeScreen} />
                  <Tab.Screen name="Shipments" component={Shipments} />
                  <Tab.Screen name="Search" component={Search} />
                  <Tab.Screen name="Inventory" component={SettingsScreen} />
                  <Tab.Screen name="Settings" component={SettingsScreen} />
                </Tab.Navigator>
              </NavigationContainer>
            </ApolloProvider>
          ) : (
            <Login
              onLogin={async () => {
                const _authState = await signInAsync();
                setAuthState(_authState);
              }}
            />
          )}
        </ApplicationProvider>
      )}
    </React.Fragment>
  );
};

async function loadResourcesAsync() {
  await Promise.all([
    Font.loadAsync({
      "GothamSSm-Book": require("./assets/GothamSSm-Book.otf"),
      "GothamSSm-Medium": require("./assets/GothamSSm-Bold.otf"),
      "UtitledSerif-Bold": require("./assets/UntitledSerif-Bold.otf"),
    }),
  ]);
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

export async function signInAsync() {
  let authState = await AppAuth.authAsync(config);
  await cacheAuthAsync(authState);
  return authState;
}

async function cacheAuthAsync(authState) {
  return await AsyncStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(authState)
  );
}

export async function getCachedAuthAsync() {
  let value = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  let authState = JSON.parse(value);
  if (authState) {
    if (checkIfTokenExpired(authState)) {
      return refreshAuthAsync(authState);
    } else {
      return authState;
    }
  }
  return null;
}

function checkIfTokenExpired({ accessTokenExpirationDate }) {
  return new Date(accessTokenExpirationDate) < new Date();
}

async function refreshAuthAsync({ refreshToken }) {
  let authState = await AppAuth.refreshAsync(config, refreshToken);
  await cacheAuthAsync(authState);
  return authState;
}

export async function signOutAsync({ accessToken }) {
  try {
    await AppAuth.revokeAsync(config, {
      token: accessToken,
      isClientIdProvided: true,
    });
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  } catch (e) {
    alert(`Failed to revoke token: ${e.message}`);
  }
}

export default App;
