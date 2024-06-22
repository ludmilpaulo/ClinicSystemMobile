// src/components/Sidebar.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import tw from 'twrnc';

const Sidebar = ({ navigation }: DrawerContentComponentProps) => (
  <View style={tw`flex-1 bg-blue-500 shadow-md`}>
    <Text style={tw`p-4 text-2xl font-bold text-white`}>Profile Menu</Text>
    <View style={tw`mt-4`}>
      <TouchableOpacity onPress={() => navigation.navigate('ProfileInformation')}>
        <Text style={tw`block p-4 w-full text-left text-white`}>Profile Information</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
        <Text style={tw`block p-4 w-full text-left text-white`}>Order History</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default Sidebar;
