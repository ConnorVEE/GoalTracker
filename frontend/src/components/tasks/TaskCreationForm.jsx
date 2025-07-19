import { useForm } from "react-hook-form";

const daysOfWeek = [
  { name: "Sun", value: 0 },
  { name: "Mon", value: 1 },
  { name: "Tue", value: 2 },
  { name: "Wed", value: 3 },
  { name: "Thu", value: 4 },
  { name: "Fri", value: 5 },
  { name: "Sat", value: 6 },
];

export default function TaskCreationForm({ onCreate, isLoading, goals }) {

  // Initialize form methods
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      date: "",
      goal: "",
      recurrence_days: [],
    },
  });

  // Handle form submission
const onSubmit = (data) => {

  const formattedData = {
    title: data.title,
    date: data.date
      ? new Date(data.date).toISOString().split("T")[0]
      : null,
    goal: data.goal || null,
  };

  if (data.recurrence_days.length > 0) {
    formattedData.recurrence_rule = {
      days_of_week: data.recurrence_days.map(Number),
    };
  }

  onCreate(formattedData);
  reset();
};


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border rounded-md p-6 space-y-6 shadow-sm">
      <h2 className="text-xl font-bold text-purple-700">New Task</h2>

      {/* Title */}
      <div>
        <label className="block font-medium text-gray-700">Title</label>
        <input
          {...register("title", { required: true })}
          type="text"
          placeholder="e.g. Finish project plan"
          className="w-full mt-1 px-3 py-2 border rounded-md"
        />
        {errors.title && <p className="text-sm text-red-600">Title is required</p>}
      </div>

      {/* Deadline */}
      <div>

        <label className="block font-medium text-gray-700">Deadline</label>

        <input
          {...register("date")}
          type="date"
          className="w-full mt-1 px-3 py-2 border rounded-md"
        />
        {errors.due_date && <p className="text-sm text-red-600">A deadline is required</p>}

      </div>

      {/* Goal Selection */}
      <div>
        <label className="block font-medium text-gray-700">Goal (optional)</label>

        <select {...register("goal")} className="w-full mt-1 px-3 py-2 border rounded-md">
          <option value="">Select a goal</option>

          {goals.map(goal => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}

        </select>
      </div>

      {/* Recurrence */}
      {/* Recurrence (Toggle Buttons) */}
      <div>
        <label className="block font-medium text-gray-700 mb-2">Repeat on:</label>

        <div className="flex gap-2 flex-wrap">
          {daysOfWeek.map((day) => {
            const isSelected = watch("recurrence_days")?.includes(day.value.toString());

            return (
              <button
                key={day.value}
                type="button"
                className={`px-3 py-1 rounded-md border text-sm font-medium transition
                  ${isSelected
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-purple-100"
                  }`}
                onClick={() => {
                  const current = watch("recurrence_days") || [];
                  const updated = isSelected
                    ? current.filter((val) => val !== day.value.toString())
                    : [...current, day.value.toString()];
                  setValue("recurrence_days", updated);
                }}
              >
                {day.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 rounded-md text-white ${
            isLoading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
          } transition`}
        >
          {isLoading ? "Saving..." : "Save Task"}
        </button>

      </div>

    </form>
  );
}