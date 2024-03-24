"use client"
import { ReactEventHandler, useEffect, useState, useRef } from "react"
import Image from "next/image"
import {
	ChevronRightIcon,
	ChevronLeftIcon,
	ChevronUpIcon,
	ChevronDownIcon,
} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Dir } from "fs"
const directions = ["up", "left", "down", "right"] as const
type Direction = (typeof directions)[number]

export default function Home() {
	const [activeButton, setActiveButton] = useState("")
	const [circleX, setCircleX] = useState(0)
	const [circleY, setCircleY] = useState(0)
	const [target, setTarget] = useState({ x: 0, y: 0 })

	useEffect(() => {
		const handleKeyDown = (e: { key: string }) => {
			const directionKeyMap: { [key: string]: Direction } = {
				w: "up",
				ArrowUp: "up",
				s: "down",
				ArrowDown: "down",
				a: "left",
				ArrowLeft: "left",
				d: "right",
				ArrowRight: "right",
			}
			console.log("key down", e.key)
			const direction = directionKeyMap[e.key]
			console.log("direction", direction)
			if (direction) {
				setActiveButton(direction)
				handleActions(direction)
			}
		}

		const handleKeyUp = () => {
			setActiveButton("")
		}

		window.addEventListener("keydown", handleKeyDown)
		window.addEventListener("keyup", handleKeyUp)

		return () => {
			window.removeEventListener("keydown", handleKeyDown)
			window.removeEventListener("keyup", handleKeyUp)
		}
	}, [])

	const handleActions = (direction: Direction) => {
		console.log("direction", direction)
		console.log("circleX", circleX, "circleY", circleY)
		switch (direction) {
			case "up":
				setCircleY(circleY => (circleY !== 0 ? Math.abs(circleY - 1) : 16))
				break
			case "down":
				setCircleY(circleY => circleY + 1)
				break
			case "left":
				setCircleX(circleX => (circleX !== 0 ? Math.abs(circleX - 1) : 28))
				break
			case "right":
				setCircleX(circleX => circleX + 1)
				break
		}
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="game">
				<div className="game-board">
					<div className="board">
						<div className="grid grid-cols-28 grid-rows-16  bg-slate-300 rounded-lg ">
							<div
								key={1}
								className=" bg-red-400 h-[25px] w-[25px] rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110"
								style={{
									gridColumnStart: circleX,
									gridColumnEnd: circleX + 1,
									gridRowStart: circleY,
									gridRowEnd: circleY + 1,
								}}
							></div>
						</div>
					</div>
					<div className="grid grid-rows-2 grid-cols-3 gap-2 w-max">
						{directions.map(dir => (
							<ButtonIcon
								key={dir}
								direction={dir}
								active={activeButton === dir}
								handleActions={handleActions}
								setActiveButton={setActiveButton}
							/>
						))}
					</div>
					<div className="controller">
						<button>Start</button>
						<button>Pause</button>
						<button>Reset</button>
					</div>
				</div>
				<div className="game-info">
					<div></div>
					<ol></ol>
				</div>
			</div>
		</main>
	)
}

export function ButtonIcon({
	direction,
	active,
	handleActions,
	className,
	setActiveButton,
}: {
	direction: Direction
	active?: boolean
	handleActions: Function
	className?: string
	setActiveButton: React.Dispatch<React.SetStateAction<string>>
}) {
	const actionIntervalRef = useRef<NodeJS.Timeout | null>(null)

	const startAction = () => {
		handleActions(direction)
		if (!actionIntervalRef.current) {
			actionIntervalRef.current = setInterval(() => {
				handleActions(direction)
			}, 100) // Adjust the interval as needed
		}
	}

	const stopAction = () => {
		if (actionIntervalRef.current) {
			setActiveButton("")
			clearInterval(actionIntervalRef.current)
			actionIntervalRef.current = null
		}
	}

	let Icon = ChevronRightIcon
	let position = ""
	switch (direction) {
		case "up":
			Icon = ChevronUpIcon
			position = "col-start-2 col-end-3 "
			break
		case "down":
			Icon = ChevronDownIcon
			position = "col-start-2 col-end-3 "
			break
		case "left":
			Icon = ChevronLeftIcon
			position = "col-start-1 col-end-2 "
			break
		case "right":
			Icon = ChevronRightIcon
			position = "col-start-3 col-end-4 "
			break
	}

	return (
		<Button
			variant="outline"
			size="icon"
			className={`${position} ${active ? "bg-blue-500" : ""} ${className}`}
			onMouseDown={startAction}
			onMouseUp={stopAction}
			onMouseLeave={stopAction}
		>
			<Icon className="h-4 w-4" />
		</Button>
	)
}
