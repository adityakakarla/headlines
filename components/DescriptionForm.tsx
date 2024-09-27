import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { generateHeadlines } from "@/app/actions"
import { LoadingSpinner } from "./ui/spinner"

interface DescriptionFormProps {
    setHeadlines: (headlines: string[]) => void
}

const formSchema = z.object({
    description: z.string().min(1, { message: "Blog info is required" }).max(500, { message: "Description is too long" }),
    customHeadline1: z.string().optional(),
    customHeadline2: z.string().optional(),
    customHeadline3: z.string().optional(),
    customHeadline4: z.string().optional(),
    customHeadline5: z.string().optional(),
})

export default function DescriptionForm({ setHeadlines }: DescriptionFormProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [customHeadlinesVisible, setCustomHeadlinesVisible] = useState<boolean[]>([false, false, false, false, false]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            customHeadline1: "",
            customHeadline2: "",
            customHeadline3: "",
            customHeadline4: "",
            customHeadline5: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true)
            const customHeadlines = [values.customHeadline1, values.customHeadline2, values.customHeadline3, values.customHeadline4, values.customHeadline5] as string[]
            const headlines = await generateHeadlines(values.description, customHeadlines)
            setHeadlines(headlines)
        } catch (err: any) {
            form.setError('description', {type: 'manual', message: err.message})
        } finally {
            setLoading(false)
        }
        
    }

    const customHeadlineFields = [
        "customHeadline1",
        "customHeadline2",
        "customHeadline3",
        "customHeadline4",
        "customHeadline5",
    ] as const;

    const addCustomHeadline = () => {
        const nextIndex = customHeadlinesVisible.indexOf(false);
        if (nextIndex !== -1) {
            const newVisibility = [...customHeadlinesVisible];
            newVisibility[nextIndex] = true;
            setCustomHeadlinesVisible(newVisibility);
        }
    }

    const deleteCustomHeadline = (index: number) => {
        const newVisibility = [...customHeadlinesVisible];
        newVisibility[index] = false;
        setCustomHeadlinesVisible(newVisibility);
        form.setValue(customHeadlineFields[index], "");
    }

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border-2 p-4 rounded-2xl w-[600px] bg-white">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter info about your blog post</FormLabel>
                            <FormControl>
                                <Textarea placeholder="A long time ago in a galaxy far, far away..." {...field} className="text-md" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {customHeadlineFields.map((fieldName, index) => (
                    customHeadlinesVisible[index] && (
                        <div key={fieldName} className="flex items-center space-x-2">
                            <FormField
                                control={form.control}
                                name={fieldName}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        {fieldName === "customHeadline1" && <FormLabel>Sample Headlines</FormLabel>}
                                        <FormControl>
                                            <div className="flex flex-row space">
                                                <Input className='mr-2' placeholder='Enter a sample headline' {...field} />
                                                <Button type="button" className='ml-2' onClick={() => deleteCustomHeadline(index)} variant="destructive">
                                                    X
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )
                ))}

                <div className="flex flex-row justify-between">
                    <Button type="submit">Submit</Button>
                    {customHeadlinesVisible.includes(false) && (
                        <Button type="button" onClick={addCustomHeadline}>
                            Add Headline
                        </Button>
                    )}


                </div>
            </form>
        </Form>
    )
}
