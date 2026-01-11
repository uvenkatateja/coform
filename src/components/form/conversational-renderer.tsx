"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FormFieldRenderer } from "./form-field-renderer";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import type { FormField } from "@/types/form.types";

interface ConversationalRendererProps {
    fields: FormField[];
    formData: Record<string, any>;
    onFieldChange: (fieldId: string, value: any) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    isValid: boolean;
    design?: {
        colors?: {
            primary: string;
            background: string;
            text: string;
        }
    };
}

export function ConversationalRenderer({
    fields,
    formData,
    onFieldChange,
    onSubmit,
    isValid,
    design
}: ConversationalRendererProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const currentField = fields[currentIndex];
    const progress = ((currentIndex + 1) / fields.length) * 100;

    const handleNext = useCallback(() => {
        if (currentIndex < fields.length - 1) {
            setDirection(1);
            setCurrentIndex((prev) => prev + 1);
        } else if (isValid) {
            onSubmit();
        }
    }, [currentIndex, fields.length, isValid, onSubmit]);

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex((prev) => prev - 1);
        }
    }, [currentIndex]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleNext();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext]);

    const variants = {
        enter: (direction: number) => ({
            y: direction > 0 ? 100 : -100,
            opacity: 0,
        }),
        center: {
            y: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            y: direction > 0 ? -100 : 100,
            opacity: 0,
        }),
    };

    const buttonStyle = design?.colors?.primary ? {
        backgroundColor: design.colors.primary,
        color: "#fff"
    } : {};

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto px-4 justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full p-4 md:p-8">
                <Progress value={progress} className="h-1" />
                <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                    <span>{currentIndex + 1} of {fields.length}</span>
                    <span className="hidden md:inline italic">Press Ctrl + Enter to continue</span>
                </div>
            </div>

            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="py-12"
                >
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <span className="text-primary font-mono text-lg" style={{ color: design?.colors?.primary }}>
                                {currentIndex + 1} →
                            </span>
                            <div className="flex-1">
                                <FormFieldRenderer
                                    field={currentField}
                                    value={formData[currentField.id]}
                                    onChange={(val) => onFieldChange(currentField.id, val)}
                                    formId="" // Not needed for pure render
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pl-10">
                            <Button
                                onClick={handleNext}
                                size="lg"
                                style={buttonStyle}
                                disabled={currentField.required && !formData[currentField.id]}
                            >
                                {currentIndex === fields.length - 1 ? (
                                    <>Submit <Check className="ml-2 h-4 w-4" /></>
                                ) : (
                                    <>OK <Check className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="fixed bottom-8 right-8 flex gap-2">
                <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentIndex === 0}>
                    <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNext} disabled={currentIndex === fields.length - 1}>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
