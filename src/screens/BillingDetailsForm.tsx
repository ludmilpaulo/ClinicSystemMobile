import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import axios from "axios";
import { WebView } from "react-native-webview";
import { t } from "react-native-tailwindcss";
import { selectUser } from "../redux/slices/authSlice"; // Adjust the path based on your project structure
import { clearCart, selectCartItems } from "../redux/slices/basketSlice";
import { baseAPI } from "../utils/variables"; // Adjust the path based on your project structure

interface FormState {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface BillingDetailsFormProps {
  totalPrice: number;
  setLoading: (loading: boolean) => void;
}

const BillingDetailsForm: React.FC<BillingDetailsFormProps> = ({
  totalPrice,
  setLoading,
}) => {
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
      const response = await fetch(`${baseAPI}/order/checkout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        dispatch(clearCart());
        if (status === "completed") {
          Alert.alert("Success", "Order completed successfully.");
        }
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        Alert.alert("Error", `Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error:", error);
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
    const myData: Record<string, string> = {
      merchant_id: process.env.NEXT_PUBLIC_MERCHANT_ID!,
      merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY!,
      return_url: process.env.NEXT_PUBLIC_RETURN_URL!,
      cancel_url: process.env.NEXT_PUBLIC_RETURN_URL!,
      notify_url: `${process.env.NEXT_PUBLIC_BASE_API}/order/notify/`,
      name_first: form.name.split(" ")[0],
      name_last: form.name.split(" ")[1] || "",
      email_address: form.email,
      m_payment_id: `${new Date().getTime()}`,
      amount: totalPrice.toFixed(2),
      item_name: `Order #${new Date().getTime()}`,
    };

    const passPhrase = process.env.NEXT_PUBLIC_PASSPHRASE!;
    myData.signature = generateSignature(myData, passPhrase);

    const pfParamString = dataToString(myData);
    const paymentUUID = await generatePaymentIdentifier(pfParamString);

    if (paymentUUID) {
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
          return_url: "${process.env.NEXT_PUBLIC_RETURN_URL!}",
          cancel_url: "${process.env.NEXT_PUBLIC_CANCEL_URL!}",
        });
      `;

      webviewRef.current?.injectJavaScript(injectedJavaScript);
    }
  };

  return (
    <View style={[styles.container, t.bgWhite, t.p6, t.roundedLg, t.shadowMd]}>
      <Text style={[t.text2xl, t.fontSemibold, t.mB4]}>Billing Details</Text>
      <TextInput
        style={[t.mB4, t.wFull, t.p2, t.border, t.rounded]}
        placeholder="Name"
        value={form.name}
        onChangeText={(value) => handleChange("name", value)}
      />
      <TextInput
        style={[t.mB4, t.wFull, t.p2, t.border, t.rounded]}
        placeholder="Email"
        value={form.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
      />
      <TextInput
        style={[t.mB4, t.wFull, t.p2, t.border, t.rounded]}
        placeholder="Address"
        value={form.address}
        onChangeText={(value) => handleChange("address", value)}
      />
      <TextInput
        style={[t.mB4, t.wFull, t.p2, t.border, t.rounded]}
        placeholder="City"
        value={form.city}
        onChangeText={(value) => handleChange("city", value)}
      />
      <TextInput
        style={[t.mB4, t.wFull, t.p2, t.border, t.rounded]}
        placeholder="Postal Code"
        value={form.postalCode}
        onChangeText={(value) => handleChange("postalCode", value)}
      />
      <TextInput
        style={[t.mB4, t.wFull, t.p2, t.border, t.rounded]}
        placeholder="Country"
        value={form.country}
        onChangeText={(value) => handleChange("country", value)}
      />
      <TouchableOpacity
        onPress={handleMakePayment}
        style={[t.bgGreen500, t.pX6, t.pY2, t.rounded, t.mT4]}
      >
        <Text style={[t.textWhite, t.textCenter]}>Make Payment</Text>
      </TouchableOpacity>

      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: '<html><head></head><body></body></html>' }}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'completed') {
            handleSubmitOrder('completed');
          } else if (event.nativeEvent.data === 'canceled') {
            handleSubmitOrder('canceled');
          }
        }}
        style={{ display: 'none' }}
      />
    </View>
  );
};

export default BillingDetailsForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
