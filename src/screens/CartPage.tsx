import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "twrnc";
import {
  selectCartItems,
  updateBasket,
  decreaseBasket,
  removeFromBasket,
  clearCart,
} from "../redux/slices/basketSlice";
import { Drug } from "../utils/types";

const CartPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
    <View style={tw`flex-1 p-6`}>
      {loading ? (
        <View
          style={tw`fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50`}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView>
          <Text style={tw`text-3xl font-bold mb-6 text-center`}>
            Shopping Cart
          </Text>
          {cartItems.length === 0 ? (
            <View style={tw`text-center text-gray-600`}>
              <Text>Your cart is empty.</Text>
              <Text>Continue shopping to add items to your cart.</Text>
            </View>
          ) : (
            <>
              <View style={tw`flex-row justify-between items-center mb-6`}>
                <Text style={tw`text-xl font-semibold`}>Cart Items</Text>
                <TouchableOpacity
                  onPress={handleClearCart}
                  style={tw`bg-red-500 text-white px-4 py-2 rounded`}
                >
                  <Text style={tw`text-white`}>Clear Cart</Text>
                </TouchableOpacity>
              </View>
              <View style={tw`bg-white shadow-lg rounded-lg p-6`}>
                {cartItems.map((item) => (
                  <View
                    key={item.id}
                    style={tw`flex-row justify-between items-center border-b pb-4 mb-4`}
                  >
                    <View style={tw`flex-row items-center space-x-4`}>
                      <Image
                        source={{ uri: item.image_urls[0] }}
                        style={tw`w-20 h-20 rounded`}
                        resizeMode="cover"
                      />
                      <View>
                        <Text style={tw`text-lg font-semibold`}>
                          {item.name}
                        </Text>
                        <Text style={tw`text-gray-600`}>R{item.price}</Text>
                        <View style={tw`flex-row items-center space-x-2 mt-2`}>
                          <TouchableOpacity
                            onPress={() => handleDecrease(item.id)}
                            style={tw`bg-gray-200 px-3 py-1 rounded`}
                          >
                            <Text>-</Text>
                          </TouchableOpacity>
                          <Text style={tw`font-semibold text-lg`}>
                            {item.quantity}
                          </Text>
                          <TouchableOpacity
                            onPress={() => handleIncrease(item)}
                            style={tw`bg-gray-200 px-3 py-1 rounded`}
                          >
                            <Text>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View style={tw`flex-row items-center space-x-4`}>
                      <Text style={tw`text-lg font-semibold`}>
                        R{(item.price * (item.quantity || 1)).toFixed(2)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleRemove(item.id)}
                        style={tw`text-red-500`}
                      >
                        <Icon name="trash" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                <View style={tw`flex-row justify-between items-center mt-6`}>
                  <Text style={tw`text-xl font-semibold`}>Total</Text>
                  <Text style={tw`text-2xl font-bold`}>
                    R{totalPrice.toFixed(2)}
                  </Text>
                </View>
                <View style={tw`flex-row justify-end mt-6`}>
                  <TouchableOpacity
                    onPress={handleCheckout}
                    style={tw`bg-green-500 text-white px-6 py-2 rounded`}
                  >
                    <Text style={tw`text-white`}>Checkout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default CartPage;
