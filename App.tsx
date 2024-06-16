import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LogBox, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import HomePage from "./src/screens/HomePage";
import StoreProvider from "./src/redux/StoreProvider";
import BannerScreen from "./src/screens/BannerScreen";
import DrugPage from "./src/screens/DrugPage";
import CartPage from "./src/screens/CartPage";
import CheckoutPage from "./src/screens/CheckoutPage";
import MainTabNavigator from "./src/navigation/MainTabNavigator";
import { RootStackParamList } from "./src/utils/types";

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        ...FontAwesome.font,
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <StoreProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="BannerScreen" component={BannerScreen} />
          <Stack.Screen name="Home" component={MainTabNavigator} />
          <Stack.Screen name="DrugPage" component={DrugPage} />
          <Stack.Screen name="CartPage" component={CartPage} />
          <Stack.Screen name="CheckoutPage" component={CheckoutPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
};

export default App;
