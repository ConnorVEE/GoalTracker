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

export default function TaskCreationForm({ onCreate, isLoading }) {

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      date: "",
      goal: "",
      recurrence_days: [],
    },
  });

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      date: new Date(data.date).toISOString().split("T")[0], // Normalize to YYYY-MM-DD
      recurrence_days: data.recurrence_days.map(day => Number(day)),
    };

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

      {/* Due Date */}
      <div>

        <label className="block font-medium text-gray-700">Due Date</label>

        <input
          {...register("date", { required: true })}
          type="date"
          className="w-full mt-1 px-3 py-2 border rounded-md"
        />
        {errors.due_date && <p className="text-sm text-red-600">Due date is required</p>}

      </div>

      {/* Goal Selection (mock) */}
      <div>
        
        <label className="block font-medium text-gray-700">Pair with a goal? (optional)</label>

        <select {...register("goal")} className="w-full mt-1 px-3 py-2 border rounded-md">
          <option value="">Select a goal</option>
          <option value="health">Health</option>
          <option value="career">Career</option>
        </select>

      </div>

      {/* Recurrence */}
      <div>

        <label className="block font-medium text-gray-700 mb-2">Repeat on:</label>

        <div className="flex gap-2 flex-wrap">
          {daysOfWeek.map(day => (

            <label key={day.value} className="flex items-center gap-1">
              <input
                type="checkbox"
                value={day.value}
                {...register("recurrence_days")}
                className="accent-purple-600"
              />
              <span className="text-sm">{day.name}</span>
            </label>

          ))}
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