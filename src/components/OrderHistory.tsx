import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Order } from "../utils/types";
import tw from "twrnc";

const OrderHistory = ({ orders }: { orders: Order[] }) => (
  <View style={tw`bg-white p-6 rounded-lg shadow-md`}>
    <Text style={tw`text-2xl font-semibold mb-4`}>Order History</Text>
    <View style={tw`min-w-full border-collapse`}>
      <View style={tw`flex flex-row`}>
        <Text style={tw`p-2 text-left border-b`}>Order ID</Text>
        <Text style={tw`p-2 text-left border-b`}>Date</Text>
        <Text style={tw`p-2 text-left border-b`}>Status</Text>
        <Text style={tw`p-2 text-left border-b`}>Invoice</Text>
      </View>
      {orders && orders.length > 0 ? (
        orders.map((order) => (
          <View key={order.id} style={tw`flex flex-row`}>
            <Text style={tw`p-2 border-b`}>{order.id}</Text>
            <Text style={tw`p-2 border-b`}>
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
            <Text style={tw`p-2 border-b`}>{order.status}</Text>
            <Text style={tw`p-2 border-b`}>
              {order.invoice ? (
                <Text
                  style={tw`text-blue-500`}
                  onPress={() => {
                    if (order.invoice) {
                      window.location.href = order.invoice;
                    }
                  }}
                >
                  Download
                </Text>
              ) : (
                <Text style={tw`text-gray-500`}>No Invoice</Text>
              )}
            </Text>
          </View>
        ))
      ) : (
        <View style={tw`p-2 text-center text-gray-500`}>
          <Text>No orders found.</Text>
        </View>
      )}
    </View>
  </View>
);

export default OrderHistory;
