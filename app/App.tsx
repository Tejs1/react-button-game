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
	Target,
	store as Store,
} from "@/lib/store"

import {
	ChevronRightIcon,
	ChevronLeftIcon,
	ChevronUpIcon,
	ChevronDownIcon,
} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const directions = ["up", "left", "down", "right"] as const
type Circles = "circle1" | "circle2" | "circle3"
type Direction = (typeof directions)[number]

export default function App() {
	const [activeButton, setActiveButton] = useState("")
	const [active, setActive] = useState(false)
	const [circle1, setCircle1] = useState({ x: 0, y: 0 })
	const [circle2, setCircle2] = useState({ x: 0, y: 0 })
	const [circle3, setCircle3] = useState({ x: 0, y: 0 })
	const [target1, setTarget1] = useState({ x: 0, y: 0 })
	const [target2, setTarget2] = useState({ x: 0, y: 0 })
	const [target3, setTarget3] = useState({ x: 50, y: 0 })
	const upTargetIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const downTargetIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const leftTargetIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const rightTargetIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const upTarget2IntervalRef = useRef<NodeJS.Timeout | null>(null)
	const downTarget2IntervalRef = useRef<NodeJS.Timeout | null>(null)
	const leftTarget2IntervalRef = useRef<NodeJS.Timeout | null>(null)
	const rightTarget2IntervalRef = useRef<NodeJS.Timeout | null>(null)
	// const store = Store.getState()
	function generateCoordinates(circle: Circles) {
		const store = Store.getState()

		const setCircle = {
			circle1: setCircle1,
			circle2: setCircle2,
			circle3: setCircle3,
		}[circle]

		const setTarget = {
			circle1: setTarget1,
			circle2: setTarget2,
			circle3: setTarget3,
		}[circle]

		const target = {
			circle1: "Target1",
			circle2: "Target2",
			circle3: "Target3",
		}[circle]

		const targetStore = store[target as keyof typeof store]

		const { height, width } = targetStore.boardDimentions
		const { height: circleHeight, width: circleWidth } = targetStore.circle
		const { height: targetHeight, width: targetWidth } = targetStore.value

		// Generate random coordinates for circle within the board
		const circleX = Math.random() * (width - circleWidth)
		const circleY = Math.random() * (height - circleHeight)

		let targetX, targetY
		const minSeparation = 60
		// Ensure the target does not overlap or get too close to the circle
		do {
			targetX = Math.random() * (width - targetWidth)
			targetY = Math.random() * (height - targetHeight)
		} while (
			circleX < targetX + targetWidth + minSeparation &&
			circleX + circleWidth + minSeparation > targetX &&
			circleY < targetY + targetHeight + minSeparation &&
			circleY + circleHeight + minSeparation > targetY
		)

		setCircle({ x: circleX, y: circleY })
		setTarget({ x: targetX, y: targetY })
	}

	const getDirection = useCallback(
		(containerName: Targets) => {
			const store = Store.getState()
			const target = store[containerName]
			const { up, down, left, right, circle } = target
			const { width: circleW, height: circleH } = circle
			const { x: upX, y: upY, width: upW, height: upH } = up
			const { x: downX, y: downY, width: downW, height: downH } = down
			const { x: leftX, y: leftY, width: leftW, height: leftH } = left
			const { x: rightX, y: rightY, width: rightW, height: rightH } = right
			const { x: circleX, y: circleY } = {
				Target1: circle1,
				Target2: circle2,
				Target3: circle3,
				Target: circle1,
			}[containerName]
			const Container = {
				Target1: target1,
				Target2: target2,
				Target3: target3,
				Target: target1,
			}[containerName]

			if (
				circleX >= upX + Container.x &&
				circleX + circleW <= upX + upW + Container.x &&
				circleY >= upY + Container.y &&
				circleY + circleH <= upY + upH + Container.y
			) {
				return "up"
			}
			if (
				circleX >= downX + Container.x &&
				circleX + circleW <= downX + downW + Container.x &&
				circleY >= downY + Container.y &&
				circleY + circleH <= downY + downH + Container.y
			) {
				return "down"
			}
			if (
				circleX >= leftX + Container.x &&
				circleX + circleW <= leftX + leftW + Container.x &&
				circleY >= leftY + Container.y &&
				circleY + circleH <= leftY + leftH + Container.y
			) {
				return "left"
			}
			if (
				circleX >= rightX + Container.x &&
				circleX + circleW <= rightX + rightW + Container.x &&
				circleY >= rightY + Container.y &&
				circleY + circleH <= rightY + rightH + Container.y
			) {
				return "right"
			}
			return false
		},
		[circle1, circle2, circle3, target1, target2, target3],
	)
	const handleActions = useCallback((direction: Direction, circle: Circles) => {
		const store = Store.getState()

		const setCircle = {
			circle1: setCircle1,
			circle2: setCircle2,
			circle3: setCircle3,
		}[circle]

		const target = {
			circle1: "Target1",
			circle2: "Target2",
			circle3: "Target3",
		}[circle]
		const targetStore = store[target as keyof typeof store]
		const moveCircle = (prevPosition: { x: number; y: number }) => {
			const { height, width } = targetStore.boardDimentions
			const { height: circleHeight, width: circleWidth } = targetStore.circle
			let newX = prevPosition.x
			let newY = prevPosition.y

			switch (direction) {
				case "up":
					newY = newY > 10 ? newY - 10 : height - circleHeight
					break
				case "down":
					newY = newY + circleHeight < height ? newY + 10 : 0
					break
				case "left":
					newX = newX > 10 ? newX - 10 : width - circleWidth
					break
				case "right":
					newX = newX + circleWidth < width ? newX + 10 : 0
					break
				default:
					break
			}

			return { x: newX, y: newY }
		}
		setCircle(prevPosition => moveCircle(prevPosition))
	}, [])
	const startAction = useCallback(
		(
			direction: Direction,
			circle: Circles,
			actionIntervalRef: MutableRefObject<NodeJS.Timeout | null>,
		) => {
			if (!actionIntervalRef.current) {
				actionIntervalRef.current = setInterval(() => {
					console.log("running")
					handleActions(direction, circle)
				}, 250)
			}
		},
		[handleActions],
	)
	const stopAction = (actionIntervalRef: {
		current: NodeJS.Timeout | null
	}) => {
		if (actionIntervalRef.current) {
			setActiveButton("")
			clearInterval(actionIntervalRef.current)
			actionIntervalRef.current = null
		}
	}
	const isCircleInTarget = useCallback(
		(containerName: Targets) => {
			const store = Store.getState()
			const { width, height } = store[containerName].value
			const { width: circleW, height: circleH } = store[containerName].circle
			const ContainerOffset = {
				Target1: target1,
				Target2: target2,
				Target3: target3,
				Target: target1,
			}[containerName]

			const CircleOffset = {
				Target1: circle1,
				Target2: circle2,
				Target3: circle3,
				Target: circle1,
			}[containerName]

			if (!width || !height || !circleW || !circleH) return false
			return (
				CircleOffset.x >= ContainerOffset.x &&
				CircleOffset.x + circleW <= ContainerOffset.x + width &&
				CircleOffset.y >= ContainerOffset.y &&
				CircleOffset.y + circleH <= ContainerOffset.y + height
			)
		},
		[circle1, circle2, circle3, target1, target2, target3],
	)

	useEffect(() => {
		generateCoordinates("circle1")
		generateCoordinates("circle2")
		generateCoordinates("circle3")

		const handleKeyDown = (e: KeyboardEvent) => {
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
			if (e.key === "ArrowUp" || e.key === "ArrowDown") {
				e.preventDefault()
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
	}, [handleActions])

	useEffect(() => {
		if (!isCircleInTarget("Target1")) return
		if (!getDirection("Target1")) {
			stopAction(upTargetIntervalRef)
			stopAction(downTargetIntervalRef)
			stopAction(leftTargetIntervalRef)
			stopAction(rightTargetIntervalRef)
		}
		if (getDirection("Target1") === "up") {
			startAction("up", "circle2", upTargetIntervalRef)
		}
		if (getDirection("Target1") === "down") {
			startAction("down", "circle2", downTargetIntervalRef)
		}
		if (getDirection("Target1") === "left") {
			startAction("left", "circle2", leftTargetIntervalRef)
		}
		if (getDirection("Target1") === "right") {
			startAction("right", "circle2", rightTargetIntervalRef)
		}
	}, [getDirection, startAction, circle1, isCircleInTarget])

	useEffect(() => {
		if (!isCircleInTarget("Target2")) return
		if (!getDirection("Target2")) {
			stopAction(upTarget2IntervalRef)
			stopAction(downTarget2IntervalRef)
			stopAction(leftTarget2IntervalRef)
			stopAction(rightTarget2IntervalRef)
		}
		if (getDirection("Target2") === "up") {
			startAction("up", "circle3", upTarget2IntervalRef)
		}
		if (getDirection("Target2") === "down") {
			startAction("down", "circle3", downTarget2IntervalRef)
		}
		if (getDirection("Target2") === "left") {
			startAction("left", "circle3", leftTarget2IntervalRef)
		}
		if (getDirection("Target2") === "right") {
			startAction("right", "circle3", rightTarget2IntervalRef)
		}
	}, [getDirection, startAction, circle2, isCircleInTarget])

	useEffect(() => {
		if (isCircleInTarget("Target3")) {
			setActive(true)
			stopAction(upTargetIntervalRef)
			stopAction(downTargetIntervalRef)
			stopAction(leftTargetIntervalRef)
			stopAction(rightTargetIntervalRef)
			stopAction(upTarget2IntervalRef)
			stopAction(downTarget2IntervalRef)
			stopAction(leftTarget2IntervalRef)
			stopAction(rightTarget2IntervalRef)
		}
	}, [circle3, isCircleInTarget])

	const handleReset = () => {
		generateCoordinates("circle1")
		generateCoordinates("circle2")
		generateCoordinates("circle3")
		setActive(false)
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center w-full">
			<AlertDialog open={active} onOpenChange={handleReset}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Congratulations !!! You have succeeded.
						</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<div className="gameArea  w-full h-full grid grid-rows-layout justify-items-center gap-4">
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
					target={target1}
					activeButton={activeButton}
					handleActions={handleActions}
					setActiveButton={setActiveButton}
					circle={circle1}
					circleToMove="circle2"
					id="Target1"
				/>
				<Board
					target={null}
					activeButton={activeButton}
					handleActions={handleActions}
					setActiveButton={setActiveButton}
					circleToMove="circle1"
					id="Target"
				/>
			</div>
			<div className="controller">
				<button>Start</button>
				<button>Pause</button>
				<button>Reset</button>
			</div>
			<div className="game-info">
				<div></div>
				<ol></ol>
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
	target: { x: number; y: number } | null
	activeButton: string
	handleActions: (direction: Direction, circle: Circles) => void
	setActiveButton: Dispatch<SetStateAction<string>>
	circle?: { x: number; y: number }
	circleToMove: Circles | null
	id: Targets
}) {
	const BoardRef = useRef<HTMLDivElement | null>(null)
	const action = useStoreActions(actions => actions.setBoardDimentions)
	useEffect(() => {
		if (BoardRef.current) {
			const { x, y, width, height } = BoardRef.current.getBoundingClientRect()
			action({ dimentions: { x, y, width, height }, target: id })
		}
	}, [action, id])
	return (
		<div
			ref={BoardRef}
			className={
				"w-4/5 rounded-lg relative " +
				`${circle ? "h-56 bg-slate-300" : "h-full flex justify-center"}`
			}
		>
			<ButtonContainer
				target={target}
				activeButton={activeButton}
				handleActions={handleActions}
				setActiveButton={setActiveButton}
				circleToMove={circleToMove}
				id={id}
			/>
			{circle && <Circle circle={circle} id={id} />}
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
			const { x, y, width, height } = circleRef.current.getBoundingClientRect()
			// offset
			const topOffset = circleRef.current.offsetTop
			const leftOffset = circleRef.current.offsetLeft

			action({
				circle: { x, y, width, height },
				target: id,
			})
		}
	}, [action, circle, id])
	return (
		<div
			ref={circleRef}
			key={1}
			className="absolute top-0 left-0 canvas bg-red-400 h-[24px] w-[24px] rounded-full transition-transform duration-300 ease-in-out transform "
			style={{
				transform: `translate(${circle.x}px, ${circle.y}px)`,
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
	target: { x: number; y: number } | null
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
			const offsetTop = buttonContainerRef.current.offsetTop
			const offsetLeft = buttonContainerRef.current.offsetLeft

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
	}, [action, id])
	const translateX = target?.x || 0
	const translateY = target?.y || 0
	return (
		<div
			key={0}
			ref={buttonContainerRef}
			className={`${(target && circleToMove) || "bg-blue-200 border border-2"} h-[150px] w-[150px] rounded-lg transition-transform duration-300 ease-in-out transform flex items-center justify-center`}
			style={{
				transform: `translate(${translateX}px, ${translateY}px)`,
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
		const offsetTop = buttonRef.current.offsetTop
		const offsetLeft = buttonRef.current.offsetLeft

		const payload: CoordinatesPayload = {
			...initialTarget,
			target: id,
			[direction]: {
				x: offsetLeft,
				y: offsetTop,
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
	}, [action, direction, id, setActiveButton])

	const startAction = useCallback(() => {
		handleActions(direction, circle)
		if (!actionIntervalRef.current) {
			actionIntervalRef.current = setInterval(() => {
				handleActions(direction, circle)
			}, 250)
		}
	}, [])

	const stopAction = useCallback(() => {
		if (actionIntervalRef.current) {
			setActiveButton("")
			clearInterval(actionIntervalRef.current)
			actionIntervalRef.current = null
		}
	}, [])
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
