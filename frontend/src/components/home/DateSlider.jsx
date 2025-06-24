import { Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const DateSlider = ({handleNextDay, handlePrevDay, dateStr}) => {

    return (
        <div className="flex items-center space-x-2 mt-4">
            <ArrowBackIosIcon
                onClick={handlePrevDay}
                className="cursor-pointer hover:text-[#6A4C93]"
            />
            <Typography variant="body1">{dateStr}</Typography>

            <ArrowForwardIosIcon
                onClick={handleNextDay}
                className="cursor-pointer hover:text-[#6A4C93]"
            />
        </div>
    );
}

export default DateSlider;