// src/screens/UserProfile.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import DrawerLayout from 'react-native-drawer-layout';
import { baseAPI } from '../utils/variables';
import { RootState } from '../redux/store';
import { selectUser, logoutUser } from '../redux/slices/authSlice';
import { clearCart } from '../redux/slices/basketSlice';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import tw from 'twrnc';
import { RootStackParamList } from '../utils/types';

const ProfileInformation = React.lazy(() => import('../components/ProfileInformation'));
const OrderHistory = React.lazy(() => import('../components/OrderHistory'));

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  orders: any[];
}

const UserProfile = () => {
  const auth = useSelector((state: RootState) => selectUser(state));
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = auth?.token;
  const userId = auth?.user_id;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const drawer = useRef<DrawerLayout>(null);

  useEffect(() => {
    if (token && userId) {
      axios
        .get(`${baseAPI}/account/account/profile/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userData = response.data;
          axios
            .get(`${baseAPI}/account/orders/user/${userId}/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((orderResponse) => {
              setUser({ ...userData, orders: orderResponse.data });
              setLoading(false);
            })
            .catch((error) => {
              console.error('Failed to fetch user orders:', error);
              setError('Failed to fetch user orders.');
              setLoading(false);
            });
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            console.error('User not found:', error);
            dispatch(logoutUser());
            dispatch(clearCart());
            navigation.navigate('Home');
          } else {
            console.error('Failed to fetch user data:', error);
            setError('Failed to fetch user data.');
            setLoading(false);
          }
        });
    }
  }, [token, userId, dispatch, navigation]);

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    if (updatedUser && token) {
      axios
        .put(`${baseAPI}/account/account/update/${userId}/`, updatedUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => console.error('Failed to update user data:', error));
    }
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View>
        <Text>No user data available</Text>
      </View>
    );
  }

  return (
    <DrawerLayout
      ref={drawer}
      drawerWidth={300}
      drawerPosition={DrawerLayout.positions.Left}
      renderNavigationView={(props) => <Sidebar {...props} />}
    >
      <View style={tw`flex-1 p-4`}>
        <TouchableOpacity onPress={() => drawer.current?.openDrawer()} style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Menu</Text>
        </TouchableOpacity>
        <React.Suspense fallback={<Loading loading={true} />}>
          <ProfileInformation user={user} handleUpdateProfile={handleUpdateProfile} />
          <OrderHistory orders={user.orders} />
        </React.Suspense>
      </View>
    </DrawerLayout>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    marginBottom: 20,
  },
  menuButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserProfile;
