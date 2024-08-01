<script setup lang="ts">
import { Calendar as CalendarIcon } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const currentMonth = useCalendarMonthState();
const date = ref(new Date());

const formattedMonth = computed(() => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date.value);
});

const updateMonth = () => {
  currentMonth.month.value = formattedMonth.value;
};

const prevMonth = () => {
  date.value = new Date(date.value.setMonth(date.value.getMonth() - 1));
  updateMonth();
};

const nextMonth = () => {
  date.value = new Date(date.value.setMonth(date.value.getMonth() + 1));
  updateMonth();
};

onMounted(updateMonth);
</script>

<template>
  <div :class="cn('grid gap-2', $attrs.class ?? '')">
    <Popover>
      <PopoverTrigger as-child>
        <Button
          id="date"
          :variant="'outline'"
          :class="
            cn(
              'w-[200px] justify-center text-left font-normal',
              !currentMonth && 'text-muted-foreground'
            )
          ">
          <CalendarIcon class="mr-2 h-4 w-4" />
          <template v-if="currentMonth.month">
            {{ currentMonth.month }}
          </template>
          <template v-else> Pick a month </template>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="" align="center">
        <div class="flex items-center justify-between">
          <Button @click="prevMonth" variant="outline" size="icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.81809 4.18179C8.99383 4.35753 8.99383 4.64245 8.81809 4.81819L6.13629 7.49999L8.81809 10.1818C8.99383 10.3575 8.99383 10.6424 8.81809 10.8182C8.64236 10.9939 8.35743 10.9939 8.1817 10.8182L5.1817 7.81819C5.09731 7.73379 5.0499 7.61933 5.0499 7.49999C5.0499 7.38064 5.09731 7.26618 5.1817 7.18179L8.1817 4.18179C8.35743 4.00605 8.64236 4.00605 8.81809 4.18179Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"></path>
            </svg>
          </Button>

          <span>{{ formattedMonth }}</span>

          <Button @click="nextMonth" variant="outline" size="icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.18194 4.18185C6.35767 4.00611 6.6426 4.00611 6.81833 4.18185L9.81833 7.18185C9.90272 7.26624 9.95013 7.3807 9.95013 7.50005C9.95013 7.6194 9.90272 7.73386 9.81833 7.81825L6.81833 10.8182C6.6426 10.994 6.35767 10.994 6.18194 10.8182C6.0062 10.6425 6.0062 10.3576 6.18194 10.1819L8.86374 7.50005L6.18194 4.81825C6.0062 4.64251 6.0062 4.35759 6.18194 4.18185Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"></path>
            </svg>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
