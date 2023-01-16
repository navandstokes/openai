"use client"

import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"

export default function Page() {
    const { register, handleSubmit } = useForm()
    const [result, setResult] = useState("")

    const onSubmit = useCallback(async (data) => {
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            const res = await response.json()
            if (response.status !== 200) {
                throw (
                    res.error ||
                    new Error(`Request failed with status ${response.status}`)
                )
            }

            setResult(res.result)
        } catch (error) {
            console.error(error)
            alert(error.message)
        }
    }, [])

    const handleKeyDown = useCallback(() => {}, [])

    return (
        <div className="max-w-screen-md mx-auto flex flex-col gap-4 p-6 py-20 lg:pt-64 min-h-screen">
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                <input
                    className="block p-3 px-4 rounded-md bg-white/[.02] focus:bg-white/5 text-neutral-400 focus:ring-4 focus:outline-0 focus:ring-neutral-700 transition-all"
                    {...register("prompt")}
                />
                <button className="hidden" type="submit">
                    Submit
                </button>
            </form>
            {result && (
                <p className="p-3 px-4 rounded-md bg-white/[.02]">{result}</p>
            )}
        </div>
    )
}
