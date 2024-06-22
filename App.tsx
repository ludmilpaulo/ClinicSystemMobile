// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import * as Font from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import StoreProvider from './src/redux/StoreProvider';
import BannerScreen from './src/screens/BannerScreen';
import DrugPage from './src/screens/DrugPage';
import CartPage from './src/screens/CartPage';
import CheckoutPage from './src/screens/CheckoutPage';
import UserProfile from './src/screens/UserProfile';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import ForgotPasswordForm from './src/screens/ForgotPasswordForm';
import LoginForm from './src/screens/LoginForm';
import SignupForm from './src/screens/SignupForm';
import BillingDetailsForm from './src/screens/BillingDetailsForm';
import { RootStackParamList } from './src/utils/types';
import 'react-native-gesture-handler';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        ...FontAwesome.font,
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <StoreProvider>
      <NavigationContainer>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BannerScreen" component={BannerScreen} />
            <Stack.Screen name="Home" component={MainTabNavigator} />
            <Stack.Screen name="DrugPage" component={DrugPage} />
            <Stack.Screen name="CartPage" component={CartPage} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="CheckoutPage" component={CheckoutPage} />
            <Stack.Screen name="Login" component={LoginForm} />
            <Stack.Screen name="Signup" component={SignupForm} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordForm} />
            <Stack.Screen name="BillingDetailsForm" component={BillingDetailsForm} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </StoreProvider>
  );
};

export default App;
