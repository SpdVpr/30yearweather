"use client";

import { Card, Title, List, ListItem, Icon } from "@tremor/react";
import { Umbrella, Shirt, CloudRain, Sun, Wind, Layers } from "lucide-react";
import { motion } from "framer-motion";

interface SmartSuitcaseProps {
    clothing: string[];
}

export default function SmartSuitcase({ clothing }: SmartSuitcaseProps) {
    // Mapping of clothing items to Lucide icons
    const getIcon = (item: string) => {
        const lower = item.toLowerCase();
        if (lower.includes("umbrella")) return Umbrella;
        if (lower.includes("rain")) return CloudRain;
        if (lower.includes("heavy") || lower.includes("coat")) return Wind;
        if (lower.includes("layer") || lower.includes("onion")) return Layers;
        return Shirt; // Default
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
        >
            <Card className="h-full rounded-xl shadow-md border-0 bg-gradient-to-br from-indigo-50 to-white ring-1 ring-indigo-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Shirt className="w-6 h-6" />
                    </div>
                    <Title className="text-gray-800">Smart Suitcase</Title>
                </div>

                <List className="mt-2">
                    {clothing.map((item) => (
                        <ListItem key={item} className="justify-start gap-4 py-3 border-indigo-100">
                            <Icon
                                icon={getIcon(item)}
                                size="sm"
                                variant="light"
                                color="indigo"
                                className="rounded-md"
                            />
                            <span className="font-medium text-gray-700">{item}</span>
                        </ListItem>
                    ))}
                </List>
            </Card>
        </motion.div>
    );
}
