import moment from 'moment-timezone';
import { computed } from 'vue';

export const useRevenue = () => {
  const { formatted_month_year } = useCalendarMonthState();
  const data = useData();
  const programImports = useProgramImports();

  const imports = computed(() =>
    programImports.value.map((programImport: any) => {
      return {
        ...programImport,
        user: data.value.users.find(
          (user: any) => user.id === programImport.user_id
        ),
        program: data.value.programs.find(
          (program: any) => program.id === programImport.program_id
        ),
        loan_officer: data.value.loan_officers.find(
          (officer: any) => officer.id === programImport.loan_officer_id
        ),
      };
    })
  );

  const sold_imports = computed(() =>
    imports.value.filter((rev) => rev.status === 'sold')
  );

  const total = computed(() =>
    sold_imports.value
      .map((rev) => rev.amount)
      .reduce((acc, value) => acc + value, 0)
  );

  const getPast12Months = () => {
    const months = [];
    const locale = moment.tz.guess();
    const startMonth = moment(formatted_month_year.value, 'YYYY-MM');
    for (let i = 0; i < 12; i++) {
      months.push(
        moment(startMonth).tz(locale).subtract(i, 'months').startOf('month')
      );
    }
    return months.reverse();
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) {
      return current !== 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  };

  const monthlyRevenue = computed(() => {
    const months = getPast12Months();
    let previousTotals = {
      total: 0,
      sales: 0,
      service: 0,
      loan: 0,
    };

    const revenuePerMonth = months.map((month) => {
      const monthYear = month.format('YYYY-MM');

      const salesTotal = sold_imports.value
        .filter((rev) => {
          const revDate = moment(rev.sold_at).tz(moment.tz.guess());
          return revDate.isSame(month, 'month') && rev.source === 'sales';
        })
        .reduce((acc, rev) => acc + (rev.amount || 0), 0);

      const serviceTotal = sold_imports.value
        .filter((rev) => {
          const revDate = moment(rev.sold_at).tz(moment.tz.guess());
          return revDate.isSame(month, 'month') && rev.source === 'service';
        })
        .reduce((acc, rev) => acc + (rev.amount || 0), 0);

      const loanTotal = sold_imports.value
        .filter((rev) => {
          const revDate = moment(rev.sold_at).tz(moment.tz.guess());
          return revDate.isSame(month, 'month') && rev.source === 'loan';
        })
        .reduce((acc, rev) => acc + (rev.amount || 0), 0);

      const monthlyTotal = salesTotal + serviceTotal + loanTotal;

      const totalPercentChange = calculatePercentageChange(
        monthlyTotal,
        previousTotals.total
      );
      const salesPercentChange = calculatePercentageChange(
        salesTotal,
        previousTotals.sales
      );
      const servicePercentChange = calculatePercentageChange(
        serviceTotal,
        previousTotals.service
      );
      const loanPercentChange = calculatePercentageChange(
        loanTotal,
        previousTotals.loan
      );

      previousTotals = {
        total: monthlyTotal,
        sales: salesTotal,
        service: serviceTotal,
        loan: loanTotal,
      };

      return {
        month: monthYear,
        services: serviceTotal,
        sales: salesTotal,
        loan: loanTotal,
        total: monthlyTotal,
        total_percent_change: totalPercentChange.toFixed(2),
        sales_percent_change: salesPercentChange.toFixed(2),
        service_percent_change: servicePercentChange.toFixed(2),
        loan_percent_change: loanPercentChange.toFixed(2),
      };
    });

    return revenuePerMonth;
  });

  return {
    data: imports,
    sold_imports,
    all_time: total,
    monthly_revenue: monthlyRevenue,
  };
};
