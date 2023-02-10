import { useCallback } from "react"
import cn from "classnames"

export const Tabs = ({ tabs, selected, setSelected, className }) => {
	return (
		<nav
			className={cn(
				"overflow-hidden divide-x-2 divide-white/[.01] inline-flex",
				className
			)}
		>
			{tabs.map((tab) => (
				<Tab
					key={tab.title}
					{...tab}
					selected={selected}
					setSelected={setSelected}
				/>
			))}
		</nav>
	)
}

const Tab = ({ title, value, selected, setSelected, handleClick }) => {
	const handleState = useCallback(() => {
		if (handleClick) {
			handleClick()
		} else {
			setSelected(value)
		}
	}, [handleClick, value, setSelected])

	return (
		value !== false && (
			<button
				onClick={handleState}
				className={cn(
					"first:rounded-l-full last:rounded-r-full first:pl-6 last:pr-6 px-4 font-semibold leading-loose -m-px py-2 transition-colors",
					{
						"bg-white/5 cursor-default": value == selected,
						"opacity-50 hover:opacity-100 bg-white/[.02]":
							value != selected,
					}
				)}
				type="button"
			>
				{title}
			</button>
		)
	)
}
