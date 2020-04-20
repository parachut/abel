import * as React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import {
  Button,
  Icon,
  List,
  ListItem,
  Layout,
  Text,
} from "@ui-kitten/components";
import { createStackNavigator } from "@react-navigation/stack";

const data = new Array(8).fill({
  title: "Canon Mark II",
  description: "Serial",
});

const HomeStack = createStackNavigator();

const renderItemAccessory = (props) => <Button size="tiny">SCAN</Button>;

const StarIcon = (props) => (
  <Icon {...props} name="cube-outline" fill="#8F9BB3" />
);

const renderItem = ({ item, index }) => (
  <ListItem
    title={`${item.title}`}
    description={`${item.description}`}
    accessoryRight={renderItemAccessory}
  />
);

const ShipmentList = () => (
  <Layout>
    <List style={styles.container} data={data} renderItem={renderItem} />
  </Layout>
);

export function Shipments({ onLogin }) {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Outbound"
        component={ShipmentList}
        options={{
          headerTitle: (props) => (
            <Text {...props} style={{ fontFamily: "GothamSSm-Medium" }} />
          ),
          headerRight: () => (
            <Button
              appearance="ghost"
              accessoryLeft={StarIcon}
              onPress={() => alert("This is a button!")}
            />
          ),
        }}
      />
    </HomeStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});
