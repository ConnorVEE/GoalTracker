// Generate a grid of dates for a month view in calendar component
export function generateMonthGrid(date = new Date()) {
    
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDayOfWeek = startOfMonth.getDay(); // 0 (Sun) to 6 (Sat)

  // Start from the Sunday before or on the 1st of the month
  const gridStartDate = new Date(startOfMonth);
  gridStartDate.setDate(startOfMonth.getDate() - startDayOfWeek);

  const days = [];

  for (let i = 0; i < 42; i++) {
    const day = new Date(gridStartDate);
    day.setDate(gridStartDate.getDate() + i);

    days.push({
      date: day.toISOString().split("T")[0], // e.g. "2025-07-04"
      isCurrentMonth: day.getMonth() === date.getMonth(),
      dayOfWeek: day.getDay(), // 0 = Sunday
      fullDate: day, // useful for display
    });
  }

  return days;
}

// Generate an array of 7 days (Sun to Sat) for the week of the given date
export function generateWeekGrid(date = new Date()) {
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - dayOfWeek);

  const currentMonth = date.getMonth();
  const days = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    days.push({
      date: day.toISOString().split("T")[0],   // string key
      fullDate: day,                           // raw date
      isCurrentMonth: day.getMonth() === currentMonth,
    });
  }

  return days;
}

// Group tasks by date for calendar display
export function groupTasksByDate(tasks, gridDays) {
  const map = {};

  gridDays.forEach(day => {
    const jsWeekday = day.fullDate.getDay(); // JS: 0=Sun..6=Sat

    tasks.forEach(task => {
      const isOneTime = task.date === day.date;
      
      const isRecurring =
        task.recurrence_rule?.days_of_week
          ?.map(Number)
          .includes(jsWeekday);

      if (isOneTime || isRecurring) {
        if (!map[day.date]) map[day.date] = [];
        map[day.date].push(task);
      }

    });
  });

  return map;
}