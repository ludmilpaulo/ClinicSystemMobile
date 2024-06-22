import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import tailwind from "tailwind-react-native-classnames";
import { selectCartItems, updateBasket, decreaseBasket, removeFromBasket, clearCart } from "../redux/slices/basketSlice";
import { Drug } from "../utils/types";
import { FontAwesome } from '@expo/vector-icons';
import { RootStackParamList } from "../utils/types"; // Ensure this path is correct

const CartPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleIncrease = (item: Drug) => {
    if (item.quantity && item.quantity < item.quantity_available) {
      dispatch(updateBasket({ ...item, quantity: item.quantity + 1 }));
    }
  };

  const handleDecrease = (id: number) => {
    dispatch(decreaseBasket(id));
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromBasket(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    navigation.navigate("CheckoutPage"); // Redirect to the checkout page
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  return (
    <View style={tailwind`flex-1 bg-gray-100`}>
      {loading ? (
        <View style={tailwind`absolute top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50`}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <Text style={tailwind`text-3xl font-bold mb-6 text-center`}>Shopping Cart</Text>
          {cartItems.length === 0 ? (
            <View style={tailwind`flex-1 justify-center items-center text-center text-gray-600`}>
              <Text>Your cart is empty.</Text>
              <Text>Continue shopping to add items to your cart.</Text>
            </View>
          ) : (
            <>
              <ScrollView style={tailwind`flex-1 bg-white shadow-lg rounded-lg p-6 mb-20`}>
                {cartItems.map((item) => (
                  <View
                    key={item.id}
                    style={tailwind`flex flex-row justify-between items-center border-b pb-4 mb-4`}
                  >
                    <View style={tailwind`flex flex-row items-center space-x-4`}>
                      <Image
                        source={{ uri: item.image_urls[0] }}
                        style={tailwind`w-20 h-20 rounded shadow`}
                      />
                      <View>
                        <Text style={tailwind`text-lg font-semibold`}>{item.name}</Text>
                        <Text style={tailwind`text-gray-600`}>R{item.price}</Text>
                        <View style={tailwind`flex flex-row items-center space-x-2 mt-2`}>
                          <TouchableOpacity
                            onPress={() => handleDecrease(item.id)}
                            style={tailwind`bg-gray-200 px-3 py-1 rounded-lg shadow hover:bg-gray-300 transition-colors duration-300`}
                          >
                            <FontAwesome name="minus" size={16} color="black" />
                          </TouchableOpacity>
                          <Text style={tailwind`font-semibold text-lg`}>{item.quantity}</Text>
                          <TouchableOpacity
                            onPress={() => handleIncrease(item)}
                            style={tailwind`bg-gray-200 px-3 py-1 rounded-lg shadow hover:bg-gray-300 transition-colors duration-300`}
                          >
                            <FontAwesome name="plus" size={16} color="black" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View style={tailwind`flex flex-row items-center space-x-4`}>
                      <Text style={tailwind`text-lg font-semibold`}>
                        R{(item.price * (item.quantity || 1)).toFixed(2)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleRemove(item.id)}
                        style={tailwind`text-red-500 hover:text-red-700 transition-colors duration-300`}
                      >
                        <FontAwesome name="trash" size={24} color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <View style={tailwind`flex flex-row justify-between items-center mt-6`}>
                  <Text style={tailwind`text-xl font-semibold`}>Total</Text>
                  <Text style={tailwind`text-2xl font-bold`}>R{totalPrice.toFixed(2)}</Text>
                </View>
              </ScrollView>
              <View style={tailwind`absolute bottom-0 left-0 right-0 p-4 bg-white shadow-lg`}>
                <TouchableOpacity
                  onPress={handleCheckout}
                  style={tailwind`bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition-colors duration-300`}
                >
                  <Text style={tailwind`text-white text-center text-lg`}>Checkout</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      )}
    </View>
  );
};

export default CartPage;
