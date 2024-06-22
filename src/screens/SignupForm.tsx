import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react-native";
import tw from "twrnc";
import { signup } from "../services/authService";
import { loginUser } from "../redux/slices/authSlice";
import { RootStackParamList } from "../utils/types"; // Ensure this path is correct

const SignupForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = await signup(username, email, password);
      if (data.error) {
        setError(data.error);
        setLoading(false);
        Alert.alert("Error", data.error);
      } else {
        dispatch(loginUser(data));
        Alert.alert("Success", "Signup successful.");
        navigation.navigate("Home");
      }
    } catch (err) {
      setError("Failed to sign up. Please try again.");
      Alert.alert("Error", "Failed to sign up. Please try again.");
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 items-center justify-center bg-gradient-to-br from-green-400 to-blue-600`}>
      {loading && (
        <View style={tw`fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50`}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <View style={tw`bg-white p-10 rounded-3xl shadow-lg w-full max-w-md`}>
        <Text style={tw`text-4xl font-bold mb-6 text-center text-gray-800`}>Create Account</Text>
        {error && <Text style={tw`text-red-500 text-center mb-4`}>{error}</Text>}
        <View style={tw`mb-4`}>
          <Text style={tw`block text-sm font-semibold mb-2 text-gray-700`}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={tw`w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your username"
          />
        </View>
        <View style={tw`mb-4`}>
          <Text style={tw`block text-sm font-semibold mb-2 text-gray-700`}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={tw`w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </View>
        <View style={tw`mb-4 relative`}>
          <Text style={tw`block text-sm font-semibold mb-2 text-gray-700`}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={tw`w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={tw`absolute inset-y-0 right-0 flex items-center justify-center h-full px-3 text-gray-500`}>
            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
          </TouchableOpacity>
        </View>
        <Button title="Sign Up" onPress={handleSubmit} color="#1E90FF" />
        <View style={tw`mt-6 text-center`}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={tw`text-blue-500 hover:underline`}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignupForm;
