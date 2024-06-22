import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { baseAPI } from "../utils/variables";
import { RootState } from "../redux/store";
import { selectUser, logoutUser } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/basketSlice";

import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import tw from "twrnc";

const ProfileInformation = React.lazy(() => import("../components/ProfileInformation"));
const OrderHistory = React.lazy(() => import("../components/OrderHistory"));

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
  const router = useRouter();
  const token = auth?.token;
  const userId = auth?.user_id;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeComponent, setActiveComponent] = useState<string>("ProfileInformation");

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
              console.error("Failed to fetch user orders:", error);
              setError("Failed to fetch user orders.");
              setLoading(false);
            });
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            console.error("User not found:", error);
            dispatch(logoutUser());
            dispatch(clearCart());
            router.push("/Login");
          } else {
            console.error("Failed to fetch user data:", error);
            setError("Failed to fetch user data.");
            setLoading(false);
          }
        });
    }
  }, [token, userId, dispatch, router]);

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
        .catch((error) => console.error("Failed to update user data:", error));
    }
  };

  if (loading) {
    return <Loading loading={loading} />;
  }

  if (error) {
    return <View><Text>{error}</Text></View>;
  }

  if (!user) {
    return <View><Text>No user data available</Text></View>;
  }

  return (
    <View style={tw`flex`}>
      <Sidebar setActiveComponent={setActiveComponent} />
      <View style={tw`flex-1 p-4 min-h-screen`}>
        <React.Suspense fallback={<Loading loading={true} />}>
          {activeComponent === "ProfileInformation" && (
            <ProfileInformation user={user} handleUpdateProfile={handleUpdateProfile} />
          )}
          {activeComponent === "OrderHistory" && <OrderHistory orders={user.orders} />}
        </React.Suspense>
      </View>
    </View>
  );
};

export default UserProfile;
