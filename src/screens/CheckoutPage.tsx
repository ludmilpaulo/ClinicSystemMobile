import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import OrderSummary from "./OrderSummary";
import BillingDetailsForm from "./BillingDetailsForm";
import { t } from "react-native-tailwindcss";
import * as Animatable from 'react-native-animatable';

import { selectCartItems } from "../redux/slices/basketSlice"; // Adjust the path based on your project structure

const CheckoutPage: React.FC = () => {
  const cartItems = useSelector(selectCartItems) as any[]; // Adjust the type based on your actual state structure
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
    <View style={[styles.container, t.p6]}>
      <Text style={[t.text3xl, t.fontBold, t.mB6, t.textCenter]}>Checkout</Text>
      <View style={[styles.gridContainer]}>
        <OrderSummary totalPrice={totalPrice} />
        <View>
          {!showBillingForm && (
            <View style={[t.flex, t.flexCol, t.justifyCenter, t.itemsCenter]}>
              <TouchableOpacity
                onPress={handlePlaceOrder}
                style={[t.bgBlue500, t.pX6, t.pY2, t.rounded, styles.button]}
              >
                <Text style={[t.textWhite]}>Place Order</Text>
              </TouchableOpacity>
            </View>
          )}
          {showBillingForm && (
            <BillingDetailsForm
              totalPrice={totalPrice}
              setLoading={setLoading}
            />
          )}
        </View>
      </View>
      <Animatable.View
        animation={loading ? "fadeIn" : "fadeOut"}
        duration={300}
        style={[loading ? styles.loadingContainer : t.hidden]}
      >
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </Animatable.View>
    </View>
  );
};

export default CheckoutPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 50,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: 64,
    height: 64,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: "#ffffff",
    borderRadius: 32,
  },
});
