import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  updateBasket,
  selectCartItems,
  decreaseBasket,
} from "../redux/slices/basketSlice"; // Update the import path as needed
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Drug, RootStackParamList } from "../utils/types"; // Import the Drug interface
import tailwind from "tailwind-react-native-classnames";


type Props = {
  drug: Drug;
};

type DrugCardNavigationProp = StackNavigationProp<RootStackParamList, 'DrugPage'>;

const DrugCard: React.FC<Props> = ({ drug }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const navigation = useNavigation<DrugCardNavigationProp>();
  const currentImageIndex = 0; // Assuming you handle image index somehow

  const [inCart, setInCart] = useState(false);

  const handleAdd = (drug: Drug) => {
    const currentCartQuantity =
      cartItems.find((item) => item.id === drug.id)?.quantity ?? 0;
    if (currentCartQuantity < drug.quantity_available) {
      dispatch(updateBasket(drug));
    } else {
      Alert.alert("Cannot add more than available stock");
    }
  };

  const handleDecrease = (drugId: number) => {
    dispatch(decreaseBasket(drugId));
  };

  useEffect(() => {
    if (drug) {
      const item = cartItems.find((item) => item.id === drug.id);
      setInCart(item ? (item.quantity ?? 0) > 0 : false);
    }
  }, [cartItems, drug]);

  if (!drug || drug.quantity_available <= 0) return null; // Don't display if drug is undefined or quantity is less than or equal to 0

  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - 20; // Adjust based on padding/margin

  return (
    <View
      style={[
        tailwind`bg-white rounded-lg shadow-lg p-4 m-2`,
        { width: cardWidth },
      ]}
    >
      <View style={tailwind`relative w-full h-64 rounded-t-lg overflow-hidden`}>
        {drug.image_urls && drug.image_urls[currentImageIndex] ? (
          <Image
            source={{ uri: drug.image_urls[currentImageIndex] }}
            style={styles.image}
          />
        ) : (
          <View
            style={tailwind`w-full h-full bg-gray-200 flex items-center justify-center`}
          >
            <Text>No Image Available</Text>
          </View>
        )}
        <Text
          style={[
            tailwind`absolute top-2 right-2 font-semibold text-lg text-white bg-black bg-opacity-75 px-2 py-1 rounded`,
            styles.priceText,
          ]}
        >
          R{drug.price}
        </Text>
      </View>
      <View style={tailwind`relative p-4`}>
        <View style={tailwind`mb-2 flex items-center justify-between`}>
          <Text style={tailwind`font-semibold text-lg text-gray-900`}>
            {drug.name}
          </Text>
        </View>
        {drug.quantity_available < 10 && (
          <Text style={tailwind`text-red-500 text-sm mt-2`}>
            Warning: Low stock, only {drug.quantity_available} left!
          </Text>
        )}
      </View>
      <View style={tailwind`relative flex justify-between items-center p-4`}>
        {inCart ? (
          <View style={tailwind`flex flex-row items-center`}>
            <TouchableOpacity
              style={tailwind`bg-red-500 px-4 py-2 rounded`}
              onPress={() => handleDecrease(drug.id)}
            >
              <Text style={tailwind`text-white`}>-</Text>
            </TouchableOpacity>
            <Text style={tailwind`text-lg mx-2`}>
              {cartItems.find((item) => item.id === drug.id)?.quantity ?? 0}
            </Text>
            <TouchableOpacity
              style={tailwind`bg-green-500 px-4 py-2 rounded`}
              onPress={() => handleAdd(drug)}
            >
              <Text style={tailwind`text-white`}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={tailwind`bg-green-500 px-4 py-2 rounded w-full`}
            onPress={() => handleAdd(drug)}
          >
            <Text style={tailwind`text-white text-center`}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={tailwind`relative p-4`}>
        {inCart ? (
          <TouchableOpacity onPress={() => navigation.navigate("CartPage")}>
            <Text style={tailwind`mt-6 text-blue-500`}>Go to Cart</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate("DrugPage", { id: drug.id })}
          >
            <Text style={tailwind`mt-6 text-blue-500`}>View Product</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Equivalent to object-contain
  },
  priceText: {
    zIndex: 10,
  },
});

export default DrugCard;
