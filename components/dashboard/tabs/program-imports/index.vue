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
import type { ProgramImportExpanded } from '~/types/interfaces';

const data = useProgramImports();

const columns: ColumnDef<ProgramImportExpanded>[] = [
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
    accessorKey: 'program',
    header: 'Program',
    cell: ({ row }) =>
      h(Badge, { class: 'capitalize' }, () => {
        return row.original.program.name;
      }),
  },
  {
    accessorKey: 'details',
    header: 'Title',
    cell: ({ row }) =>
      h('div', { class: 'lowercase capitalize' }, [
        h('span', {}, row.original.details),
      ]),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) =>
      h('div', { class: 'lowercase capitalize' }, [
        h('span', {}, `$${row.original.amount}`),
      ]),
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) =>
      h('div', { class: 'lowercase capitalize' }, [
        h('span', {}, row.original.source),
      ]),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) =>
      h('div', { class: 'lowercase capitalize' }, [
        h('span', {}, row.original.description),
      ]),
  },
  {
    accessorKey: 'loan_officer',
    header: 'Loan Officer',
    cell: ({ row }) =>
      h('div', { class: 'lowercase capitalize' }, [
        h('span', {}, row.original.loan_officer.name),
      ]),
  },
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) =>
      h('div', { class: 'lowercase capitalize' }, [
        h('span', {}, `${row.original.user.name} | ${row.original.user.type}`),
      ]),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const data = row.original;

      return h(
        'div',
        { class: 'relative' },
        h(DropdownAction, {
          data,
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

const types = ref(
  new Set(table.options.data.map(({ source }) => source.toLowerCase()))
);
const columnFilter = ref(new Set([...types.value]));

function filterType(type: string) {
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
          placeholder="Filter titles..."
          :model-value="table.getColumn('details')?.getFilterValue() as string"
          @update:model-value="
            table.getColumn('details')?.setFilterValue($event)
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
              :checked="columnFilter.has(type.toLocaleLowerCase())"
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
              v-for="column in 2"
              :key="column"
              class="capitalize">
              {{ column }}
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
                          columnFilter.has(user.row.original.source)
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
                    <CardTitle class="text-lg"> Program Import </CardTitle>
                    <CardDescription> Program Import details </CardDescription>
                    <CardContent class="mt-8 flex flex-col gap-6 px-0">
                      <Label class="flex gap-5">
                        ID:
                        <span class="font-normal">
                          {{ row.original.id }}
                        </span>
                      </Label>
                      <Label class="flex gap-5">
                        Title:
                        <span class="font-normal">
                          {{ row.original.details }}
                        </span>
                      </Label>
                      <Label class="flex gap-5">
                        Description:
                        <span class="font-normal">
                          {{ row.original.description }}
                        </span>
                      </Label>
                      <Label class="flex gap-5">
                        Created Date:
                        <span class="font-normal">
                          {{ row.original.created_at }}
                        </span>
                      </Label>

                      <Separator class="my-4" label="User Details" />

                      <Label class="flex gap-5">
                        ID:
                        <span class="font-normal capitalize">
                          {{ row.original.user.id }}
                        </span>
                      </Label>
                      <Label class="flex gap-5">
                        Email:
                        <span class="font-normal capitalize">
                          {{ row.original.user.email }}
                        </span>
                      </Label>
                      <Label class="flex gap-5">
                        Name:
                        <span class="font-normal capitalize">
                          {{ row.original.user.name }}
                        </span>
                      </Label>
                      <Label class="flex gap-5">
                        Type:
                        <span class="font-normal capitalize">
                          {{ row.original.user.type }}
                        </span>
                      </Label>

                      <Separator class="my-4" label="Loan Officer Details" />

                      <Label class="flex gap-5">
                        ID:
                        <span class="font-normal capitalize">
                          {{ row.original.loan_officer.id }}
                        </span>
                      </Label>
                      <Label class="flex gap-5">
                        Email:
                        <span class="font-normal capitalize">
                          {{ row.original.loan_officer.email }}
                        </span>
                      </Label>
                      <Label class="flex gap-5">
                        Name:
                        <span class="font-normal capitalize">
                          {{ row.original.loan_officer.name }}
                        </span>
                      </Label>
                      <Label class="flex gap-5">
                        Position:
                        <span class="font-normal capitalize">
                          {{ row.original.loan_officer.position }}
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
