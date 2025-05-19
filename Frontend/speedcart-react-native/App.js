import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Foo from "./Foo";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello there World!</Text>
      <Foo />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
