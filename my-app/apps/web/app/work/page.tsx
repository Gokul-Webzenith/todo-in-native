"use client";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { todoApi } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Label } from "@workspace/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";

import { ConfirmDialog } from "@/components/ConfirmDialog";

import { format, formatISO } from "date-fns";
import { authClient } from "../../lib/auth-client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Calendar } from "@workspace/ui/components/calendar";

import { useUIStore } from "@repo/store";
import { todoFormSchema, type TodoForm } from "@repo/schemas";


type Todo = {
  id: number;
  text: string;
  description: string;
  status: "todo" | "backlog" | "inprogress" | "done" | "cancelled";
  startAt: string;
  endAt: string;
}
export default function WorkPage() {
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },

    onSuccess: () => {
      router.push("/");
    },

    onError: () => {
      alert("Logout failed");
    },
  });

  const {
    expandedId,

    openConfirm,
    closeConfirm,
    confirm,
    editTodo,
    sheetOpen,
    openSheet,
    closeSheet,
    setEditTodo,
    clearEditTodo,
    descOpen,
    activeTodo,
    openDesc,
    closeDesc,
  } = useUIStore();


const {
  data: items = [],
  isLoading,
  error,
} = todoApi.useQuery("get", "/api"); 

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
const patchMutation = todoApi.useMutation("patch", "/api/{id}", {
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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TodoForm>({
    resolver: zodResolver(todoFormSchema),

    defaultValues: {
      text: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      status: "todo",
    },
  });

  const onSubmit = (data: TodoForm) => {
    openConfirm(editTodo ? "edit" : "add", data);
  };
const processSubmit = (data: TodoForm) => {
  if (!editTodo) {
    
    addMutation.mutate({
      body: data,
    });
  } else {
   updateMutation.mutate({
  params: {
    path: { id: String(editTodo.id) },
  },
  body: data,
});
  }

  reset();
  closeSheet();
};

  const handleConfirm = () => {
    
    const { action, payload } = confirm;

    if (action === "delete") {
      deleteMutation.mutate({
  params: {
    path: { id: String(payload) },
  },
});
    }

    if (action === "add" || action === "edit") {
      processSubmit(payload);
    }

    closeConfirm();
  };
function stripTime(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}
const today = stripTime(new Date());
  const onDragStart = (
    e: React.DragEvent,
    id: number
  ) => {
    e.dataTransfer.setData("taskId", String(id));
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (
    e: React.DragEvent,
    status: Todo["status"]
  ) => {
    e.preventDefault();

    const id = Number(
      e.dataTransfer.getData("taskId")
    );

   patchMutation.mutate({
  params: {
    path: { id: String(id) }, 
  },
  body: {
    status,
  },
});
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

    return "bg-white-100";
  };

  const byStatus = (s: Todo["status"]) =>
    items.filter((i: Todo) => i.status === s);


  if (isLoading)
    return <div className="p-6">Loading...</div>;

if (error) {
  const err = error as Error;

  return (
    <div className="p-6 text-red-600">
      {err.message || "Something went wrong"}
    </div>
  );
}

  const TaskCard = ({ item }: { item: Todo }) => {
    const isExpanded = expandedId === item.id;

    return (
      <div
        draggable
        onDragStart={(e) =>
          onDragStart(e, item.id)
        }
        onClick={() => openDesc(item)}
        className={`border rounded-xl p-4 mb-3 shadow hover:shadow-md cursor-pointer
        ${getRemainingClass(
          item.endAt,
          item.status
        )}`}
      >
        <p className="font-semibold">{item.text}</p>

        <p className="text-sm text-gray-600 mt-1">
          {isExpanded
            ? item.description
            : item.description.slice(0, 60) + "..."}
        </p>

        <p className="text-xs text-gray-500 mt-2">
          {new Date(item.startAt).toLocaleString()} →{" "}
          {new Date(item.endAt).toLocaleString()}
        </p>

        <div
          className="flex gap-2 mt-3"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="sm"
            className="bg-blue-500 text-white"
            onClick={() => {
              setEditTodo(item);
              openSheet();

              const s = new Date(item.startAt);
              const e = new Date(item.endAt);

              setValue("text", item.text);
              setValue("description", item.description);
              setValue("startDate", format(s, "yyyy-MM-dd"));
              setValue("startTime", format(s, "HH:mm"));
              setValue("endDate", format(e, "yyyy-MM-dd"));
              setValue("endTime", format(e, "HH:mm"));
              setValue("status", item.status);
            }}
          >
            Edit
          </Button>

          <Button
            size="sm"
            className="bg-red-500 text-white"
            onClick={() =>
              openConfirm("delete", item.id)
            }
          >
            Delete
          </Button>
        </div>
      </div>
    );
  };


  return (
    <>
      
      <button
        onClick={() => logoutMutation.mutate()}
        className="bg-black text-white p-3 mt-10 ml-4"
      >
        Logout
      </button>

      {/* Sheet */}
      <div className="flex justify-end">
        <Sheet
          open={sheetOpen}
          onOpenChange={(open) =>
            open ? openSheet() : closeSheet()
          }
        >
          <SheetTrigger asChild>
            <Button
              onClick={() => {
                reset();
                clearEditTodo();
                openSheet();
              }}
            >
              Add Todo
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[420px]">
            <SheetHeader>
              <SheetTitle>
                {editTodo ? "Edit Todo" : "Add Todo"}
              </SheetTitle>
            </SheetHeader>

            
          <form
  onSubmit={handleSubmit(onSubmit)}
  className="space-y-5 mt-6 px-6"
>

  <div className="space-y-1 ">
    <Label>Title</Label>

    <Input
      placeholder="Enter title"
      {...register("text")}
    />

    {errors.text && (
      <p className="text-sm text-red-500">
        {errors.text.message}
      </p>
    )}
  </div>

  {/* DESCRIPTION */}
  <div className="space-y-1">
    <Label>Description</Label>

    <Textarea
      placeholder="Enter description"
      {...register("description")}
    />
  </div>

  {/* STATUS */}
  <div className="space-y-1">
    <Label>Status</Label>

    <Select
      defaultValue="todo"
      onValueChange={(val) =>
        setValue("status", val as any)
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="todo">Todo</SelectItem>
        <SelectItem value="backlog">Backlog</SelectItem>
        <SelectItem value="inprogress">
          In Progress
        </SelectItem>
        <SelectItem value="done">Done</SelectItem>
        <SelectItem value="cancelled">
          Cancelled
        </SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* START DATE */}
  <div className="space-y-1">
    <Label>Start Date</Label>

    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          {watch("startDate")
            ? format(
                new Date(watch("startDate")),
                "PPP"
              )
            : "Pick a date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
      <Calendar
  mode="single"
  selected={
    watch("startDate")
      ? new Date(watch("startDate"))
      : undefined
  }
  onSelect={(date) => {
    if (date) {
      setValue(
        "startDate",
        format(date, "yyyy-MM-dd")
      );

      // Clear end date if invalid
      const end = watch("endDate");
      if (end && stripTime(new Date(end)) < stripTime(date)) {
        setValue("endDate", "");
      }
    }
  }}
  disabled={(date) =>
    stripTime(date) < today
  }
  initialFocus
/>
      </PopoverContent>
    </Popover>
  </div>

  {/* START TIME */}
  <div className="space-y-1">
    <Label>Start Time</Label>

    <Input
      type="time"
      {...register("startTime")}
    />
  </div>

  {/* END DATE */}
  <div className="space-y-1">
    <Label>End Date</Label>

    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          {watch("endDate")
            ? format(
                new Date(watch("endDate")),
                "PPP"
              )
            : "Pick a date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        



        <Calendar
  mode="single"
  selected={
    watch("endDate")
      ? new Date(watch("endDate"))
      : undefined
  }
  onSelect={(date) => {
    if (date) {
      setValue(
        "endDate",
        format(date, "yyyy-MM-dd")
      );
    }
  }}
  disabled={(date) => {
    const start = watch("startDate");

    const d = stripTime(date);

    // ❌ Past days
    if (d < today) return true;

    // ❌ Before start date
    if (
      start &&
      d < stripTime(new Date(start))
    )
      return true;

    return false; // ✅ allow today & future
  }}
  initialFocus
/>
      </PopoverContent>
    </Popover>
  </div>

  {/* END TIME */}
  <div className="space-y-1">
    <Label>End Time</Label>

    <Input
      type="time"
      {...register("endTime")}
    />
  </div>

  {/* SUBMIT */}
  <Button type="submit" className="w-full">
    {editTodo ? "Update" : "Add Todo"}
  </Button>
</form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6 bg-gray-50 p-4 rounded-xl">
        {(
          [
            "todo",
            "backlog",
            "inprogress",
            "done",
            "cancelled",
          ] as Todo["status"][]
        ).map((s) => (
          <div
            key={s}
            className="bg-white rounded-xl p-4 shadow"
            onDragOver={allowDrop}
            onDrop={(e) => onDrop(e, s)}
          >
            <h3 className="font-semibold mb-3 capitalize">
              {s}
            </h3>

            {byStatus(s).map((item: Todo) => (
              <TaskCard key={item.id} item={item} />
            ))}
          </div>
        ))}
      </div>

      {/* Confirm */}
      <ConfirmDialog
        open={confirm.open}
        title="Confirm Action"
        message="Are you sure?"
        onClose={closeConfirm}
        onConfirm={handleConfirm}
      />

      {/* Description */}
      <Dialog open={descOpen} onOpenChange={closeDesc}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activeTodo?.text}
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">
            {activeTodo?.description}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}