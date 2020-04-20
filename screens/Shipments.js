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

import { gql, useQuery } from "@apollo/client";

const GET_SHIPMENTS = gql`
  {
    shipments {
      id
      trackingCode
    }
  }
`;

const HomeStack = createStackNavigator();

const renderItemAccessory = (props) => <Button size="tiny">SCAN</Button>;

const StarIcon = (props) => (
  <Icon {...props} name="cube-outline" fill="#8F9BB3" />
);

const renderItem = ({ item, index }) => (
  <ListItem
    title={`${item.id}`}
    description={`${item.trackingCode}`}
    accessoryRight={renderItemAccessory}
  />
);

const ShipmentList = () => {
  const { loading, error, data } = useQuery(GET_SHIPMENTS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  console.log(data);

  return (
    <Layout>
      <List
        style={styles.container}
        data={data.shipments}
        renderItem={renderItem}
      />
    </Layout>
  );
};

export function Shipments() {
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
