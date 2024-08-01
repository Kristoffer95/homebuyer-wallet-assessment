<script setup lang="ts">
import RevenueChart from './revenue-chart.vue';
import RecentSales from './recent-sales.vue';

const revenue = useRevenue();
const key = ref(0);

function forceUpdate() {
  key.value++;
}

const monthRevenue = computed(
  () =>
    revenue.monthly_revenue.value?.[revenue.monthly_revenue.value.length - 1]
);
</script>

<template>
  <pre>
    {{ revenue.monthly_revenue }}
  </pre>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader
        class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium"> Total Revenue </CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          class="h-4 w-4 text-muted-foreground">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">${{ monthRevenue.total }}</div>
        <p
          class="text-xs text-muted-foreground"
          :class="
            +monthRevenue.total_percent_change < 0
              ? 'text-red-500'
              : 'text-muted-foreground'
          ">
          {{ monthRevenue.total_percent_change }}% from last month
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader
        class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium"> Sales </CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          class="h-4 w-4 text-muted-foreground">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">${{ monthRevenue.sales }}</div>
        <p
          class="text-xs"
          :class="
            +monthRevenue.sales_percent_change < 0
              ? 'text-red-500'
              : 'text-muted-foreground'
          ">
          {{ monthRevenue.sales_percent_change }}% from last month
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader
        class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium"> Services </CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          class="h-4 w-4 text-muted-foreground">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">${{ monthRevenue.services }}</div>
        <p
          class="text-xs text-muted-foreground"
          :class="
            +monthRevenue.service_percent_change < 0
              ? 'text-red-500'
              : 'text-muted-foreground'
          ">
          {{ monthRevenue.service_percent_change }} from last month
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader
        class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium"> Loan </CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          class="h-4 w-4 text-muted-foreground">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{{ monthRevenue.loan }}</div>
        <p
          class="text-xs text-muted-foreground"
          :class="
            +monthRevenue.loan_percent_change < 0
              ? 'text-red-500'
              : 'text-muted-foreground'
          ">
          {{ monthRevenue.loan_percent_change }}% from last month
        </p>
      </CardContent>
    </Card>
  </div>
  <div class="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-7">
    <Card class="col-span-4">
      <!-- <Button @click="forceUpdate()"> Reload component </Button> -->
      <CardHeader>
        <CardTitle>Revenue Graph</CardTitle>
      </CardHeader>
      <CardContent class="pl-2">
        <RevenueChart :key />
      </CardContent>
    </Card>
    <Card class="col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription> You made 265 sales this month. </CardDescription>
      </CardHeader>
      <CardContent>
        <RecentSales />
      </CardContent>
    </Card>
  </div>
</template>

<style lang="scss" scoped></style>
