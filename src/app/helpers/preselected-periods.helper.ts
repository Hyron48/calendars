export const preselectedPeriods: Record<string, () => { label: string; range: Date[], key: string}> = {
  currentMonth: () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      label: 'Mese corrente',
      range: [startDate, endDate],
      key: 'currentMonth'
    };
  },
  lastMonth: () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endDate = new Date(today.getFullYear(), today.getMonth(), 0);
    return {
      label: 'Ultimo mese',
      range: [startDate, endDate],
      key: 'lastMonth'
    };
  },
  currentYear: () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 0, 1);
    const endDate = new Date(today.getFullYear(), 11, 31);
    return {
      label: 'Anno corrente',
      range: [startDate, endDate],
      key: 'currentYear'
    };
  },
  lastYear: () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear() - 1, 0, 1);
    const endDate = new Date(today.getFullYear() - 1, 11, 31);
    return {
      label: 'Anno precedente',
      range: [startDate, endDate],
      key: 'lastYear'
    };
  },
}
