import React from "react";
import { View, Text, Button, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, decreaseBasket, updateBasket, removeFromBasket } from "../redux/slices/basketSlice";
import { FaTruck, FaLock } from "react-icons/fa";
import tw from "twrnc";

interface OrderSummaryProps {
  totalPrice: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ totalPrice }) => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

  return (
    <View style={tw`bg-white shadow-lg rounded-lg p-6`}>
      <Text style={tw`text-xl font-semibold mb-4`}>Order Summary</Text>
      {cartItems.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <View>
          {cartItems.map((item) => (
            <View key={item.id} style={tw`flex flex-row justify-between items-center mb-4`}>
              <View>
                <Text style={tw`text-lg font-semibold`}>{item.name}</Text>
                <Text style={tw`text-gray-600`}>
                  R{item.quantity ?? 1} x {item.price}
                </Text>
                <View style={tw`flex flex-row items-center space-x-2 mt-2`}>
                  <TouchableOpacity
                    onPress={() => dispatch(decreaseBasket(item.id))}
                    style={tw`bg-gray-200 px-3 py-1 rounded`}
                  >
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => dispatch(updateBasket(item))}
                    style={tw`bg-gray-200 px-3 py-1 rounded`}
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => dispatch(removeFromBasket(item.id))}
                    style={tw`text-red-500 ml-2`}
                  >
                    <Text>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={tw`text-lg font-semibold`}>
                R{(item.price * (item.quantity ?? 1)).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={tw`border-t pt-4 mt-4`}>
            <View style={tw`flex flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-lg font-semibold`}>Total</Text>
              <Text style={tw`text-2xl font-bold`}>R{totalPrice.toFixed(2)}</Text>
            </View>
            <View style={tw`flex flex-row justify-between items-center text-gray-600 text-sm`}>
              <Text style={tw`flex items-center`}>
                <FaTruck className="mr-2" /> Shipping
              </Text>
              <Text>Free</Text>
            </View>
            <View style={tw`flex flex-row justify-between items-center text-gray-600 text-sm`}>
              <Text style={tw`flex items-center`}>
                <FaLock className="mr-2" /> Secure Checkout
              </Text>
              <Text>SSL Encrypted</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default OrderSummary;
