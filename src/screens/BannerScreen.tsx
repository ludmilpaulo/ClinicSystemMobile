import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
} from "react-native";
import { fetchAboutUsData } from "../services/adminService";
import { AboutUsData, ApiResponse } from "../utils/types";
import { useNavigation } from "@react-navigation/native";
import { t } from "react-native-tailwindcss";
import Animated, { FadeIn } from "react-native-reanimated";

const BannerScreen: React.FC = () => {
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");

  useEffect(() => {
    console.log("Component mounted");
    setIsMounted(true);
    const fetchData = async () => {
      try {
        console.log("Fetching About Us data");
        const data: ApiResponse | null = await fetchAboutUsData();
        if (data && Array.isArray(data) && data.length > 0) {
          setHeaderData(data[0]);
        } else {
          console.log("No data available");
          Alert.alert("Error", "No data available");
        }
      } catch (error) {
        console.error("Error fetching About Us data:", error);
        Alert.alert("Error", "Network Error");
      }
    };
    fetchData();
  }, []);

  const backgroundImage =
    headerData?.backgroundApp ??
    "https://ludmil.pythonanywhere.com/media/logo/logo2_w3URzZg.png";

  const handleViewProducts = () => {
    console.log("Navigating to Home page");
    navigation.navigate("Home"); // Replace with the name of your products page
  };

  const textStyle = width > 600 ? t.text4xl : t.text2xl;
  const textStyleBold = width > 600 ? t.text6xl : t.text4xl;

  return (
    <View
      style={[t.flex, t.itemsCenter, t.justifyCenter, t.minHFull, t.bgBlue500]}
    >
      {!isMounted || !headerData ? (
        <View
          style={[
            styles.fixed,
            t.top0,
            t.left0,
            t.z50,
            t.flex,
            t.itemsCenter,
            t.justifyCenter,
            t.wFull,
            t.hFull,
            styles.bgBlackOpacity,
          ]}
        >
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <ImageBackground
          source={{ uri: backgroundImage }}
          style={[t.flex, t.justifyCenter, t.itemsCenter, t.wFull, t.hFull]}
        >
          <View
            style={[
              t.flex,
              t.justifyCenter,
              t.itemsCenter,
              styles.bgBlackOpacity,
              t.p4,
            ]}
          >
            <Animated.Text
              entering={FadeIn.delay(500).duration(1000)}
              style={[textStyle, t.fontSemibold, t.textWhite, t.mB2]}
            >
              THE BEST
            </Animated.Text>
            <Animated.Text
              entering={FadeIn.delay(1000).duration(1000)}
              style={[textStyleBold, t.fontBold, t.textBlue500, t.mB4]}
            >
              MEDICAL
            </Animated.Text>
            <Animated.Text
              entering={FadeIn.delay(1500).duration(1000)}
              style={[textStyle, t.fontSemibold, t.textWhite, t.mB4]}
            >
              HEALTHY CENTRE
            </Animated.Text>
            <Animated.Text
              entering={FadeIn.delay(2000).duration(1000)}
              style={[
                t.textLg,
                t.textGray300,
                t.mB6,
                styles.maxW,
                t.textCenter,
              ]}
            >
              At Men&apos;s Clinic, we are dedicated to providing specialized
              products and treatments designed exclusively for men&apos;s
              health.
            </Animated.Text>
            <Animated.View entering={FadeIn.delay(2500).duration(1000)}>
              <TouchableOpacity
                style={[
                  t.mT4,
                  t.bgBlue600,
                  t.textWhite,
                  t.fontBold,
                  t.pY3,
                  t.pX6,
                  t.roundedLg,
                ]}
                onPress={handleViewProducts}
              >
                <Text style={t.textWhite}>VIEW OUR PRODUCTS</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fixed: {
    position: "absolute",
  },
  bgBlackOpacity: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  maxW: {
    maxWidth: "80%",
  },
});

export default BannerScreen;
