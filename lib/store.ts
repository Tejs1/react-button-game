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
export type Coordinates = {
	x: number
	y: number
	width: number
	height: number
}
export type Targets = "Target" | "Target1" | "Target2" | "Target3"

export interface BaseCoordinates {
	up: Coordinates
	down: Coordinates
	left: Coordinates
	right: Coordinates
	value: Coordinates
	circle: Coordinates
}

export interface Target extends BaseCoordinates {}
export type CoordinatesPayload = BaseCoordinates & { target: Targets }
export type setUpProps = { up: Coordinates; target: Targets }
export type setDownProps = { down: Coordinates; target: Targets }
export type setLeftProps = { left: Coordinates; target: Targets }
export type setRightProps = { right: Coordinates; target: Targets }
export type setValuesProps = { value: Coordinates; target: Targets }
export type setCircleProps = { circle: Coordinates; target: Targets }

export type StoreModel = Record<Targets, Target> & {
	setUp: Action<StoreModel, setUpProps>
	setDown: Action<StoreModel, setDownProps>
	setLeft: Action<StoreModel, setLeftProps>
	setRight: Action<StoreModel, setRightProps>
	setValue: Action<StoreModel, setValuesProps>
	setCircle: Action<StoreModel, setCircleProps>
}

export const initialCoordinates: Coordinates = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
}

export const initialTarget: Target = {
	value: initialCoordinates,
	up: initialCoordinates,
	down: initialCoordinates,
	left: initialCoordinates,
	right: initialCoordinates,
	circle: initialCoordinates,
}

const store = createStore<StoreModel>({
	Target: initialTarget,
	Target1: initialTarget,
	Target2: initialTarget,
	Target3: initialTarget,
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
	setCircle: action((state, payload) => {
		state[payload.target].circle = payload.circle
	}),
})

const { useStoreActions, useStoreState, useStoreDispatch, useStore } =
	createTypedHooks<StoreModel>()

// eslint-disable-next-line import/no-anonymous-default-export
export { useStoreActions, useStoreState, useStoreDispatch, useStore, store }
