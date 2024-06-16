import React, { useState } from "react";
import { View, Text, Button, ActivityIndicator, ScrollView, StyleSheet, Animated } from "react-native";
import { useSelector } from "react-redux";
import { selectCartItems } from "../redux/slices/basketSlice";
import OrderSummary from "./OrderSummary";
import BillingDetailsForm from "./BillingDetailsForm";
import tw from "twrnc";

const CheckoutPage: React.FC = () => {
  const cartItems = useSelector(selectCartItems);
  const [loading, setLoading] = useState(false);
  const [showBillingForm, setShowBillingForm] = useState(false);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity ?? 1),
    0
  );

  const handlePlaceOrder = () => {
    setShowBillingForm(true);
  };

  return (
    <ScrollView contentContainerStyle={tw`p-6`}>
      <Text style={tw`text-3xl font-bold mb-6 text-center`}>Checkout</Text>
      <View style={tw`flex flex-col md:flex-row md:gap-6`}>
        <OrderSummary totalPrice={totalPrice} />
        <View>
          {!showBillingForm && (
            <View style={tw`flex flex-col justify-center items-center`}>
              <Button
                onPress={handlePlaceOrder}
                title="Place Order"
                color="#1E90FF"
                accessibilityLabel="Place Order"
              />
            </View>
          )}
          {showBillingForm && (
            <BillingDetailsForm totalPrice={totalPrice} setLoading={setLoading} />
          )}
        </View>
      </View>
      {loading && (
        <View style={[styles.overlay, tw`fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50`]}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default CheckoutPage;
