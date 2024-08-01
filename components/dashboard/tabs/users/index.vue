<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table';

import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next';

import DropdownAction from './data-table-column.vue';
import { Button } from '@/components/ui/button';
import { valueUpdater } from '@/lib/utils';
import { Checkbox } from '~/components/ui/checkbox';
import { Badge } from '~/components/ui/badge';
import type { User, UserType } from '~/types/interfaces';

const data: User[] = useUsers();

const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:checked': (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => h(Badge, { class: 'capitalize' }, row.getValue('type')),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })]
      );
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
  },
  {
    accessorKey: 'name',
    header: () => h('div', { class: 'text-right' }, 'Name'),
    cell: ({ row }) =>
      h('div', { class: 'lowercase text-right' }, row.getValue('name')),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return h(
        'div',
        { class: 'relative' },
        h(DropdownAction, {
          user,
          onExpand: row.toggleExpanded,
        })
      );
    },
  },
];

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const table = useVueTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get expanded() {
      return expanded.value;
    },
  },
});

const types = ref(new Set(table.options.data.map(({ type }) => type)));
const columnFilter = ref(new Set([...types.value]));

function filterType(type: UserType) {
  if (columnFilter.value.has(type)) {
    columnFilter.value.delete(type);
    return;
  }

  columnFilter.value.add(type);
}
</script>

<template>
  <div class="w-full">
    <div
      class="flex flex-col md:flex-row gap-2 justify-between items-center py-4">
      <div class="flex gap-2 w-full">
        <Input
          class="md:max-w-[200px] w-full"
          placeholder="Filter emails..."
          :model-value="table.getColumn('email')?.getFilterValue() as string"
          @update:model-value="
            table.getColumn('email')?.setFilterValue($event)
          " />
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" class="hidden md:inline-flex">
              Type Filter <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              v-for="type in types"
              :key="type"
              class="capitalize"
              :checked="columnFilter.has(type)"
              @click="filterType(type)">
              {{ type }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div class="w-full flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" class="flex-1 md:hidden">
              Type Filter <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              v-for="type in types"
              :key="type"
              class="capitalize"
              :checked="columnFilter.has(type)"
              @click="filterType(type)">
              {{ type }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" class="flex-1 md:flex-none md:ml-auto">
              Columns <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              v-for="column in table
                .getAllColumns()
                .filter((column) => column.getCanHide())"
              :key="column.id"
              class="capitalize"
              :checked="column.getIsVisible()"
              @update:checked="
                (value) => {
                  column.toggleVisibility(!!value);
                }
              ">
              {{ column.id }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell
                  v-for="cell in columnFilter.size > 0
                    ? row
                        .getVisibleCells()
                        .filter((user) =>
                          columnFilter.has(user.row.original.type)
                        )
                    : []"
                  :key="cell.id">
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  <Card class="p-4 border-none shadow-none">
                    <CardTitle class="text-lg"> Details </CardTitle>
                    <CardDescription> User details </CardDescription>
                    <CardContent class="mt-8 flex flex-col gap-6 px-0">
                      <Label class="flex gap-5">
                        ID:
                        <span class="font-normal">
                          {{ row.original.id }}
                        </span>
                      </Label>
                      <Label class="flex gap-5">
                        Name:
                        <span class="font-normal">
                          {{ row.original.name }}
                        </span>
                      </Label>
                      <Label class="flex gap-5">
                        Email:
                        <span class="font-normal">
                          {{ row.original.email }}
                        </span>
                      </Label>
                      <Label class="flex gap-5">
                        Type:
                        <span class="font-normal capitalize">
                          {{ row.original.type }}
                        </span>
                      </Label>
                      <Label class="flex gap-5">
                        Created Date:
                        <span class="font-normal">
                          {{ row.original.created_at }}
                        </span>
                      </Label>
                    </CardContent>
                  </Card>
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div>
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()">
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()">
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
