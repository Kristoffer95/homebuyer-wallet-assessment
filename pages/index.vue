<script setup lang="ts">
import moment from 'moment';

const activeTab = ref('overview');
const { month } = useCalendarMonthState();

function setSelectedTab(tab: string) {
  activeTab.value = tab;
}

const tabItems = ref([
  {
    label: 'overview',
    value: 'overview',
  },
  {
    label: 'users',
    value: 'users',
  },
  {
    label: 'loan officers',
    value: 'loan_officers',
  },
  {
    label: 'program imports',
    value: 'program_imports',
  },
]);
</script>

<template>
  <div class="flex-col md:flex">
    <div class="border-b">
      <div class="flex h-16 items-center px-4 container">
        <h2 class="px-6 text-2xl font-bold tracking-tight">Homebuyer Wallet</h2>

        <div class="ml-auto flex items-center space-x-4">
          <DashboardUserNav />
        </div>
      </div>
    </div>
    <div class="flex-1 space-y-4 p-8 pt-6 container">
      <div class="items-center justify-end space-y-2 hidden md:flex">
        <div class="flex items-center space-x-2">
          <DashboardDateRangePicker />
        </div>
      </div>
      <Tabs class="md:space-y-4" v-model:model-value="activeTab">
        <TabsList class="hidden md:inline-flex">
          <TabsTrigger
            v-for="(item, index) in tabItems"
            :key="`tab-item-${index}`"
            class="capitalize"
            :value="item.value">
            {{ item.label }}
          </TabsTrigger>
        </TabsList>

        <DashboardTabListDropdown
          :tab-items
          @update-seleted-tab="setSelectedTab" />

        <TabsContent value="overview" class="space-y-4">
          <DashboardTabsOverview />
        </TabsContent>
        <TabsContent value="users" class="space-y-4">
          <DashboardTabsUsers />
        </TabsContent>
        <TabsContent value="loan_officers" class="space-y-4">
          <DashboardTabsLoanOfficers />
        </TabsContent>
        <TabsContent value="program_imports" class="space-y-4">
          <DashboardTabsProgramImports />
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<style lang="scss">
tspan {
  fill: black !important;
}
</style>
