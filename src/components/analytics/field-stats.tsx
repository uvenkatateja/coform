import type { FieldStat } from "@/types/analytics.types";

interface FieldStatsProps {
    stats: FieldStat[];
}

/**
 * Field fill rate visualization
 */
export function FieldStats({ stats }: FieldStatsProps) {
    if (stats.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">No field data available</p>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium">Field Completion Rates</h3>
            <div className="space-y-2">
                {stats.map((stat) => (
                    <div key={stat.fieldId} className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="truncate max-w-[200px]">{stat.fieldLabel}</span>
                            <span className="text-muted-foreground">{stat.fillRate}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${stat.fillRate}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
