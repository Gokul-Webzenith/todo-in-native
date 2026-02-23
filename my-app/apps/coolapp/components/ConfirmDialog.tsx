import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';

type Props = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
    >
      <View className="flex-1 bg-black/50 justify-center items-center">

        <View className="bg-white w-4/5 rounded-xl p-5">

          {/* Title */}
          <Text className="text-lg font-bold mb-2">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-gray-600 mb-5">
            {message}
          </Text>

          {/* Buttons */}
          <View className="flex-row justify-end space-x-4">

            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-500 mr-4">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm}>
              <Text className="text-blue-600 font-semibold">
                Confirm
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </View>
    </Modal>
  );
}