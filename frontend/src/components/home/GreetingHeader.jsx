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
    </div>
  );
}

export default GreetingHeader;