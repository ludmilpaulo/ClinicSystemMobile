import React, { useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import OrderSummary from "./OrderSummary";
import tailwind from "tailwind-react-native-classnames";
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';
import { selectCartItems } from "../redux/slices/basketSlice"; // Adjust the path based on your project structure
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../utils/types";

const CheckoutPage: React.FC = () => {
  const cartItems = useSelector(selectCartItems) as any[]; // Adjust the type based on your actual state structure
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity ?? 1),
    0
  );

  const handlePlaceOrder = () => {
    navigation.navigate("BillingDetailsForm", { totalPrice });
  };

  return (
    <SafeAreaView style={tailwind`flex-1 bg-gray-100`}>
      <View style={tailwind`flex-1 p-6`}>
        <Text style={tailwind`text-3xl font-bold mb-6 text-center`}>Checkout</Text>
        <View style={tailwind`flex-1 justify-between`}>
          <OrderSummary totalPrice={totalPrice} />
          <View style={tailwind`mt-6 flex justify-center items-center`}>
            <TouchableOpacity
              onPress={handlePlaceOrder}
              style={tailwind`bg-blue-500 px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300 flex-row items-center`}
            >
              <FontAwesome name="shopping-cart" size={20} color="white" style={tailwind`mr-2`} />
              <Text style={tailwind`text-white text-lg`}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {loading && (
        <Animatable.View
          animation="fadeIn"
          duration={300}
          style={tailwind`absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center`}
        >
          <ActivityIndicator size="large" color="#ffffff" />
        </Animatable.View>
      )}
    </SafeAreaView>
  );
};

export default CheckoutPage;
