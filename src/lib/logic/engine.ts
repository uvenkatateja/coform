import type { FormLogic, LogicCondition } from "@/types/logic.types";

/**
 * Logic Engine
 * Evaluates rules against form data to determine field state
 */
export const logicEngine = {
    /**
     * Evaluate all rules and return settings for fields (e.g. visibility)
     */
    evaluate(data: Record<string, any>, logic?: FormLogic): { hiddenFields: Set<string> } {
        if (!logic || !logic.rules || logic.rules.length === 0) {
            return { hiddenFields: new Set() };
        }

        const hiddenFields = new Set<string>();
        const shownFields = new Set<string>(); // Fields explicitly shown by a rule (overrides default hide?)

        // Strategy:
        // We assume fields are visible by default.
        // If a rule says "Hide X", X is hidden.
        // If a rule says "Show X", X is shown.
        // "Show" usually implies "Hide if not met", but that gets complex.
        // Simple approach:
        // Rules trigger ACTIONS when met.
        // If a rule is NOT met, we might need to reverse the action?
        // Let's stick to explicit ACTIONS.
        // "When condition matches -> Perform Action".
        // If condition DOES NOT match -> Perform Reverse Action.

        // Example: Rule "Show field B if A=1"
        // Action: Show B.
        // If A=1 matches: Show B.
        // If A=1 fails: Hide B (Reverse of Show).

        logic.rules.forEach((rule) => {
            if (!rule.enabled) return;

            const limits = evaluateConditions(data, rule.conditions, rule.matchType);

            rule.actions.forEach((action) => {
                if (limits) {
                    // Condition MET
                    if (action.type === "show") shownFields.add(action.fieldId);
                    if (action.type === "hide") hiddenFields.add(action.fieldId);
                } else {
                    // Condition NOT MET - Reverse logic
                    if (action.type === "show") hiddenFields.add(action.fieldId); // Default to hide
                    if (action.type === "hide") shownFields.add(action.fieldId); // Default to show
                }
            });
        });

        // Conflict resolution: Show > Hide
        for (const id of shownFields) {
            hiddenFields.delete(id);
        }

        return { hiddenFields };
    },
};

/**
 * Evaluate a list of conditions
 */
function evaluateConditions(
    data: Record<string, any>,
    conditions: LogicCondition[],
    matchType: "all" | "any"
): boolean {
    if (conditions.length === 0) return true;

    if (matchType === "all") {
        // AND: Every condition must be true
        return conditions.every((c) => checkCondition(data, c));
    } else {
        // OR: At least one condition must be true
        return conditions.some((c) => checkCondition(data, c));
    }
}

/**
 * Check a single condition
 */
function checkCondition(data: Record<string, any>, condition: LogicCondition): boolean {
    const fieldValue = data[condition.fieldId];
    const targetValue = condition.value;

    // Handle empty checks
    if (condition.operator === "is_empty") {
        return isEmpty(fieldValue);
    }
    if (condition.operator === "is_not_empty") {
        return !isEmpty(fieldValue);
    }

    // If field is undefined/null and we are checking specific values, it's false
    if (fieldValue === undefined || fieldValue === null) return false;

    const strField = String(fieldValue).toLowerCase();
    const strTarget = String(targetValue).toLowerCase();
    const numField = Number(fieldValue);
    const numTarget = Number(targetValue);

    switch (condition.operator) {
        case "equals":
            return strField === strTarget;
        case "not_equals":
            return strField !== strTarget;
        case "contains":
            return strField.includes(strTarget);
        case "starts_with":
            return strField.startsWith(strTarget);
        case "ends_with":
            return strField.endsWith(strTarget);
        case "greater_than":
            return !isNaN(numField) && !isNaN(numTarget) && numField > numTarget;
        case "less_than":
            return !isNaN(numField) && !isNaN(numTarget) && numField < numTarget;
        default:
            return false;
    }
}

function isEmpty(value: any): boolean {
    return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}
