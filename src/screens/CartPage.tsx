// src/screens/CartPage.tsx
import React from 'react';
import { View, Text, Image, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, updateBasket, decreaseBasket, removeFromBasket, clearCart } from '../redux/slices/basketSlice'; // Update the import path as needed
import { useNavigation } from '@react-navigation/native';
import { Drug } from '../utils/types'; // Import the Drug interface
import tailwind from 'tailwind-react-native-classnames';
import { FaTrashAlt } from 'react-icons/fa';

const CartPage: React.FC = () => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleIncrease = (item: Drug) => {
    dispatch(updateBasket({ ...item, quantity: item.quantity ? item.quantity + 1 : 1 }));
  };

  const handleDecrease = (item: Drug) => {
    dispatch(decreaseBasket(item.id));
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromBasket(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    navigation.navigate('CheckoutPage'); // Redirect to the checkout page
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  return (
    <ScrollView style={tailwind`flex-1 p-6`}>
      <Text style={tailwind`text-2xl font-bold mb-6`}>Shopping Cart</Text>
      {cartItems.length === 0 ? (
        <View style={tailwind`text-center text-gray-600`}>
          <Text>Your cart is empty.</Text>
          <Text>Continue shopping to add items to your cart.</Text>
        </View>
      ) : (
        <>
          <View style={tailwind`flex-row justify-between items-center mb-6`}>
            <Text style={tailwind`text-xl font-semibold`}>Cart Items</Text>
            <TouchableOpacity onPress={handleClearCart} style={tailwind`bg-red-500 text-white px-4 py-2 rounded`}>
              <Text style={tailwind`text-white`}>Clear Cart</Text>
            </TouchableOpacity>
          </View>
          <View style={tailwind`bg-white shadow-lg rounded-lg p-6`}>
            {cartItems.map((item) => (
              <View key={item.id} style={tailwind`flex-row justify-between items-center border-b pb-4 mb-4`}>
                <View style={tailwind`flex-row items-center space-x-4`}>
                  <Image source={{ uri: item.image_urls[0] }} style={tailwind`w-20 h-20 rounded`} />
                  <View>
                    <Text style={tailwind`text-lg font-semibold`}>{item.name}</Text>
                    <Text style={tailwind`text-gray-600`}>{item.price} Kz</Text>
                    <View style={tailwind`flex-row items-center space-x-2 mt-2`}>
                      <TouchableOpacity onPress={() => handleDecrease(item)} style={tailwind`bg-gray-200 px-3 py-1 rounded`}>
                        <Text>-</Text>
                      </TouchableOpacity>
                      <Text>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => handleIncrease(item)} style={tailwind`bg-gray-200 px-3 py-1 rounded`}>
                        <Text>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={tailwind`flex-row items-center space-x-4`}>
                  <Text style={tailwind`text-lg font-semibold`}>R{(item.price * (item.quantity || 1)).toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => handleRemove(item.id)} style={tailwind`text-red-500`}>
                    <FaTrashAlt />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={tailwind`flex-row justify-between items-center mt-6`}>
              <Text style={tailwind`text-xl font-semibold`}>Total</Text>
              <Text style={tailwind`text-2xl font-bold`}>R{totalPrice.toFixed(2)}</Text>
            </View>
            <View style={tailwind`flex-row justify-end mt-6`}>
              <TouchableOpacity onPress={handleCheckout} style={tailwind`bg-green-500 text-white px-6 py-2 rounded`}>
                <Text style={tailwind`text-white`}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default CartPage;
