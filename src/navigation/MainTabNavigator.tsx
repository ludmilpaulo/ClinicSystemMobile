import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import HomePage from "../screens/HomePage";
import CartPage from "../screens/CartPage";
import UserProfile from "../screens/UserProfile";
import LoginForm from "../screens/LoginForm"; // Import the LoginForm component

import { useSelector } from "react-redux";
import { selectCartItems } from "../redux/slices/basketSlice";
import { selectUser } from "../redux/slices/authSlice";
import { RootStackParamList } from "../utils/types";

const Tab = createBottomTabNavigator<RootStackParamList>();

const MainTabNavigator = () => {
  const cartItems = useSelector(selectCartItems);
  const user = useSelector(selectUser);
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
          } else if (route.name === "UserProfile" || route.name === "Login") {
            iconName = "user";
          } else {
            iconName = "circle";
          }

          return <Icon name={iconName} type="font-awesome" size={size} color={color} />;
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
      {user ? (
        <Tab.Screen name="UserProfile" component={UserProfile} />
      ) : (
        <Tab.Screen name="Login" component={LoginForm} />
      )}
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
