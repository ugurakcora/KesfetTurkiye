import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store } from "./store";
import AppNavigator from "./navigation/AppNavigator";
import { checkUser } from "./store/authSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";

export default function App() {
  useEffect(() => {
    store.dispatch(checkUser());
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
