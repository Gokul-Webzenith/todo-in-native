import React from 'react';

import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

import { authClient } from '../../lib/auth-client';

import {
  useQuery,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query';

import { zodResolver } from '@hookform/resolvers/zod';

import { useForm, Controller } from 'react-hook-form';

import { useUIStore, useTimeStore } from '@repo/store';

import {
  todoFormSchema,
  type TodoForm,
} from '@repo/schemas';

import { todoApi } from '../../lib/api-client';

import { ConfirmDialog } from '../../components/ConfirmDialog';

type Todo = {
  id: number;
  text: string;
  description: string;

  status:
    | 'todo'
    | 'backlog'
    | 'inprogress'
    | 'done'
    | 'cancelled';

  startAt: string;
  endAt: string;
};
const STATUS_LIST = [
  { key: "todo", label: "Todo" },
  { key: "backlog", label: "Backlog" },
  { key: "inprogress", label: "In Progress" },
  { key: "done", label: "Done" },
  { key: "cancelled", label: "Cancelled" },
] as const;

export default function WorkScreen() {
  const router = useRouter();

  /* ------------------ Store ------------------ */

  const {
    openConfirm,
    closeConfirm,
    confirm,
    editTodo,
    sheetOpen,
    openSheet,
    closeSheet,
    setEditTodo,
    clearEditTodo,
  } = useUIStore();

  const {
    showStartDate,
    showStartTime,
    showEndDate,
    showEndTime,

    openStartDate,
    closeStartDate,

    openStartTime,
    closeStartTime,

    openEndDate,
    closeEndDate,

    openEndTime,
    closeEndTime,
  } = useTimeStore();

const {
  data,
  isLoading,
  error,
} = todoApi.useQuery("get", "/api");

const items = (data ?? []) as Todo[];

const queryClient = useQueryClient();


const addMutation = todoApi.useMutation("post", "/api", {
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["get", "/api"],
    });
  },
});

const updateMutation = todoApi.useMutation("put", "/api/{id}", {
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["get", "/api"],
    });
  },
});



const deleteMutation = todoApi.useMutation("delete", "/api/{id}", {
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["get", "/api"],
    });
  },
});
  const { control, handleSubmit, reset } = useForm<TodoForm>({
    resolver: zodResolver(todoFormSchema),

    defaultValues: {
      text: '',
      description: '',
      status: 'todo',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    },
  });

 async function logout() {
  try {
   
    await authClient.signOut();

    await queryClient.clear();
    router.replace("/");
  } catch (err) {
    console.error("Logout failed:", err);
  }
}

  const openAdd = () => {
    clearEditTodo();
    reset();
    openSheet();
  };
  const getRemainingClass = (
  endAt: string,
  status: string
) => {
  if (status !== "inprogress") return "bg-white";

  const now = Date.now();
  const end = new Date(endAt).getTime();

  const hoursLeft =
    (end - now) / (1000 * 60 * 60);

  if (hoursLeft <= 0) return "bg-red-500 text-white";
  if (hoursLeft < 2) return "bg-red-200";
  if (hoursLeft < 6) return "bg-yellow-200";

  return "bg-white";
};

  const openEdit = (item: Todo) => {
    setEditTodo(item);

    reset({
      text: item.text,
      description: item.description,
      status: item.status,

      startDate: item.startAt.split('T')[0],
      startTime: item.startAt.split('T')[1].slice(0, 5),

      endDate: item.endAt.split('T')[0],
      endTime: item.endAt.split('T')[1].slice(0, 5),
    });

    openSheet();
  };

  const onSubmit = (data: TodoForm) => {
    openConfirm(editTodo ? 'edit' : 'add', data);
  };


const processSubmit = (data: TodoForm) => {
  if (editTodo) {
    updateMutation.mutate({
      params: {
        path: { id: String(editTodo.id) },
      },
      body: data, 
    });
  } else {
    addMutation.mutate({
      body: data,
    });
  }

  reset();
  closeSheet();
};
  const handleConfirm = () => {
    const { action, payload } = confirm;

    if (action === 'add' || action === 'edit') {
      processSubmit(payload);
    }

    if (action === 'delete') {
     deleteMutation.mutate({
  params: {
    path: { id: String(payload) },
  },
});
    }

    closeConfirm();
  };


  const formatDateTime = (iso: string) => {
  const d = new Date(iso);

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

  return (

    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 p-4">

        <TouchableOpacity
          className="bg-black px-5 py-3 rounded-lg mb-4"
          onPress={logout}
        >
          <Text className="text-white text-center">Logout</Text>
        </TouchableOpacity>

        {/* Add */}
        <TouchableOpacity
          onPress={openAdd}
          className="bg-black py-3 rounded-lg items-center mb-4"
        >
          <Text className="text-white font-semibold">Add Todo</Text>
        </TouchableOpacity>


<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  className="flex-1"
>

  {STATUS_LIST.map((status) => {
    const filtered = items.filter(
      (item) => item.status === status.key
    );

    return (
      <View
        key={status.key}
        className="w-72 mr-4 bg-gray-200 rounded-xl p-3"
      >
        <Text className="font-bold text-base mb-3 text-center">
          {status.label} ({filtered.length})
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <Text className="text-gray-500 text-center mt-10">
              No tasks
            </Text>
          ) : (
            filtered.map((item) => (
              <View
              key={String(item.id)}
              className={`${getRemainingClass(
                item.endAt,
                item.status
  )} p-3 rounded-lg mb-3 shadow`}
>
                <Text className="font-semibold">
                  {item.text}
                </Text>

               {/* Description */}
              <Text className="text-gray-700 text-sm mt-1">
                {item.description}
              </Text>

              {/* Dates */}
              <View className="mt-2 space-y-1">

                <Text className="text-xs text-gray-500">
                  📅 Start: {formatDateTime(item.startAt)}
                </Text>

                <Text className="text-xs text-gray-500">
                  ⏰ End: {formatDateTime(item.endAt)}
                </Text>

</View>
                <View className="flex-row gap-2 mt-3">

                  <TouchableOpacity
                    onPress={() => openEdit(item)}
                    className="bg-blue-500 px-3 py-1 rounded-md"
                  >
                    <Text className="text-white text-xs">
                      Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      openConfirm("delete", item.id)
                    }
                    className="bg-red-500 px-3 py-1 rounded-md"
                  >
                    <Text className="text-white text-xs">
                      Delete
                    </Text>
                  </TouchableOpacity>

                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    );
  })}

</ScrollView>
      </View>


      <Modal visible={sheetOpen} animationType="slide">

        <SafeAreaView className="flex-1 bg-white">

          <ScrollView className="p-5">

            <Text className="text-xl font-bold mb-6">
              {editTodo ? 'Edit Todo' : 'Add Todo'}
            </Text>

            {/* Title */}
            <Controller
              control={control}
              name="text"
              render={({ field }) => (
                <TextInput
                  placeholder="Title"
                  value={field.value}
                  onChangeText={field.onChange}
                  className="border rounded-xl p-4 mb-4"
                />
              )}
            />

            {/* Description */}
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextInput
                  placeholder="Description"
                  value={field.value}
                  onChangeText={field.onChange}
                  multiline
                  className="border rounded-xl p-4 mb-4 h-24"
                />
              )}
            />

            {/* Status */}
            <Text className="mb-2 font-medium">Status</Text>

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <View className="border rounded-xl mb-4">

                  <Picker
                    selectedValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <Picker.Item label="Todo" value="todo" />
                    <Picker.Item label="Backlog" value="backlog" />
                    <Picker.Item label="In Progress" value="inprogress" />
                    <Picker.Item label="Done" value="done" />
                    <Picker.Item label="Cancelled" value="cancelled" />
                  </Picker>

                </View>
              )}
            />

            {/* Start Date */}
            <Text className="mb-2 font-medium">Start Date</Text>

            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <>
                  <TouchableOpacity
                    className="border rounded-xl p-4 mb-3"
                    onPress={openStartDate}
                  >
                    <Text>{field.value || 'Select Start Date'}</Text>
                  </TouchableOpacity>

                  {showStartDate && (
                    <DateTimePicker
                     minimumDate={new Date()} 
                      mode="date"
                      value={
                        field.value
                          ? new Date(field.value)
                          : new Date()
                      }
                      onChange={(e, date) => {
                        closeStartDate();

                        if (date) {
                          field.onChange(
                            date.toISOString().split('T')[0]
                          );
                        }
                      }}
                    />
                  )}
                </>
              )}
            />

            {/* Start Time */}
            <Text className="mb-2 font-medium">Start Time</Text>

            <Controller
              control={control}
              name="startTime"
              render={({ field }) => (
                <>
                  <TouchableOpacity
                    className="border rounded-xl p-4 mb-3"
                    onPress={openStartTime}
                  >
                    <Text>{field.value || 'Select Start Time'}</Text>
                  </TouchableOpacity>

                  {showStartTime && (
                    <DateTimePicker
                      mode="time"
                      is24Hour
                      value={
                        field.value
                          ? new Date(`1970-01-01T${field.value}:00`)
                          : new Date()
                      }
                      onChange={(e, date) => {
                        closeStartTime();

                        if (date) {
                          field.onChange(
                            date.toTimeString().slice(0, 5)
                          );
                        }
                      }}
                    />
                  )}
                </>
              )}
            />

            {/* End Date */}
            <Text className="mb-2 font-medium">End Date</Text>

            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <>
                  <TouchableOpacity
                    className="border rounded-xl p-4 mb-3"
                    onPress={openEndDate}
                  >
                    <Text>{field.value || 'Select End Date'}</Text>
                  </TouchableOpacity>

                  {showEndDate && (
                    <DateTimePicker
                      mode="date"
                       minimumDate={new Date()} 
                      value={
                        field.value
                          ? new Date(field.value)
                          : new Date()
                      }
                      onChange={(e, date) => {
                        closeEndDate();

                        if (date) {
                          field.onChange(
                            date.toISOString().split('T')[0]
                          );
                        }
                      }}
                    />
                  )}
                </>
              )}
            />

            
            <Text className="mb-2 font-medium">End Time</Text>

            <Controller
              control={control}
              name="endTime"
              render={({ field }) => (
                <>
                  <TouchableOpacity
                    className="border rounded-xl p-4 mb-3"
                    onPress={openEndTime}
                  >
                    <Text>{field.value || 'Select End Time'}</Text>
                  </TouchableOpacity>

                  {showEndTime && (
                    <DateTimePicker
                      mode="time"
                      is24Hour
                      value={
                        field.value
                          ? new Date(`1970-01-01T${field.value}:00`)
                          : new Date()
                      }
                      onChange={(e, date) => {
                        closeEndTime();

                        if (date) {
                          field.onChange(
                            date.toTimeString().slice(0, 5)
                          );
                        }
                      }}
                    />
                  )}
                </>
              )}
            />

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="bg-black py-4 rounded-xl items-center mt-6"
            >
              <Text className="text-white font-semibold">
                {editTodo ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeSheet}
              className="mt-4 items-center"
            >
              <Text className="text-gray-500">Cancel</Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Confirm */}
      <ConfirmDialog
        open={confirm.open}
        title="Confirm Action"
        message="Are you sure?"
        onClose={closeConfirm}
        onConfirm={handleConfirm}
      />

    </SafeAreaView>
  );
}