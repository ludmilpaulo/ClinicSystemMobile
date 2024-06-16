import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import CryptoJS from "crypto-js";
import axios from "axios";
import { selectUser } from "../redux/slices/authSlice";
import { clearCart, selectCartItems } from "../redux/slices/basketSlice";
import { baseAPI } from "../utils/variables";
import tw from "twrnc";

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
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sandbox.payfast.co.za/onsite/engine.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (name: string, value: string) => {
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
          navigation.navigate("ThankYouPage");
        }
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        Alert.alert("Error", errorData.detail);
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

  const handleMakePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

      window.addEventListener("message", (event) => {
        if (event.data && event.data.status) {
          if (event.data.status === "completed") {
            handleSubmitOrder("completed");
          } else if (event.data.status === "cancelled") {
            handleSubmitOrder("canceled");
          }
        }
      });

      window.payfast_do_onsite_payment({
        uuid: paymentUUID,
        return_url: process.env.NEXT_PUBLIC_RETURN_URL!,
        cancel_url: process.env.NEXT_PUBLIC_CANCEL_URL!,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={tw`bg-white p-6 rounded-lg shadow-md`}>
      <Text style={tw`text-2xl font-semibold mb-4`}>Billing Details</Text>
      <TextInput
        placeholder="Name"
        value={form.name}
        onChangeText={(value) => handleChange("name", value)}
        style={tw`mb-4 w-full p-2 border rounded`}
      />
      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(value) => handleChange("email", value)}
        style={tw`mb-4 w-full p-2 border rounded`}
      />
      <TextInput
        placeholder="Address"
        value={form.address}
        onChangeText={(value) => handleChange("address", value)}
        style={tw`mb-4 w-full p-2 border rounded`}
      />
      <TextInput
        placeholder="City"
        value={form.city}
        onChangeText={(value) => handleChange("city", value)}
        style={tw`mb-4 w-full p-2 border rounded`}
      />
      <TextInput
        placeholder="Postal Code"
        value={form.postalCode}
        onChangeText={(value) => handleChange("postalCode", value)}
        style={tw`mb-4 w-full p-2 border rounded`}
      />
      <TextInput
        placeholder="Country"
        value={form.country}
        onChangeText={(value) => handleChange("country", value)}
        style={tw`mb-4 w-full p-2 border rounded`}
      />
      <Button
        title="Make Payment"
        color="#28a745"
        onPress={handleMakePayment}
      />
    </ScrollView>
  );
};

export default BillingDetailsForm;
