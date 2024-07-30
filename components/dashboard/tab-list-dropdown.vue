<script setup lang="ts">
import { ref } from 'vue';
import { Check, ChevronsUpDown } from 'lucide-vue-next';

import { cn } from '@/lib/utils';

type Emits = {
  updateSeletedTab: [value: string];
};

const emits = defineEmits<Emits>();

type TabItem = {
  label: string;
  value: string;
};

type Props = {
  tabItems: TabItem[];
};

const props = defineProps<Props>();
const tabItems = toRef(() => props.tabItems);

const open = ref(false);
const value = ref('');
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child class="md:hidden">
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-[200px] justify-between capitalize">
        {{
          value
            ? tabItems.find((tab) => tab.value === value)?.label
            : 'Select tab...'
        }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command>
        <CommandEmpty>No tab found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="tab in tabItems"
              :key="tab.value"
              :value="tab.value"
              class="capitalize"
              @select="
                (ev) => {
                  if (typeof ev.detail.value === 'string') {
                    value = ev.detail.value;
                  }
                  emits('updateSeletedTab', tab.value);

                  open = false;
                }
              ">
              {{ tab.label }}
              <Check
                :class="
                  cn(
                    'ml-auto h-4 w-4',
                    value === tab.value ? 'opacity-100' : 'opacity-0'
                  )
                " />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
