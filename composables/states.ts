import moment from 'moment';

export const useCalendarMonthState = () => {
  const month = useState('calendar-month-state', () => ref(''));

  const formatted_month_year = computed(() =>
    moment(month.value, 'MMMM YYYY').format('YYYY-MM')
  );

  return {
    month,
    formatted_month_year: formatted_month_year,
  };
};
