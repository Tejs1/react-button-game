"use client"
import { StoreProvider } from "easy-peasy"
import App from "@/app/App"
import { store } from "@/lib/store"

export default function Home() {
	return (
		<StoreProvider store={store}>
			<App />
		</StoreProvider>
	)
}
