<script setup lang="ts">
import moment from 'moment';

const revenue = useRevenue();
const { formatted_month_year } = useCalendarMonthState();

const data = computed(() =>
  revenue.monthly_revenue.value.map((month) => ({
    name: moment(formatted_month_year.value, 'YYYY-MM').format('MMM'),
    total: month.total,
  }))
);
</script>

<template>
  <BarChart
    class="max-h-[350px]"
    :data="data"
    :categories="['total']"
    :index="'name'"
    :rounded-corners="4" />
</template>
