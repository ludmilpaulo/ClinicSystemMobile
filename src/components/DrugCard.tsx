import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Drug } from '../utils/types';
import { updateBasket, selectCartItems, decreaseBasket } from '../redux/slices/basketSlice';
import tw from 'twrnc';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

type Props = {
  drug: Drug;
};

const DrugCard: React.FC<Props> = ({ drug }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const cartItems = useSelector(selectCartItems);
  const currentImageIndex = 0; // Assuming you handle image index somehow

  const [inCart, setInCart] = useState(false);

  const handleAdd = (drug: Drug) => {
    const currentCartQuantity = cartItems.find((item) => item.id === drug.id)?.quantity ?? 0;
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

  return (
    <View style={tw`relative bg-white rounded-lg shadow-lg p-4 mb-4`}>
      <View style={tw`absolute inset-0 rounded-lg bg-blue-500 opacity-0 hover:opacity-100`} />
      <View style={tw`relative h-48 rounded-t-lg overflow-hidden`}>
        {drug.image_urls && drug.image_urls[currentImageIndex] ? (
          <Image
            source={{ uri: drug.image_urls[currentImageIndex] }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
        ) : (
          <View style={tw`w-full h-full bg-gray-200 flex items-center justify-center`}>
            <Text>No Image Available</Text>
          </View>
        )}
      </View>
      <View style={tw`relative p-4`}>
        <View style={tw`mb-2 flex-row justify-between items-center`}>
          <Text style={tw`font-semibold text-lg text-gray-900`}>{drug.name}</Text>
          <Text style={tw`font-semibold text-lg text-gray-900`}>R{drug.price}</Text>
        </View>

        {drug.quantity_available < 10 && (
          <Text style={tw`text-red-500 text-sm mt-2`}>
            Warning: Low stock, only {drug.quantity_available} left!
          </Text>
        )}
      </View>
      <View style={tw`relative flex-row justify-between items-center p-4`}>
        {inCart ? (
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity
              style={tw`bg-red-500 text-white px-4 py-2 rounded`}
              onPress={() => handleDecrease(drug.id)}
            >
              <Text>-</Text>
            </TouchableOpacity>
            <Text style={tw`text-lg mx-2`}>{cartItems.find((item) => item.id === drug.id)?.quantity ?? 0}</Text>
            <TouchableOpacity
              style={tw`bg-green-500 text-white px-4 py-2 rounded`}
              onPress={() => handleAdd(drug)}
            >
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={tw`bg-green-500 text-white px-4 py-2 rounded w-full`}
            onPress={() => handleAdd(drug)}
          >
            <Text>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={tw`relative p-4`}>
        {inCart ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('CartPage')}
            style={tw`mt-6`}
          >
            <Text style={tw`text-blue-500`}>Go to Cart</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('DrugPage', { id: drug.id })}
            style={tw`mt-6`}
          >
            <Text style={tw`text-blue-500`}>View Product</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default DrugCard;
