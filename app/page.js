"use client"

import { useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { Loader } from "components/Loader"

export default function Page() {
    const { register, handleSubmit } = useForm()
    const [result, setResult] = useState("")
    const [status, setStatus] = useState({ loading: false, message: "" })

    const onSubmit = useCallback(async (data) => {
        setStatus((prev) => ({ ...prev, loading: true }))
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
            setStatus((prev) => ({ ...prev, loading: false }))
        } catch (error) {
            console.error(error)
            setStatus((prev) => ({ ...prev, loading: false }))
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
            <div className="p-3 px-4 rounded-md bg-white/[.02]">
                {status?.loading ? <Loader /> : result ? <p>{result}</p> : null}
            </div>
        </div>
    )
}
