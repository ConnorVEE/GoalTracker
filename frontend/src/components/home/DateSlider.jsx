import { Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? -18 : 18,
    opacity: 0
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({
    x: direction > 0 ? 18 : -18,
    opacity: 0
  })
};

const DateSlider = ({ handleNextDay, handlePrevDay, dateStr, direction }) => {
  return (
    <div className="flex items-center space-x-2 mt-4 select-none">
      <ArrowBackIosIcon onClick={handlePrevDay} className="cursor-pointer hover:text-[#6A4C93]" />
      
      <div style={{ width: 180, textAlign: "center" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.span
            key={dateStr}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
            style={{ display: "inline-block" }}
          >
            <Typography variant="body1" sx={{ fontSize: "1.05rem" }}>{dateStr}</Typography>
          </motion.span>
        </AnimatePresence>
      </div>

      <ArrowForwardIosIcon onClick={handleNextDay} className="cursor-pointer hover:text-[#6A4C93]" />
    </div>
  );
};

export default DateSlider;