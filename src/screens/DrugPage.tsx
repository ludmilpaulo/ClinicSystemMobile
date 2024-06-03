import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateBasket, selectCartItems } from '../redux/slices/basketSlice'; // Update the import path as needed
import { Drug } from '../utils/types';
import { baseAPI } from '../utils/variables';
import tw from 'twrnc';
import { FaShoppingCart, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DrugPage: React.FC = () => {
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const { id: drugId } = route.params as { id: string };

  useEffect(() => {
    if (drugId) {
      axios.get(`${baseAPI}/pharmacy/pharmacy/detail/${drugId}/`)
        .then(response => {
          setDrug(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [drugId]);

  const handleAddToCart = (drug: Drug) => {
    dispatch(updateBasket(drug));
  };

  const isInCart = (drug: Drug) => {
    return cartItems.some(item => item.id === drug.id);
  };

  const nextSlide = () => {
    if (drug && drug.image_urls) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % drug.image_urls.length);
    }
  };

  const prevSlide = () => {
    if (drug && drug.image_urls) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? drug.image_urls.length - 1 : prevIndex - 1));
    }
  };

  return (
    <View style={tw`flex-1 pt-14`}>
      {loading ? (
        <View style={tw`fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50`}>
          <View style={tw`w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin`}></View>
        </View>
      ) : (
        <>
          {error && <Text style={tw`text-center text-red-500 mb-4`}>Error: {error}</Text>}
          {drug && (
            <View style={tw`bg-white shadow-lg rounded-lg p-6`}>
              <TouchableOpacity
                style={tw`flex-row items-center text-blue-500 mb-4`}
                onPress={() => navigation.goBack()}
              >
                <FaArrowLeft style={tw`mr-2`} /> Back to Products
              </TouchableOpacity>
              <View style={tw`flex-col md:flex-row`}>
                <View style={tw`w-full md:w-1/2 relative mb-4 md:mb-0`}>
                  {drug.image_urls && drug.image_urls.length > 0 ? (
                    <>
                      <Image
                        source={{ uri: drug.image_urls[currentImageIndex] }}
                        style={tw`w-full h-48 rounded`}
                      />
                      <TouchableOpacity
                        style={tw`absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full`}
                        onPress={prevSlide}
                      >
                        <FaChevronLeft />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={tw`absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full`}
                        onPress={nextSlide}
                      >
                        <FaChevronRight />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={tw`w-full h-48 bg-gray-200 flex items-center justify-center rounded`}>
                      <Text>No Images Available</Text>
                    </View>
                  )}
                </View>
                <View style={tw`w-full md:w-1/2 md:pl-6`}>
                  <Text style={tw`text-2xl font-bold mb-2`}>{drug.name}</Text>
                  <Text style={tw`text-lg font-semibold text-gray-700 mb-4`}>{drug.price} Kz</Text>
                  <Text style={tw`text-gray-600 mb-2`}><strong>Category:</strong> {drug.category_name}</Text>
                  <Text style={tw`text-gray-600 mb-4`} dangerouslySetInnerHTML={{ __html: drug.description }} />
                  {drug.quantity_available < 10 && (
                    <Text style={tw`text-red-500 text-sm mb-4`}>
                      Warning: Low stock, only {drug.quantity_available} left!
                    </Text>
                  )}
                  <TouchableOpacity
                    style={tw`flex-row items-center justify-center bg-green-500 text-white px-4 py-2 rounded w-full ${isInCart(drug) ? 'opacity-50' : ''}`}
                    onPress={() => handleAddToCart(drug)}
                    disabled={isInCart(drug)}
                  >
                    <FaShoppingCart style={tw`mr-2`} /> {isInCart(drug) ? 'Already in Cart' : 'Add to Cart'}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default DrugPage;
