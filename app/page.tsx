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

	useEffect(() => {
		const handleKeyDown = (e: { key: string }) => {
			switch (e.key) {
				case "w":
				case "ArrowUp":
					setActiveButton("up")
					handleActions("up")
					break
				case "s":
				case "ArrowDown":
					setActiveButton("down")
					handleActions("down")
					break
				case "a":
				case "ArrowLeft":
					setActiveButton("left")
					handleActions("left")
					break
				case "d":
				case "ArrowRight":
					setActiveButton("right")
					handleActions("right")
					break
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
		console.log(`Move ${direction}`)
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="game">
				<div className="game-board">
					<div className="board"></div>
					<div className="grid grid-rows-2 grid-cols-3 gap-2">
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
			onClick={() => handleActions(direction)}
		>
			<Icon className="h-4 w-4" />
		</Button>
	)
}
