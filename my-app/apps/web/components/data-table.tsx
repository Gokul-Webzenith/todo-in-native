"use client"

import * as React from "react"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { z } from "zod"
import { useTableStore } from "@repo/store"


import {
  CircleCheckIcon,
  LoaderIcon,
  EllipsisVerticalIcon,
} from "lucide-react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"


/* ================= Meta Type ================= */

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className?: string
  }
}
  

/* ================= Schema ================= */

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
})


const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),
    meta: { className: "w-[40px] text-center" },
  },

  {
    accessorKey: "header",
    header: "Task",
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {row.original.header}
      </span>
    ),
    meta: { className: "w-[220px]" },
  },

  {
    accessorKey: "type",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.type}</Badge>
    ),
    meta: { className: "w-[120px] text-center" },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="gap-1">
          {row.original.status === "done" ? (
            <CircleCheckIcon className="size-4 text-green-500" />
          ) : (
            <LoaderIcon className="size-4" />
          )}
          {row.original.status}
        </Badge>
      </div>
    ),
    meta: { className: "w-[140px] text-center" },
  },

  {
    accessorKey: "target",
    header: "Start",
    cell: ({ row }) => (
      <div className="flex justify-center w-full">
        <Input
          defaultValue={row.original.target}
          className="h-8 w-[110px] text-center"
        />
      </div>
    ),
    meta: { className: "w-[140px] text-center" },
  },

  {
    accessorKey: "limit",
    header: "End",
    cell: ({ row }) => (
      <div className="flex justify-center w-full">
        <Input
          defaultValue={row.original.limit}
          className="h-8 w-[110px] text-center"
        />
      </div>
    ),
    meta: { className: "w-[140px] text-center" },
  },

  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    meta: { className: "w-[60px] text-center" },
  },
]




export function DataTable({ data: initialData }: any) {

  const { data, setData } = useTableStore()

  React.useEffect(() => {
    setData(initialData)
  }, [initialData, setData])


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })


  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-lg border overflow-hidden">

        <Table className="table-fixed w-full">

      
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    colSpan={h.colSpan}
                    className={h.column.columnDef.meta?.className}
                  >
                    {flexRender(
                      h.column.columnDef.header,
                      h.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

=
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cell.column.columnDef.meta?.className}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

        </Table>

      </div>
    </div>
  )
}

