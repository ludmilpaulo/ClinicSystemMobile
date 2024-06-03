// src/components/Navbar.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { Icon, SearchBar } from 'react-native-elements';
import { selectCartItems } from '../redux/slices/basketSlice';
import { selectUser } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import { fetchAboutUsData } from '../services/adminService';
import { AboutUsData } from '../utils/types';
import tailwind from 'tailwind-rn';

const Navbar: React.FC = () => {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => selectUser(state));
  const token = user?.token;

  const [searchQuery, setSearchQuery] = useState('');
  const cartItems = useSelector(selectCartItems);
  const cartItemCount = cartItems.reduce((count, item) => count + (item.quantity ?? 0), 0);

  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAboutUsData();
      console.log("Fetched header data:", data);
      setHeaderData(data?.about || null);
    };
    fetchData();
  }, []);

  return (
    <>
      <View style={tailwind('bg-blue-600 shadow-lg fixed w-full z-10 top-0')}>
        <View style={tailwind('container mx-auto px-4')}>
          <View style={tailwind('flex text-white justify-between items-center py-4')}>
            <View style={tailwind('flex-row items-center')}>
              <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
                <Icon name="menu" size={30} color="white" />
              </TouchableOpacity>
              <View style={tailwind('text-2xl font-bold ml-4')}>
                {headerData?.logo && (
                  <FastImage
                    source={{ uri: headerData.logo }}
                    style={tailwind('w-24 h-24')}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                )}
              </View>
            </View>
            <View style={tailwind('relative')}>
              <SearchBar
                placeholder="Search..."
                onChangeText={(query) => setSearchQuery(query)}
                value={searchQuery}
                lightTheme
                round
                containerStyle={styles.searchContainer}
                inputContainerStyle={styles.searchInputContainer}
                inputStyle={styles.searchInput}
                searchIcon={{ color: 'black' }}
                clearIcon={{ color: 'black' }}
              />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('CartPage')} style={tailwind('relative')}>
              <Icon name="shopping-cart" size={30} color="white" />
              {cartItemCount > 0 && (
                <View style={tailwind('absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1')}>
                  <Text>{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={tailwind('mt-16')} /> {/* Spacer for fixed navbar */}
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchInputContainer: {
    backgroundColor: 'white',
  },
  searchInput: {
    color: 'black',
  },
});

export default Navbar;
