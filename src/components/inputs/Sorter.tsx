import { useEffect, useState } from "react";
import SortSVG from "../../assets/svg/sort.svg?react";
import ArrowDownSVG from "../../assets/svg/arrow-down.svg?react";

export enum Order {
	ASC = "asc",
	DESC = "desc",
	NONE = "none",
}

type SorterProps = {
	order?: Order;
	onChange: (order: Order) => void;
};

const Sorter = ({ order = Order.NONE, onChange }: SorterProps) => {
	const [curentOrder, setCurrentOrder] = useState<Order>(order);

	const handleClick = () =>
		setCurrentOrder((prevOrder) => {
			const newOrder = prevOrder === Order.NONE ? Order.ASC : prevOrder === Order.ASC ? Order.DESC : Order.NONE;
			onChange(newOrder);
			return newOrder;
		});

	useEffect(() => {
		setCurrentOrder(order);
	}, [order]);

	return (
		<div onClick={handleClick} onKeyDown={handleClick}>
			{curentOrder === Order.ASC ? (
				<ArrowDownSVG className="shrink-0 cursor-pointer fill-black" width={15} />
			) : curentOrder === Order.DESC ? (
				<ArrowDownSVG className="shrink-0 rotate-180 cursor-pointer fill-black" width={15} />
			) : (
				<SortSVG className="shrink-0 cursor-pointer fill-black" width={15} />
			)}
		</div>
	);
};

export default Sorter;
