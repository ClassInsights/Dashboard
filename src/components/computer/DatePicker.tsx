import { ChevronDownIcon } from "lucide-react";
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

  const selectToday = () => handleSelect(new Date());

  return (
    <div className="flex gap-3">
      <Label htmlFor="date">Ausgewähles Datum</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" id="date" className="w-48 justify-between font-normal">
            {date.formatToDay()}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
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
