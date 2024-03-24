"use client"
import Image from "next/image"
import {
	ChevronRightIcon,
	ChevronLeftIcon,
	ChevronUpIcon,
	ChevronDownIcon,
} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="game">
				<div className="game-board">
					{/* <Board /> */}
					<div className="board"></div>
					{/* <Controller /> */}
					<div className="grid grid-rows-2 grid-cols-3 gap-2">
						<ButtonIcon direction="up" className="col-start-2 col-end-3 " />
						<ButtonIcon direction="left" className="col-start-1 col-end-2 " />
						<ButtonIcon direction="down" className="col-start-2 col-end-3 " />
						<ButtonIcon direction="right" className="col-start-3 col-end-4 " />
					</div>
					<div className="controller">
						<button>Start</button>
						<button>Pause</button>
						<button>Reset</button>
					</div>
				</div>
				<div className="game-info">
					<div>{/* status */}</div>
					<ol>{/* TODO */}</ol>
				</div>
			</div>
		</main>
	)
}

export function ButtonIcon({
	direction,
	className,
}: {
	direction: "up" | "down" | "left" | "right"
	className?: string
}) {
	let Icon = ChevronRightIcon
	switch (direction) {
		case "up":
			Icon = ChevronUpIcon
			break
		case "down":
			Icon = ChevronDownIcon
			break
		case "left":
			Icon = ChevronLeftIcon
			break
		case "right":
			Icon = ChevronRightIcon
			break
	}
	const handleActions = (direction: string) => {
		console.log(`Move ${direction}`)
	}
	return (
		<Button
			variant="outline"
			size="icon"
			className={className}
			onClick={() => handleActions(direction)}
		>
			<Icon className="h-4 w-4" />
		</Button>
	)
}
