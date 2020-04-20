import * as React from "react";
import { StyleSheet, View, ImageBackground } from "react-native";
import { Button, Layout, Text } from "@ui-kitten/components";
import { BarCodeScanner } from "expo-barcode-scanner";

export function Search({ onLogin }) {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.buttonView}>
        {hasPermission === null && (
          <Text>Requesting for camera permission</Text>
        )}

        {hasPermission === false && <Text>No access to camera</Text>}
        {hasPermission === true && (
          <>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />

            {scanned && (
              <Button onPress={() => setScanned(false)}>
                Tap to Scan Again
              </Button>
            )}
          </>
        )}
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
