import * as React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { Button, Layout } from "@ui-kitten/components";

export function Login({ onLogin }) {
  return (
    <Layout style={styles.container}>
      <View style={styles.buttonView}>
        <Button onPress={onLogin}>LOGIN</Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  surface: {
    height: 380,
    width: "100%",
    elevation: 0,
  },
  buttonView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    width: "100%",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    padding: 20,
    paddingTop: 50,
    justifyContent: "flex-end",
  },
  heading: {
    fontSize: 60,
    color: "#fff",
    maxWidth: "90%",
    fontFamily: "UntitledSerif-Bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    lineHeight: 60,
  },
});
