"use client"

import { useState, useCallback } from "react"
import cn from "classnames"
import { useForm } from "react-hook-form"
import { Input } from "components/Input"
import { Tabs } from "components/Tabs"
import { Loader } from "components/Loader"

export default function Page() {
    const { register, handleSubmit } = useForm()
    const [type, setType] = useState("text")
    const [status, setStatus] = useState({ loading: false, result: "" })

    const onSubmit = useCallback(
        async (data) => {
            setStatus((prev) => ({ ...prev, loading: true }))
            try {
                const model = type == "code" ? "code-davinci-002" : null
                const response = await fetch(
                    type == "image" ? "/api/image" : "/api/generate",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ model, ...data }),
                    }
                )
                const res = await response.json()
                if (response.status !== 200) {
                    throw (
                        res.error ||
                        new Error(
                            `Request failed with status ${response.status}`
                        )
                    )
                }

                setStatus((prev) => ({
                    ...prev,
                    loading: false,
                    result: res.result,
                }))
            } catch (error) {
                console.error(error)
                setStatus((prev) => ({ ...prev, loading: false }))
                alert(error.message)
            }
        },
        [type]
    )

    const clearResult = useCallback(() => {
        setStatus((prev) => ({ ...prev, result: "" }))
    }, [])

    return (
        <div className="max-w-screen-md mx-auto flex flex-col gap-4 p-6 py-20 lg:pt-64 min-h-screen">
            <Tabs
                tabs={[
                    { title: "Text", value: "text", handleClick: clearResult },
                    { title: "Code", value: "code", handleClick: clearResult },
                    {
                        title: "Image",
                        value: "image",
                        handleClick: clearResult,
                    },
                ]}
                selected={type}
                setSelected={setType}
            />
            <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmit(onSubmit)}
            >
                {(type == "text" || type == "code") && (
                    <div className="flex gap-2">
                        <Input
                            name="max_tokens"
                            title="max_tokens"
                            register={register}
                            className="grow"
                            defaultValue={150}
                            type="number"
                        />
                        <Input
                            name="temperature"
                            title="temperature"
                            register={register}
                            className="grow"
                            defaultValue={0.3}
                            step="0.1"
                            type="number"
                        />
                        <Input
                            name="top_p"
                            title="top_p"
                            register={register}
                            className="grow"
                            defaultValue={1.0}
                            type="number"
                        />
                    </div>
                )}
                {type == "image" && (
                    <div className="flex gap-2">
                        <Input
                            name="n"
                            title="n"
                            register={register}
                            className="grow"
                            defaultValue={1}
                            type="number"
                        />
                        <Input
                            name="size"
                            title="size"
                            register={register}
                            className="grow"
                            defaultValue="256x256"
                        />
                    </div>
                )}
                <textarea
                    name="prompt"
                    className="block w-full p-3 px-4 rounded-md bg-white/[.02] focus:bg-white/5 text-neutral-400 focus:ring-4 focus:outline-0 focus:ring-neutral-700 transition-all"
                    {...register("prompt")}
                />
                {/*<Input name="prompt" register={register} />*/}
                <button
                    type="submit"
                    className="block w-full p-3 px-4 rounded-md bg-white/[.02] focus:bg-white/5 text-neutral-400 focus:ring-4 focus:outline-0 focus:ring-neutral-700 transition-all"
                >
                    Submit
                </button>
            </form>{" "}
            <div
                className={cn("p-3 px-4 rounded-md bg-white/[.02]", {
                    hidden: !status.loading && !status.result,
                })}
            >
                {status?.loading ? (
                    <Loader />
                ) : status?.result ? (
                    type == "image" && typeof status.result == "object" ? (
                        <div className="grid auto-cols-auto grid-flow-col">
                            {status.result.map((i) => (
                                <img src={i?.url} key={i.url} />
                            ))}
                        </div>
                    ) : (
                        <p className="whitespace-pre-line">{status?.result}</p>
                    )
                ) : null}
            </div>
        </div>
    )
}
