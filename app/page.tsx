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
	const [circle, setCircle] = useState({ x: 1, y: 1 })
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
			const direction = directionKeyMap[e.key]
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
	useEffect(() => {
		console.log("circle.x", circle.x, "circle.y", circle.y)
	}, [circle.x, circle.y])

	const handleActions = (direction: Direction) => {
		setCircle(prevPosition => {
			let newX = prevPosition.x
			let newY = prevPosition.y

			switch (direction) {
				case "up":
					newY = newY !== 1 ? newY - 1 : 58
					break
				case "down":
					newY = (newY + 1) % 58
					break
				case "left":
					newX = newX !== 1 ? newX - 1 : 78
					break
				case "right":
					newX = (newX + 1) % 78
					break
				default:
					break
			}

			return { x: newX, y: newY }
		})
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="game">
				<div className="game-board">
					<div className="board">
						<div className="grid grid-cols-80 grid-rows-60  bg-slate-300 rounded-lg ">
							<div
								key={1}
								className=" bg-red-400 h-[25px] w-[25px] rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110"
								style={{
									gridArea: `${circle.y} / ${circle.x} / ${circle.y + 1} / ${
										circle.x + 1
									}`,
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
	const actionIntervalRef = useRef<number | null>(null)
	useEffect(() => {
		return () => {
			if (actionIntervalRef.current) {
				cancelAnimationFrame(actionIntervalRef.current)
				actionIntervalRef.current = null
			}
		}
	}, [])

	const startAction = () => {
		if (!actionIntervalRef.current) {
			const performAction = () => {
				handleActions(direction)
				actionIntervalRef.current = requestAnimationFrame(performAction)
			}
			performAction()
		}
	}

	const stopAction = () => {
		if (actionIntervalRef.current) {
			cancelAnimationFrame(actionIntervalRef.current)
			actionIntervalRef.current = null
		}
		setActiveButton("") // Consider if this should be here or moved to ensure it's called appropriately
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
			onTouchStart={startAction}
			onTouchEnd={stopAction}
		>
			<Icon className="h-4 w-4" />
		</Button>
	)
}
