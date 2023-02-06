import { useCallback, useRef } from "react"
import cn from "classnames"
import Link from "next/link"

export const Input = ({
	name,
	title,
	helpText,
	helpTextBottom,
	helpLink,
	helpLinkText,
	register,
	className,
	error,
	errors,
	start,
	end,
	style,
	required,
	options,
	doNotShowRequired,
	type,
	...rest
}) => {
	const inputRef = useRef(null)
	const classes =
		"block w-full p-3 px-4 rounded-md bg-white/[.02] focus:bg-white/5 text-neutral-400 focus:ring-4 focus:outline-0 focus:ring-neutral-700 transition-all"

	const { ref, ...restRegister } = register
		? register(name, { ...required, ...options })
		: { ref: null }
	const handleWheel = useCallback(() => {
		if (inputRef?.current) {
			inputRef.current.blur()
		}
	}, [inputRef])
	const handleRef = useCallback(
		(e) => {
			if (register) {
				ref(e)
				inputRef.current = e
			}
		},
		[ref, register]
	)
	return (
		<div style={style} className={cn("relative", className)}>
			{title && (
				<label htmlFor={name} className="block mb-1">
					<span className="text-xs uppercase">{title}</span>
					{required && !doNotShowRequired && (
						<span className="inline-block ml-2 text-xs italic opacity-40">
							(Required)
						</span>
					)}
				</label>
			)}
			{helpText && (
				<span className="block my-2 opacity-40 text-sm italic">
					{helpText}
				</span>
			)}
			<div className="relative group">
				{start && (
					<div className="absolute h-full bottom-0 left-3.5 flex items-center">
						{start}
					</div>
				)}
				{end && (
					<div className="absolute h-full bottom-0 right-3.5 flex items-center">
						{end}
					</div>
				)}
				<input
					ref={handleRef}
					id={name}
					name={name}
					{...restRegister}
					className={cn(classes, { "pl-10": start })}
					onWheel={type == "number" ? handleWheel : null}
					type={type}
					{...rest}
				/>
				{helpTextBottom && !error && (
					<span className="h-0 invisible peer-focus:h-auto peer-focus:visible transition-all block my-0 peer-focus:my-2 text-gray-400 dark:text-gray-500 text-xs italic">
						{helpTextBottom}
					</span>
				)}
			</div>
			{helpLink && (
				<Link
					href={helpLink}
					className="absolute top-0 right-0 inline-block text-xs text-purple-700 dark:text-purple-600 py-1"
				>
					{helpLinkText ? helpLinkText : "Need help?"}
				</Link>
			)}
			{(error || errors) && (
				<span className="text-red-600 dark:text-red-700 font-medium block mt-2">
					{error?.message || errors[name]?.message}
				</span>
			)}
		</div>
	)
}

export const SimpleInput = ({
	name,
	type,
	placeholder,
	register,
	className,
	containerClassName,
}) => {
	return (
		<div className={containerClassName}>
			<style jsx>
				{`
					input::placeholder {
						color: inherit;
						opacity: 70%;
					}
				`}
			</style>
			<input
				id={name}
				name={name}
				type={type}
				placeholder={placeholder}
				className={className}
				{...register}
			/>
		</div>
	)
}
