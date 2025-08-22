import { ChevronDownIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { deAT } from "react-day-picker/locale";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type DatePickerProps = {
  date: Date;
  onChange: (value: Date) => void;
};

const DatePicker = ({ date, onChange }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    onChange(date);
    setIsOpen(false);
  };

  const previousDay = () =>
    handleSelect(new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1));
  const nextDay = () =>
    handleSelect(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));

  const selectToday = () => handleSelect(new Date());

  return (
    <div className="flex items-center justify-center gap-3 md:justify-start">
      <Label htmlFor="date" className="hidden md:block">
        Ausgewähles Datum
      </Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <Button variant="outline" size="icon" aria-label="Einen Tag zurück" onClick={previousDay}>
          <ChevronLeft />
          <span className="sr-only">Einen Tag zurück</span>
        </Button>
        <PopoverTrigger asChild>
          <Button variant="outline" id="date" className="justify-between font-normal">
            {date.formatToDay()}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <Button variant="outline" size="icon" aria-label="Einen Tag vor" onClick={nextDay}>
          <ChevronRight />
          <span className="sr-only">Einen Tag vor</span>
        </Button>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            locale={deAT}
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            onSelect={handleSelect}
            footer={
              <Button
                onClick={selectToday}
                size="sm"
                variant="outline"
                className="mt-2 w-full border-dashed"
              >
                Heute
              </Button>
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
