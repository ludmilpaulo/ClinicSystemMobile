import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateBasket, selectCartItems } from "../redux/slices/basketSlice"; // Update the import path as needed
import { Drug } from "../utils/types";
import { baseAPI } from "../utils/variables";
import Icon from "react-native-vector-icons/FontAwesome";
import RenderHTML from "react-native-render-html";
import tailwind from "tailwind-react-native-classnames";

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
      axios
        .get(`${baseAPI}/pharmacy/pharmacy/detail/${drugId}/`)
        .then((response) => {
          setDrug(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [drugId]);

  const handleAddToCart = (drug: Drug) => {
    dispatch(updateBasket(drug));
  };

  const isInCart = (drug: Drug) => {
    return cartItems.some((item) => item.id === drug.id);
  };

  const nextSlide = () => {
    if (drug && drug.image_urls) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % drug.image_urls.length
      );
    }
  };

  const prevSlide = () => {
    if (drug && drug.image_urls) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? drug.image_urls.length - 1 : prevIndex - 1
      );
    }
  };

  const { width } = Dimensions.get("window");

  return (
    <View style={tailwind`flex-1 pt-14 pb-10 px-4`}>
      {loading ? (
        <View style={[styles.fixed, styles.center, styles.fullScreen, styles.overlay]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {error && (
            <Text style={tailwind`text-center text-red-500 mb-4`}>Error: {error}</Text>
          )}
          {drug && (
            <ScrollView contentContainerStyle={tailwind`bg-white shadow-lg rounded-lg p-6`}>
              <TouchableOpacity
                style={tailwind`flex-row items-center text-blue-500 mb-4`}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-left" size={20} style={tailwind`mr-2`} />
                <Text>Back to Products</Text>
              </TouchableOpacity>
              <View style={tailwind`flex-col`}>
                <View style={tailwind`w-full relative mb-4`}>
                  {drug.image_urls && drug.image_urls.length > 0 ? (
                    <>
                      <Image
                        source={{ uri: drug.image_urls[currentImageIndex] }}
                        style={styles.image}
                      />
                      <TouchableOpacity
                        style={styles.arrowButton}
                        onPress={prevSlide}
                      >
                        <Icon name="chevron-left" size={20} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.arrowButton, styles.rightArrowButton]}
                        onPress={nextSlide}
                      >
                        <Icon name="chevron-right" size={20} color="white" />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <View style={tailwind`w-full h-full bg-gray-200 flex items-center justify-center rounded`}>
                      <Text>No Images Available</Text>
                    </View>
                  )}
                </View>
                <View style={tailwind`w-full`}>
                  <Text style={tailwind`text-2xl font-bold mb-2`}>{drug.name}</Text>
                  <Text style={tailwind`text-lg font-semibold text-gray-700 mb-4`}>R{drug.price}</Text>
                  <Text style={tailwind`text-gray-600 mb-2`}>
                    <Text style={tailwind`font-semibold`}>Category:</Text> {drug.category_name}
                  </Text>
                  <RenderHTML
                    contentWidth={width - 40} // Adjust the content width as needed
                    source={{ html: drug.description }}
                    baseStyle={tailwind`text-gray-600 mb-4`}
                  />
                  {drug.quantity_available < 10 && (
                    <Text style={tailwind`text-red-500 text-sm mb-4`}>
                      Warning: Low stock, only {drug.quantity_available} left!
                    </Text>
                  )}
                  <TouchableOpacity
                    style={[
                      tailwind`flex-row items-center justify-center bg-green-500 text-white px-4 py-2 rounded w-full`,
                      isInCart(drug) ? tailwind`opacity-50` : {}
                    ]}
                    onPress={() => handleAddToCart(drug)}
                    disabled={isInCart(drug)}
                  >
                    <Icon name="shopping-cart" size={20} style={tailwind`mr-2`} />
                    <Text>{isInCart(drug) ? "Already in Cart" : "Add to Cart"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 240, // Adjust height as needed
    borderRadius: 8,
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    left: 0,
    transform: [{ translateY: -50 }],
    backgroundColor: "#4b5563",
    padding: 8,
    borderRadius: 50,
  },
  rightArrowButton: {
    left: "auto",
    right: 0,
  },
  fixed: {
    position: "absolute",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreen: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default DrugPage;
