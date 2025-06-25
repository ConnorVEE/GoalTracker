const TaskItem = ({task}) => {

    return (
      <div
        className="bg-[#F3E8FF] border border-[#D6B8ED] rounded-lg px-4 py-3 text-sm shadow-sm text-gray-800 transition-all hover:scale-[1.02]"
      >
        <span className="font-medium">{task.title}</span>
      </div>
    )
}

export default TaskItem;