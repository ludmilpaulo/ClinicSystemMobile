import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import HomePage from "../screens/HomePage";
import CartPage from "../screens/CartPage";

import { useSelector } from "react-redux";
import { selectCartItems } from "../redux/slices/basketSlice";
import tw from 'twrnc';
import { RootStackParamList } from "../utils/types";

const Tab = createBottomTabNavigator<RootStackParamList>();

const MainTabNavigator = () => {
  const cartItems = useSelector(selectCartItems);
  const cartItemCount = cartItems.reduce(
    (count, item) => count + (item.quantity ?? 0),
    0
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "CartPage") {
            iconName = "shopping-cart";
          } else {
            iconName = "circle";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen
        name="CartPage"
        component={CartPage}
        options={{
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
