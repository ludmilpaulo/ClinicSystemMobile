import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, decreaseBasket, updateBasket, removeFromBasket } from "../redux/slices/basketSlice";
import Icon from 'react-native-vector-icons/FontAwesome';
import { t } from "react-native-tailwindcss";

interface OrderSummaryProps {
  totalPrice: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ totalPrice }) => {
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();

  return (
    <View style={[t.bgWhite, t.shadowLg, t.roundedLg, t.p6]}>
      <Text style={[t.textXl, t.fontSemibold, t.mB4]}>Order Summary</Text>
      {cartItems.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <View>
          {cartItems.map((item) => (
            <View key={item.id} style={[t.flex, t.flexRow, t.justifyBetween, t.itemsCenter, t.mB4]}>
              <View>
                <Text style={[t.textLg, t.fontSemibold]}>{item.name}</Text>
                <Text style={[t.textGray600]}>
                  R{item.quantity ?? 1} x {item.price}
                </Text>
                <View style={[t.flex, t.flexRow, t.itemsCenter, t.mT2]}>
                  <TouchableOpacity
                    onPress={() => dispatch(decreaseBasket(item.id))}
                    style={[t.bgGray200, t.pX3, t.pY1, t.rounded]}
                  >
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text style={[t.mX2]}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => dispatch(updateBasket(item))}
                    style={[t.bgGray200, t.pX3, t.pY1, t.rounded]}
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => dispatch(removeFromBasket(item.id))}
                    style={[t.textRed500, t.mL2]}
                  >
                    <Text>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={[t.textLg, t.fontSemibold]}>
                R{(item.price * (item.quantity ?? 1)).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={[t.borderT, t.pT4, t.mT4]}>
            <View style={[t.flex, t.flexRow, t.justifyBetween, t.itemsCenter, t.mB2]}>
              <Text style={[t.textLg, t.fontSemibold]}>Total</Text>
              <Text style={[t.text2xl, t.fontBold]}>R{totalPrice.toFixed(2)}</Text>
            </View>
            <View style={[t.flex, t.flexRow, t.justifyBetween, t.itemsCenter, t.textGray600, t.textSm]}>
              <Text style={[t.flex, t.itemsCenter]}>
                <Icon name="truck" size={16} style={[t.mR2]} /> Shipping
              </Text>
              <Text>Free</Text>
            </View>
            <View style={[t.flex, t.flexRow, t.justifyBetween, t.itemsCenter, t.textGray600, t.textSm]}>
              <Text style={[t.flex, t.itemsCenter]}>
                <Icon name="lock" size={16} style={[t.mR2]} /> Secure Checkout
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
