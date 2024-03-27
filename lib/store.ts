import {
	action,
	Action,
	createStore,
	createTypedHooks,
	Computed,
	computed,
} from "easy-peasy"
import { off } from "process"
import {} from "easy-peasy" // Add this import

export type Direction = "up" | "down" | "left" | "right"
export type ActionName = "setUp" | "setDown" | "setLeft" | "setRight"
export type Coordinates = { x: number; y: number }
export type Targets = "Target" | "Target1" | "Target2" | "Target3"

export interface BaseCoordinates {
	up: Coordinates
	down: Coordinates
	left: Coordinates
	right: Coordinates
	value: Coordinates
}
export interface TargetOffset extends BaseCoordinates {
	upOffset: Coordinates
	downOffset: Coordinates
	leftOffset: Coordinates
	rightOffset: Coordinates
}
export interface Target extends BaseCoordinates {}
export type CoordinatesPayload = BaseCoordinates & { target: Targets }
export type setUpProps = { up: Coordinates; target: Targets }
export type setDownProps = { down: Coordinates; target: Targets }
export type setLeftProps = { left: Coordinates; target: Targets }
export type setRightProps = { right: Coordinates; target: Targets }
export type setValuesProps = { value: Coordinates; target: Targets }

export type StoreModel = Record<Targets, TargetOffset> & {
	setUp: Action<StoreModel, setUpProps>
	setDown: Action<StoreModel, setDownProps>
	setLeft: Action<StoreModel, setLeftProps>
	setRight: Action<StoreModel, setRightProps>
	setValue: Action<StoreModel, setValuesProps>
	setDirection: Action<StoreModel, CoordinatesPayload>
	setAllOffsets: Action<StoreModel>
}

export const initialCoordinates: Coordinates = { x: 0, y: 0 }
const getOffset = (target: Target, direction: Direction): Coordinates => {
	if (!direction) return initialCoordinates
	if (!target) return initialCoordinates
	if (!target.value) return initialCoordinates
	return {
		x: target[direction].x - target.value.x,
		y: target[direction].y - target.value.y,
	}
}
export const initialTarget: Target = {
	value: initialCoordinates,
	up: initialCoordinates,
	down: initialCoordinates,
	left: initialCoordinates,
	right: initialCoordinates,
}
export const initialTargetOffset: TargetOffset = {
	...initialTarget,
	upOffset: initialCoordinates,
	downOffset: initialCoordinates,
	leftOffset: initialCoordinates,
	rightOffset: initialCoordinates,
}

const store = createStore<StoreModel>({
	Target: {
		...initialTargetOffset,
	},
	Target1: initialTargetOffset,
	Target2: initialTargetOffset,
	Target3: initialTargetOffset,
	setUp: action((state, payload) => {
		state[payload.target].up = payload.up
	}),
	setDown: action((state, payload) => {
		state[payload.target].down = payload.down
	}),
	setLeft: action((state, payload) => {
		state[payload.target].left = payload.left
	}),
	setRight: action((state, payload) => {
		state[payload.target].right = payload.right
	}),
	setValue: action((state, payload) => {
		state[payload.target].value = payload.value
	}),
	setDirection: action((state, payload) => {
		state[payload.target].up = payload.up
		state[payload.target].down = payload.down
		state[payload.target].left = payload.left
		state[payload.target].right = payload.right
	}),

	setAllOffsets: action(state => {
		const allTargets: Targets[] = ["Target", "Target1", "Target2", "Target3"]
		allTargets.forEach(key => {
			state[key].upOffset = getOffset(state[key], "up")
			state[key].downOffset = getOffset(state[key], "down")
			state[key].leftOffset = getOffset(state[key], "left")
			state[key].rightOffset = getOffset(state[key], "right")
		})
	}),
})

const { useStoreActions, useStoreState, useStoreDispatch, useStore } =
	createTypedHooks<StoreModel>()

// eslint-disable-next-line import/no-anonymous-default-export
export { useStoreActions, useStoreState, useStoreDispatch, useStore, store }
