import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import tw from "twrnc";

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

const ProfileInformation = ({
  user,
  handleUpdateProfile,
}: {
  user: UserProfile;
  handleUpdateProfile: (user: UserProfile) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserProfile>(user);

  const handleChange = (field: keyof UserProfile, value: string) => {
    const updatedUser = { ...editedUser, [field]: value };
    setEditedUser(updatedUser);
    handleUpdateProfile(updatedUser);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditedUser(user);
    }
  };

  return (
    <View style={tw`bg-white p-6 rounded-lg shadow-md ml-64`}>
      <Text style={tw`text-2xl font-semibold mb-4`}>Profile Information</Text>
      <View style={tw`grid grid-cols-1 md:grid-cols-2 gap-4 mb-6`}>
        <View>
          <Text style={tw`block text-gray-700`}>First Name</Text>
          <TextInput
            value={editedUser.first_name}
            style={tw`w-full p-2 border border-gray-300 rounded mt-1`}
            onChangeText={(text) => handleChange("first_name", text)}
            editable={isEditing}
          />
        </View>
        <View>
          <Text style={tw`block text-gray-700`}>Last Name</Text>
          <TextInput
            value={editedUser.last_name}
            style={tw`w-full p-2 border border-gray-300 rounded mt-1`}
            onChangeText={(text) => handleChange("last_name", text)}
            editable={isEditing}
          />
        </View>
        <View>
          <Text style={tw`block text-gray-700`}>Email</Text>
          <TextInput
            value={editedUser.email}
            style={tw`w-full p-2 border border-gray-300 rounded mt-1`}
            editable={false}
          />
        </View>
        <View>
          <Text style={tw`block text-gray-700`}>Address</Text>
          <TextInput
            value={editedUser.address}
            style={tw`w-full p-2 border border-gray-300 rounded mt-1`}
            onChangeText={(text) => handleChange("address", text)}
            editable={isEditing}
          />
        </View>
        <View>
          <Text style={tw`block text-gray-700`}>City</Text>
          <TextInput
            value={editedUser.city}
            style={tw`w-full p-2 border border-gray-300 rounded mt-1`}
            onChangeText={(text) => handleChange("city", text)}
            editable={isEditing}
          />
        </View>
        <View>
          <Text style={tw`block text-gray-700`}>Postal Code</Text>
          <TextInput
            value={editedUser.postal_code}
            style={tw`w-full p-2 border border-gray-300 rounded mt-1`}
            onChangeText={(text) => handleChange("postal_code", text)}
            editable={isEditing}
          />
        </View>
        <View>
          <Text style={tw`block text-gray-700`}>Country</Text>
          <TextInput
            value={editedUser.country}
            style={tw`w-full p-2 border border-gray-300 rounded mt-1`}
            onChangeText={(text) => handleChange("country", text)}
            editable={isEditing}
          />
        </View>
      </View>
      <View style={tw`flex justify-end`}>
        <Button title={isEditing ? "Save Changes" : "Edit Profile"} onPress={handleEditToggle} color="blue" />
      </View>
    </View>
  );
};

export default ProfileInformation;
