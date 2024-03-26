import { action, Action, createStore, createTypedHooks } from "easy-peasy"

export type Direction = "up" | "down" | "left" | "right"
export type Coordinates = { x: number; y: number } | null
export type Targets = "Target1" | "Target2" | "Target3"

export interface BaseCoordinates {
	up: Coordinates
	down: Coordinates
	left: Coordinates
	right: Coordinates
	value: Coordinates
}
export interface Target extends BaseCoordinates {}
export type CoordinatesPayload = BaseCoordinates & { target: Targets }
export interface setProps {
	state: StoreModel
	payload: { up: Coordinates; target: Targets }
}
export type StoreModel = Record<Targets, Target> & {
	setUp: Action<StoreModel, CoordinatesPayload>
	setDown: Action<StoreModel, CoordinatesPayload>
	setLeft: Action<StoreModel, CoordinatesPayload>
	setRight: Action<StoreModel, CoordinatesPayload>
	setValue: Action<StoreModel, CoordinatesPayload>
}

export const initialCoordinates: Coordinates = { x: 0, y: 0 }
export const initialTarget: Target = {
	value: initialCoordinates,
	up: initialCoordinates,
	down: initialCoordinates,
	left: initialCoordinates,
	right: initialCoordinates,
}

export const store = createStore<StoreModel>({
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
})

const { useStoreActions, useStoreState, useStoreDispatch, useStore } =
	createTypedHooks<StoreModel>()

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	useStoreActions,
	useStoreState,
	useStoreDispatch,
	useStore,
}
