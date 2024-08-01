<script setup lang="ts">
import { computed, watchEffect } from 'vue';
import moment from 'moment';
// import { useLoanOfficers, useProgramImports, useUsers } from '@/composables';
// import { useCalendarMonthState } from '@/composables/useCalendarMonthState';

const loanOfficers = useLoanOfficers();
const programImports = useProgramImports();
const { month, formatted_month_year } = useCalendarMonthState();
const users = useUsers();

const filteredYearAndMonth = computed(() =>
  programImports.value.filter(
    (program) =>
      moment(program.sold_at).format('YYYY-MM') === formatted_month_year.value
  )
);

const data = computed(() => [
  {
    name: 'Users',
    total: users.length,
  },
  {
    name: 'Loan Officers',
    total: loanOfficers.length,
  },
  {
    name: `Program Imports (${month.value})`,
    total: filteredYearAndMonth.value.length,
  },
]);

watchEffect(() => {
  data.value;
});
</script>

<template>
  <pre>
    {{ data }}
  </pre>

  <LazyDonutChart
    class="!h-64"
    index="name"
    :category="'total'"
    :data="data"
    :type="'pie'"
    :colors="['#A2A7A5', '#DAE2DF', '#001021']" />
</template>
