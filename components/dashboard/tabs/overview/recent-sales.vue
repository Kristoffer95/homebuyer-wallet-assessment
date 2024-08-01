<script setup lang="ts">
import moment from 'moment';

const loanOfficers = useLoanOfficers();
const programImports = useProgramImports();
const { month, formatted_month_year } = useCalendarMonthState();
const users = useUsers();

const filteredYearAndMonth = computed(() =>
  programImports.value
    .map((program) => {
      if (moment(program.sold_at).format('YYYY-MM')) {
        return program;
      }
    })
    .filter(
      (program) =>
        moment(program?.sold_at).format('YYYY-MM') ===
        formatted_month_year.value
    )
);

const data = [
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
];
</script>

<template>
  <DonutChart
    class="!h-64"
    index="name"
    :category="'total'"
    :data="data"
    :type="'pie'"
    :colors="['#A2A7A5', '#DAE2DF', '#001021']" />
</template>
