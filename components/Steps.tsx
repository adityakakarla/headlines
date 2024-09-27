import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export default function Steps() {

    const steps = [
        'enter the description of your blog post',
        'add old blog post headlines as samples',
        'build a bracket with AI-generated headlines',
        'pick headlines to find a winner',
        're-generate or re-start bracket as needed'
    ]
    return (
        <Carousel className="w-full max-w-64">
            <CarouselContent>
                {steps.map((step, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className="h-48 p-6">
                                    <h1 className="text-xl font-semibold">Step {index + 1}:</h1>
                                    <p className="text-lg mt-8">{step}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}