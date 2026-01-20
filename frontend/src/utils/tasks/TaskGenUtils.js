// Normalize a server item for frontend consumption
export function normalizeTask(item) {
    switch (item.type) {
        case "single":
            return {
                id: item.id,
                parent_id: null,
                title: item.title,
                date: item.date,
                completed: item.completed,
                type: "single",
            };
        case "instance":
            return {
                id: item.id,
                parent_id: item.parent_id,
                title: item.title || item.parent_title,
                date: item.date,
                completed: item.completed,
                type: "instance",
                is_deleted: item.is_deleted,
            };
        case "parent":
            return {
                id: item.id,
                parent_id: null,
                title: item.title,
                recurrence_rule: item.recurrence_rule, // keep this for reference
                completed: item.completed,
                type: "parent",
            };
        default:
            console.warn("Unknown task type:", item);
            return null;
    }
}

// Utility: generate virtual instances for all recurring parents
export function generateVirtualInstances(parents, startDate, endDate) {
  const virtuals = [];
  
  // Split the date strings to avoid timezone shifts
  // Using the components ensures JS treats it as "Local 00:00" not "UTC 00:00"
  const [sY, sM, sD] = startDate.split('-').map(Number);
  const [eY, eM, eD] = endDate.split('-').map(Number);

  const start = new Date(sY, sM - 1, sD);
  const end = new Date(eY, eM - 1, eD);

  // Iterate from start to end date
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const weekday = d.getDay(); 
    
    // Format date string as YYYY-MM-DD without using toISOString()
    const dateStr = d.getFullYear() + '-' + 
                    String(d.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(d.getDate()).padStart(2, '0');

    // Check each parent for recurrence                 
    parents.forEach(parent => {
      const days = parent.recurrence_rule?.days_of_week || [];

      if (days.includes(weekday)) {
        virtuals.push({
          type: "virtual",
          parent_id: parent.id,
          date: dateStr,
          title: parent.title,
          completed: false,
          id: `virtual-${parent.id}-${dateStr}`,
          meta: { parent_id: parent.id, date: dateStr }
        });
      }
    });
  }

  return virtuals;
}

// Utility: filter out visible tasks for desired range
export function buildVisibleTasksByRange(tasks, startDate, endDate) {
    // Determine parents and real tasks from incoming tasks
    const parents = tasks.filter(t => t.type === "parent")
    const realTasks = tasks.filter(t => t.type !== "parent");

    // Generate virtual instances for all recurring parents
    const virtualTasks = generateVirtualInstances(
        parents,
        startDate,
        endDate
    );

    const realKeys = new Set(
        realTasks
            .filter(t => t.type === "instance")
            .map(t => `${t.parent_id}-${t.date}`)
    );

    const visibleRealTasks = realTasks.filter(
        t => !(t.type === "instance" && t.is_deleted)
    );

    // Filter out any virtuals that already have a real instance
    const filteredVirtuals = virtualTasks.filter(
        v => !realKeys.has(`${v.parent_id}-${v.date}`)
    );

    // Return combined visible tasks, but I am unsure how to combine them correctly 
    return [...visibleRealTasks, ...filteredVirtuals];
}