import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";

const Sidebar = ({ setActiveComponent }: { setActiveComponent: (component: string) => void }) => (
  <View style={tw`w-64 bg-blue-500 shadow-md min-h-screen`}>
    <Text style={tw`p-4 text-2xl font-bold text-white`}>Profile Menu</Text>
    <View style={tw`mt-4`}>
      <TouchableOpacity style={tw`hover:bg-gray-700`} onPress={() => setActiveComponent("ProfileInformation")}>
        <Text style={tw`block p-4 w-full text-left text-white`}>Profile Information</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tw`hover:bg-gray-700`} onPress={() => setActiveComponent("OrderHistory")}>
        <Text style={tw`block p-4 w-full text-left text-white`}>Order History</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default Sidebar;
