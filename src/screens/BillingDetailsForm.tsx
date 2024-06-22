import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import axios from "axios";
import { WebView } from "react-native-webview";
import tailwind from "tailwind-react-native-classnames";
import { selectUser } from "../redux/slices/authSlice"; // Adjust the path based on your project structure
import { clearCart, selectCartItems } from "../redux/slices/basketSlice";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../utils/types";

const NEXT_PUBLIC_BASE_API = "https://ludmil.pythonanywhere.com";
const NEXT_PUBLIC_GOOGLE_API_KEY = "your_google_api_key_here";
const NEXT_PUBLIC_RETURN_URL = "https://www.trustmenclinic.com/thank-you";
const NEXT_PUBLIC_CANCEL_URL = "https://www.trustmenclinic.com/cancel"; // Added this line
const NEXT_PUBLIC_MERCHANT_ID = "10000100";
const NEXT_PUBLIC_MERCHANT_KEY = "46f0cd694581a";
const NEXT_PUBLIC_PASSPHRASE = "jt7NOE43FZPn";

type BillingDetailsFormRouteProp = RouteProp<RootStackParamList, 'BillingDetailsForm'>;

interface FormState {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const BillingDetailsForm: React.FC = () => {
  const route = useRoute<BillingDetailsFormRouteProp>();
  const { totalPrice } = route.params;
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const token = user?.token;
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const webviewRef = useRef<WebView>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (name: keyof FormState, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmitOrder = async (status: string) => {
    setLoading(true);
    console.log("Submitting order with status:", status);

    const orderData = {
      token: token || null,
      user_id: user?.user_id,
      name: form.name,
      email: form.email,
      total_price: totalPrice,
      address: form.address,
      city: form.city,
      postal_code: form.postalCode,
      country: form.country,
      payment_method: "payfast",
      status,
      items: cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch(`${NEXT_PUBLIC_BASE_API}/order/checkout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log("Order submission successful");
        dispatch(clearCart());
        if (status === "completed") {
          Alert.alert("Success", "Order completed successfully.");
        }
      } else {
        const errorData = await response.json();
        console.error("Error during order submission:", errorData);
        Alert.alert("Error", `Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error during order submission:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }

    setLoading(false);
  };

  const generateSignature = (
    data: Record<string, string>,
    passphrase: string,
  ): string => {
    const queryString = Object.keys(data)
      .map(
        (key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`,
      )
      .join("&");
    const signatureString = `${queryString}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`;
    return CryptoJS.MD5(signatureString).toString();
  };

  const dataToString = (dataArray: Record<string, string>): string => {
    return Object.keys(dataArray)
      .map(
        (key) =>
          `${key}=${encodeURIComponent(dataArray[key].trim()).replace(/%20/g, "+")}`,
      )
      .join("&");
  };

  const generatePaymentIdentifier = async (pfParamString: string) => {
    try {
      const response = await axios.post(
        "https://sandbox.payfast.co.za/onsite/process",
        pfParamString,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      console.log("Payment identifier generated successfully:", response.data.uuid); // Debug statement
      return response.data.uuid;
    } catch (error: any) {
      console.error(
        "PayFast payment identifier generation error:",
        error.response ? error.response.data : error.message,
      );
      Alert.alert(
        "Error",
        `An error occurred during payment identifier generation: ${error.response ? error.response.data : error.message}`,
      );
      return null;
    }
  };

  const handleMakePayment = async () => {
    console.log("Make Payment button pressed"); // Debug statement

    const myData: Record<string, string> = {
      merchant_id: NEXT_PUBLIC_MERCHANT_ID,
      merchant_key: NEXT_PUBLIC_MERCHANT_KEY,
      return_url: NEXT_PUBLIC_RETURN_URL,
      cancel_url: NEXT_PUBLIC_CANCEL_URL,
      notify_url: `${NEXT_PUBLIC_BASE_API}/order/notify/`,
      name_first: form.name.split(" ")[0],
      name_last: form.name.split(" ")[1] || "",
      email_address: form.email,
      m_payment_id: `${new Date().getTime()}`,
      amount: totalPrice.toFixed(2),
      item_name: `Order #${new Date().getTime()}`,
    };

    const passPhrase = NEXT_PUBLIC_PASSPHRASE;
    myData.signature = generateSignature(myData, passPhrase);

    console.log("Generated signature:", myData.signature); // Debug statement

    const pfParamString = dataToString(myData);
    const paymentUUID = await generatePaymentIdentifier(pfParamString);

    if (paymentUUID) {
      console.log("Submitting order with status pending"); // Debug statement
      await handleSubmitOrder("pending");

      // Injecting JavaScript into the WebView to handle PayFast payment
      const injectedJavaScript = `
        window.addEventListener("message", (event) => {
          if (event.data && event.data.status) {
            if (event.data.status === "completed") {
              window.ReactNativeWebView.postMessage("completed");
            } else if (event.data.status === "cancelled") {
              window.ReactNativeWebView.postMessage("canceled");
            }
          }
        });

        window.payfast_do_onsite_payment({
          uuid: "${paymentUUID}",
          return_url: "${NEXT_PUBLIC_RETURN_URL}",
          cancel_url: "${NEXT_PUBLIC_CANCEL_URL}",
        });
      `;

      console.log("Injecting JavaScript into WebView:", injectedJavaScript); // Debug statement
      webviewRef.current?.injectJavaScript(injectedJavaScript);
    }
  };

  return (
    <View style={tailwind`p-4 bg-white rounded-lg shadow-md`}>
      <Text style={tailwind`text-2xl font-semibold mb-4`}>Billing Details</Text>
      <TextInput
        style={tailwind`mb-4 w-full p-2 border rounded`}
        placeholder="Name"
        value={form.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      <TextInput
        style={tailwind`mb-4 w-full p-2 border rounded`}
        placeholder="Email"
        value={form.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
      />
      <TextInput
        style={tailwind`mb-4 w-full p-2 border rounded`}
        placeholder="Address"
        value={form.address}
        onChangeText={(value) => handleChange("address", value)}
      />
      <TextInput
        style={tailwind`mb-4 w-full p-2 border rounded`}
        placeholder="City"
        value={form.city}
        onChangeText={(value) => handleChange("city", value)}
      />
      <TextInput
        style={tailwind`mb-4 w-full p-2 border rounded`}
        placeholder="Postal Code"
        value={form.postalCode}
        onChangeText={(value) => handleChange("postalCode", value)}
      />
      <TextInput
        style={tailwind`mb-4 w-full p-2 border rounded`}
        placeholder="Country"
        value={form.country}
        onChangeText={(value) => handleChange("country", value)}
      />
      <TouchableOpacity
        onPress={handleMakePayment}
        style={tailwind`bg-green-500 px-6 py-2 rounded mt-4`}
      >
        <Text style={tailwind`text-white text-center`}>Make Payment</Text>
      </TouchableOpacity>

      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: '<html><head></head><body></body></html>' }}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'completed') {
            console.log("Payment completed"); // Debug statement
            handleSubmitOrder('completed');
          } else if (event.nativeEvent.data === 'canceled') {
            console.log("Payment canceled"); // Debug statement
            handleSubmitOrder('canceled');
          }
        }}
        style={{ display: 'none' }}
      />
      {loading && (
        <View style={tailwind`absolute top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50`}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

export default BillingDetailsForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
