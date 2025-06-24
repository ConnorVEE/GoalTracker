import { Typography, Paper } from "@mui/material";

const GreetingHeader = ({ user, dateStr }) => {

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const name = user?.first_name || "Playa";

  return (
    <div className="text-center mb-6">
        <Typography variant="h4" className="text-purple-700 font-semibold">
            {getGreeting()}, {name}!
        </Typography>

        <Paper
            elevation={3}
            className="p-4 rounded-xl shadow-md mt-4 w-full max-w-md text-center"
            sx={{ backgroundColor: "#D8B4F8" }}
        >
            <Typography variant="subtitle1" sx={{ color: "#6A4C93" }}>
                Today is
            </Typography>
            <Typography variant="h6" fontWeight="bold">
                {dateStr}
            </Typography>
        </Paper>
    </div>
  );
}

export default GreetingHeader;