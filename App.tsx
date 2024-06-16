import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LogBox } from 'react-native';
import HomePage from "./src/screens/HomePage";
import StoreProvider from "./src/redux/StoreProvider";
import BannerScreen from "./src/screens/BannerScreen";
import DrugPage from "./src/screens/DrugPage";
import CheckoutPage from "./src/screens/CheckoutPage";
import CartPage from "./src/screens/CartPage";

// Suppress specific warnings
LogBox.ignoreLogs([
  'Warning: TRenderEngineProvider: Support for defaultProps will be removed from function components in a future major release.',
  'Warning: MemoizedTNodeRenderer: Support for defaultProps will be removed from memo components in a future major release.',
  'Warning: TNodeChildrenRenderer: Support for defaultProps will be removed from function components in a future major release.',
  'Warning: bound renderChildren: Support for defaultProps will be removed from function components in a future major release.',
]);

const Stack = createStackNavigator();

const App = () => {
  return (
    <StoreProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="BannerScreen" component={BannerScreen} />
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="DrugPage" component={DrugPage} />
          <Stack.Screen name="CartPage" component={CartPage} />
          <Stack.Screen name="CheckoutPage" component={CheckoutPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
};

export default App;
