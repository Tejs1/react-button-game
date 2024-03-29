"use client"
import {
	ReactEventHandler,
	useEffect,
	useState,
	useRef,
	Dispatch,
	SetStateAction,
	useCallback,
	MutableRefObject,
} from "react"
import Image from "next/image"

import {
	useStoreActions,
	useStoreState,
	useStoreDispatch,
	useStore,
	Targets,
	ActionName,
	CoordinatesPayload,
	initialTarget,
} from "@/lib/store"

import {
	ChevronRightIcon,
	ChevronLeftIcon,
	ChevronUpIcon,
	ChevronDownIcon,
} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Dir } from "fs"
const directions = ["up", "left", "down", "right"] as const
type Circles = "circle1" | "circle2" | "circle3"
type Direction = (typeof directions)[number]

export default function App() {
	const store = useStoreState(state => state)
	useEffect(() => {
		console.log(store)
	}, [store])

	const [activeButton, setActiveButton] = useState("")
	const [circle1, setCircle1] = useState({ x: 1, y: 1 })
	const [circle2, setCircle2] = useState({ x: 1, y: 1 })
	const [circle3, setCircle3] = useState({ x: 1, y: 1 })
	const [target, setTarget] = useState({ x: 30, y: 4 })
	const [target2, setTarget2] = useState({ x: 30, y: 4 })
	const [target3, setTarget3] = useState({ x: 50, y: 2 })
	const button1targetIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const button2targetIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const button3targetIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const button4targetIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const button1target2IntervalRef = useRef<NodeJS.Timeout | null>(null)
	const button2target2IntervalRef = useRef<NodeJS.Timeout | null>(null)
	const button3target2IntervalRef = useRef<NodeJS.Timeout | null>(null)
	const button4target2IntervalRef = useRef<NodeJS.Timeout | null>(null)

	const startAction = useCallback(
		(
			direction: Direction,
			circle: Circles,
			actionIntervalRef: MutableRefObject<NodeJS.Timeout | null>,
		) => {
			if (!actionIntervalRef.current) {
				actionIntervalRef.current = setInterval(() => {
					handleActions(direction, circle)
				}, 100) // Adjust the interval as needed
				console.log("starting")
				console.log(actionIntervalRef.current)
			}
		},
		[],
	)
	const stopAction = (actionIntervalRef: {
		current: NodeJS.Timeout | null
	}) => {
		console.log("stopping")
		if (actionIntervalRef.current) {
			console.log("stopping 2")
			setActiveButton("")
			clearInterval(actionIntervalRef.current)
			actionIntervalRef.current = null
		}
	}
	useEffect(() => {
		const randomX = Math.abs(Math.floor(Math.random() * 78 - 15) + 1) // Generates a number between 1 and 78
		const randomY = Math.floor(Math.random() * 18 - 15) + 1 // Generates a number between 1 and 18
		// setTarget({ x: randomX, y: randomY })
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
				handleActions(direction, "circle1")
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
		if (isCircleInTarget(circle1, target2, 15, 15)) {
			if (circle1.x === target2.x + 6 && circle1.y === target2.y + 4) {
				startAction("down", "circle2", button1target2IntervalRef)
				console.log("moved circle1")
			} else {
				if (button1target2IntervalRef.current)
					stopAction(button1target2IntervalRef)
			}
		}
	}, [circle1, circle1.x, circle1.y, startAction, target2])

	useEffect(() => {}, [circle2, circle2.x, circle2.y, target])

	const handleActions = (direction: Direction, circle: Circles) => {
		const setCircle = {
			circle1: setCircle1,
			circle2: setCircle2,
			circle3: setCircle3,
		}[circle]
		const moveCircle = (prevPosition: { x: number; y: number }) => {
			let newX = prevPosition.x
			let newY = prevPosition.y

			switch (direction) {
				case "up":
					newY = newY !== 1 ? newY - 1 : 18
					break
				case "down":
					newY = (newY + 1) % 18
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
		}
		setCircle(prevPosition => moveCircle(prevPosition))
	}

	const isCircleInTarget = (
		circle: { x: number; y: number },
		target: { x: number; y: number },
		targetWidth: number,
		targetHeight: number,
	) => {
		// Check if the circle is within the horizontal bounds of the target box
		const overlapsHorizontally =
			circle.x >= target.x && circle.x <= target.x + targetWidth
		// Check if the circle is within the vertical bounds of the target box
		const overlapsVertically =
			circle.y >= target.y && circle.y <= target.y + targetHeight

		return overlapsHorizontally && overlapsVertically
	}
	return (
		<main className="flex min-h-screen flex-col items-center justify-center m-auto">
			<div className="game">
				<div className="game-board flex items-center flex-col gap-4	">
					<Board
						target={target3}
						activeButton={activeButton}
						handleActions={handleActions}
						setActiveButton={setActiveButton}
						circle={circle3}
						circleToMove={null}
						id="Target3"
					/>
					<Board
						target={target2}
						activeButton={activeButton}
						handleActions={handleActions}
						setActiveButton={setActiveButton}
						circle={circle2}
						circleToMove="circle3"
						id="Target2"
					/>
					<Board
						target={target}
						activeButton={activeButton}
						handleActions={handleActions}
						setActiveButton={setActiveButton}
						circle={circle1}
						circleToMove="circle2"
						id="Target1"
					/>

					<ButtonContainer
						activeButton={activeButton}
						handleActions={handleActions}
						setActiveButton={setActiveButton}
						circleToMove="circle1"
						id="Target"
					/>

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

function Board({
	target,
	activeButton,
	handleActions,
	setActiveButton,
	circle,
	circleToMove,
	id,
}: {
	target: { x: number; y: number }
	activeButton: string
	handleActions: (direction: Direction, circle: Circles) => void
	setActiveButton: Dispatch<SetStateAction<string>>
	circle: { x: number; y: number }
	circleToMove: Circles | null
	id: Targets
}) {
	return (
		<div className="grid grid-cols-80 grid-rows-20  bg-slate-300 rounded-lg ">
			<ButtonContainer
				target={target}
				activeButton={activeButton}
				handleActions={handleActions}
				setActiveButton={setActiveButton}
				circleToMove={circleToMove}
				id={id}
			/>

			<Circle circle={circle} id={id} />
		</div>
	)
}

function Circle({
	circle,
	id,
}: {
	circle: { x: number; y: number }
	id: Targets
}) {
	const circleRef = useRef<HTMLDivElement | null>(null)
	const action = useStoreActions(actions => actions.setCircle)
	useEffect(() => {
		if (circleRef.current) {
			console.log(circleRef.current)
			const { x, y, width, height } = circleRef.current.getBoundingClientRect()
			action({ circle: { x, y, width, height }, target: id })
		}
	}, [action, circle, id])
	return (
		<div
			ref={circleRef}
			key={1}
			className="canvas bg-red-400 h-[25px] w-[25px] rounded-full transition-transform duration-300 ease-in-out transform "
			style={{
				gridArea: `${circle.y} / ${circle.x} / ${circle.y + 1} / ${
					circle.x + 1
				}`,
			}}
		></div>
	)
}

function ButtonContainer({
	target,
	activeButton,
	handleActions,
	setActiveButton,
	circleToMove,
	id,
}: {
	target?: { x: number; y: number }
	activeButton: string
	handleActions: (direction: Direction, circle: Circles) => void
	setActiveButton: Dispatch<SetStateAction<string>>
	circleToMove: Circles | null
	id: Targets
}) {
	const buttonContainerRef = useRef<HTMLDivElement | null>(null)
	const action = useStoreActions(actions => actions.setValue)
	const value = useStoreState(state => state[id])

	useEffect(() => {
		if (buttonContainerRef.current) {
			const buttonContainerPosition =
				buttonContainerRef.current.getBoundingClientRect()

			action({
				value: {
					x: buttonContainerPosition.x,
					y: buttonContainerPosition.y,
					width: buttonContainerPosition.width,
					height: buttonContainerPosition.height,
				},
				target: id,
			})
		}
	}, [])
	return (
		<div
			key={0}
			ref={buttonContainerRef}
			className="canvas bg-blue-200 h-[150px] w-[150px] rounded-lg transition-transform duration-300 ease-in-out transform flex items-center justify-center"
			style={{
				gridArea: target
					? `${target.y} / ${target.x} / ${target.y + 1} / ${target.x + 1}`
					: "",
			}}
		>
			{circleToMove && (
				<div className="grid grid-rows-2 grid-cols-3 gap-2 w-max">
					{directions.map(dir => (
						<ButtonIcon
							key={dir}
							direction={dir}
							active={activeButton === dir}
							handleActions={handleActions}
							setActiveButton={setActiveButton}
							circle={circleToMove}
							id={id}
						/>
					))}
				</div>
			)}
		</div>
	)
}

function ButtonIcon({
	direction,
	active,
	handleActions,
	className,
	setActiveButton,
	circle,
	id,
}: {
	direction: Direction
	active?: boolean
	handleActions: Function
	className?: string
	setActiveButton: React.Dispatch<React.SetStateAction<string>>
	circle: Circles
	id: Targets
}) {
	const actionName = `set${
		direction.charAt(0).toUpperCase() + direction.slice(1)
	}` as ActionName
	const action = useStoreActions(actions => actions[actionName])
	const actionIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const buttonRef = useRef<HTMLButtonElement | null>(null)

	useEffect(() => {
		if (!buttonRef.current) return
		const buttonPosition = buttonRef.current.getBoundingClientRect()
		const payload: CoordinatesPayload = {
			...initialTarget,
			target: id,
			[direction]: {
				x: buttonPosition.x,
				y: buttonPosition.y,
				width: buttonPosition.width,
				height: buttonPosition.height,
			},
		}
		action(payload)
		return () => {
			if (actionIntervalRef.current) {
				setActiveButton("")
				clearInterval(actionIntervalRef.current)
				actionIntervalRef.current = null
			}
		}
	}, [])

	const startAction = () => {
		handleActions(direction, circle)
		if (!actionIntervalRef.current) {
			actionIntervalRef.current = setInterval(() => {
				handleActions(direction, circle)
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
			ref={buttonRef}
			data-direction={direction}
			name={circle}
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
